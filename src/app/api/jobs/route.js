import { google } from "googleapis";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import connectDB from "../../../lib/db";
import User from "../../../models/User";
import creds from "../../../../secrets.json";

// 1. FORCE DYNAMIC
export const dynamic = "force-dynamic";

const SCOPES = [
  "https://www.googleapis.com/auth/spreadsheets",
  "https://www.googleapis.com/auth/drive",
];

async function getGoogleClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: creds.client_email,
      private_key: creds.private_key,
    },
    scopes: SCOPES,
  });
  return await auth.getClient();
}

async function getUserSheetId() {
  const user = await currentUser();
  if (!user) throw new Error("Unauthorized");

  const email = user.emailAddresses[0].emailAddress;
  const clerkId = user.id;

  await connectDB();
  let dbUser = await User.findOne({ clerkId });

  if (dbUser && dbUser.spreadsheetId) {
    return dbUser.spreadsheetId;
  }

  // --- NEW FANCY SHEET CREATION ---
  console.log(`Creating styled sheet for ${email}...`);
  const client = await getGoogleClient();
  const sheets = google.sheets({ version: "v4", auth: client });
  const drive = google.drive({ version: "v3", auth: client });

  // 1. Create the Sheet with Data
  const createRes = await sheets.spreadsheets.create({
    requestBody: {
      properties: { title: `Job Tracker - ${email}` },
      sheets: [
        {
          properties: {
            title: "Sheet1",
            gridProperties: { frozenRowCount: 2 }, // Freeze top 2 rows
          },
          data: [
            {
              startRow: 0,
              startColumn: 0,
              rowData: [
                // ROW 1: Big Title
                {
                  values: [
                    {
                      userEnteredValue: {
                        stringValue: "Internship Applications",
                      },
                    },
                  ],
                },
                // ROW 2: Headers
                {
                  values: [
                    { userEnteredValue: { stringValue: "id" } },
                    { userEnteredValue: { stringValue: "Job Title" } },
                    { userEnteredValue: { stringValue: "Company" } },
                    { userEnteredValue: { stringValue: "Application Date" } },
                    { userEnteredValue: { stringValue: "Status" } },
                    {
                      userEnteredValue: { stringValue: "Interview Scheduled" },
                    },
                    { userEnteredValue: { stringValue: "Job Location" } },
                    { userEnteredValue: { stringValue: "Application URL" } },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  });

  const newSheetId = createRes.data.spreadsheetId;
  const sheetId = createRes.data.sheets[0].properties.sheetId;

  // 2. Apply Formatting (Colors, Merges, Dropdowns)
  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: newSheetId,
    requestBody: {
      requests: [
        // A. Merge the Title Row (A1:H1)
        {
          mergeCells: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            mergeType: "MERGE_ALL",
          },
        },
        // B. Style Title Row (Blue Background, White Text, Center, Bold)
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 0,
              endRowIndex: 1,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.25, green: 0.35, blue: 0.75 }, // Blueish
                horizontalAlignment: "CENTER",
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  bold: true,
                  fontSize: 14,
                },
              },
            },
            fields:
              "userEnteredFormat(backgroundColor,horizontalAlignment,textFormat)",
          },
        },
        // C. Style Header Row (Green Background, White Text, Bold)
        {
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1,
              endRowIndex: 2,
              startColumnIndex: 0,
              endColumnIndex: 8,
            },
            cell: {
              userEnteredFormat: {
                backgroundColor: { red: 0.25, green: 0.65, blue: 0.35 }, // Greenish
                textFormat: {
                  foregroundColor: { red: 1, green: 1, blue: 1 },
                  bold: true,
                },
              },
            },
            fields: "userEnteredFormat(backgroundColor,textFormat)",
          },
        },
        // D. Add "Status" Dropdown (Column E / Index 4)
        {
          setDataValidation: {
            range: {
              sheetId: sheetId,
              startRowIndex: 2,
              endRowIndex: 1000,
              startColumnIndex: 4,
              endColumnIndex: 5,
            },
            rule: {
              condition: {
                type: "ONE_OF_LIST",
                values: [
                  { userEnteredValue: "Applied" },
                  { userEnteredValue: "Interviewing" },
                  { userEnteredValue: "Offer" },
                  { userEnteredValue: "Rejected" },
                ],
              },
              showCustomUi: true,
            },
          },
        },
        // E. Add "Interview" Checkbox (Column F / Index 5)
        {
          setDataValidation: {
            range: {
              sheetId: sheetId,
              startRowIndex: 2,
              endRowIndex: 1000,
              startColumnIndex: 5,
              endColumnIndex: 6,
            },
            rule: { condition: { type: "BOOLEAN" }, showCustomUi: true },
          },
        },
      ],
    },
  });

  // 3. Share with User
  await drive.permissions.create({
    fileId: newSheetId,
    requestBody: { role: "writer", type: "user", emailAddress: email },
  });

  // 4. Save to DB
  if (!dbUser) {
    dbUser = await User.create({ clerkId, email, spreadsheetId: newSheetId });
  } else {
    dbUser.spreadsheetId = newSheetId;
    await dbUser.save();
  }

  return newSheetId;
}

// --- API ROUTES ---

export async function GET(req) {
  try {
    const spreadsheetId = await getUserSheetId();
    const client = await getGoogleClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    // Read from Row 3 onwards (Skip Title & Headers)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Sheet1!A3:H",
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) return NextResponse.json([]);

    // Map rows to objects based on your specific columns
    const data = rows.map((row) => ({
      id: row[0] || "",
      job_title: row[1] || "",
      company: row[2] || "",
      application_date: row[3] || "",
      status: row[4] || "Applied",
      interview_scheduled: row[5] === "TRUE", // Handle checkbox
      job_location: row[6] || "",
      application_url: row[7] || "",
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const spreadsheetId = await getUserSheetId();
    const client = await getGoogleClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const newRow = [
      Date.now().toString().slice(-6), // Simple ID
      body.job_title,
      body.company,
      body.application_date || new Date().toISOString().split("T")[0],
      body.status || "Applied",
      "FALSE", // Interview checkbox default
      body.job_location,
      body.application_url,
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Sheet1!A3:H",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [newRow] },
    });

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
