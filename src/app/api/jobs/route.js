import { google } from "googleapis";
import path from "path";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. Setup Auth
    // Note: In production, we usually use environment variables, but for local dev this works.
    const KEY_FILE_PATH = path.join(process.cwd(), "secrets.json");

    const auth = new google.auth.GoogleAuth({
      keyFile: KEY_FILE_PATH,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // 2. Fetch Data
    // Replace this ID with YOUR actual Spreadsheet ID
    const SPREADSHEET_ID = "1pcxrDMSJze81olizpBN1RwsUf2uihUcF3zk_PoTzSIA";
    const RANGE = "Sheet1!A:H"; // Make sure this matches your tab name

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
    });

    const rows = response.data.values;

    // 3. Format Data (Turn array of arrays into array of objects)
    // Assumes Row 0 is headers: [id, Job Title, Company, ...]
    if (!rows || rows.length === 0) return NextResponse.json([]);

    const headers = rows[0];
    const data = rows.slice(1).map((row) => {
      let obj = {};
      headers.forEach((header, index) => {
        // Clean up header names (e.g. "Job Title" -> "jobTitle")
        const cleanKey = header.toLowerCase().replace(/ /g, "_");
        obj[cleanKey] = row[index] || ""; // Handle empty cells
      });
      return obj;
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
