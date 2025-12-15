import { google } from "googleapis";
import { NextResponse } from "next/server";
import creds from "../../../../secrets.json";

// 1. FORCE DYNAMIC MODE
export const dynamic = "force-dynamic";
export const revalidate = 0;

const SPREADSHEET_ID = "1pcxrDMSJze81olizpBN1RwsUf2uihUcF3zk_PoTzSIA";
const SHEET_NAME = "Sheet1";

async function getSheets() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const client = await auth.getClient();
  return google.sheets({ version: "v4", auth: client });
}

// 2. CRITICAL FIX: Added 'req' parameter to force dynamic execution
export async function GET(req) {
  try {
    // We log this so you can see in your terminal when the button is clicked
    console.log("API: Fetching fresh data from Google Sheets...");

    const sheets = await getSheets();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return NextResponse.json([]);

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        const cleanKey = header.toLowerCase().replace(/ /g, "_");
        obj[cleanKey] = row[index] || "";
      });
      return obj;
    });

    // 3. NUCLEAR NO-CACHE HEADERS
    return NextResponse.json(data, {
      status: 200,
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
        "Surrogate-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const { company, newStatus } = await request.json();
    const sheets = await getSheets();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    });

    const rows = response.data.values;
    const headers = rows[0];

    const companyColIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("company")
    );
    const statusColIndex = headers.findIndex((h) =>
      h.toLowerCase().includes("status")
    );

    if (companyColIndex === -1 || statusColIndex === -1) {
      return NextResponse.json({ error: "Columns not found" }, { status: 400 });
    }

    const rowIndex =
      rows.findIndex(
        (row) =>
          row[companyColIndex]?.trim().toLowerCase() ===
          company?.trim().toLowerCase()
      ) + 1;

    if (rowIndex > 0) {
      const statusColLetter = String.fromCharCode(65 + statusColIndex);
      const updateRange = `${SHEET_NAME}!${statusColLetter}${rowIndex}`;

      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: updateRange,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [[newStatus]] },
      });

      return NextResponse.json({ message: "Success" }, { status: 200 });
    } else {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { error: error.message || "Server Error" },
      { status: 500 }
    );
  }
}
