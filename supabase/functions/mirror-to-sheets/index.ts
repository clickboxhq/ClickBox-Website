// Edge function: mirror form submissions into a Google Sheet via the Lovable
// connector gateway. Primary persistence is the database; this is a best-effort
// mirror for stakeholder visibility.
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const GATEWAY_URL = "https://connector-gateway.lovable.dev/google_sheets/v4";

const SHEET_TABS: Record<string, string> = {
  fellowship: "Fellowship Applications",
  product: "Product Inquiries",
  contact: "Contact Requests",
};

// Header layouts per tab — keep stable so existing sheets keep aligning.
const HEADERS: Record<string, string[]> = {
  fellowship: [
    "Timestamp",
    "Full Name",
    "Email",
    "LinkedIn",
    "Resume URL",
    "Preferred Pathway",
    "Certifications",
    "Certification Links",
    "Relevant Experience",
    "Motivation",
    "Portfolio",
  ],
  product: ["Timestamp", "Name", "Company", "Email", "Product Interest", "Message"],
  contact: ["Timestamp", "Name", "Email", "Phone", "Company", "Subject", "Message"],
};

const FIELDS: Record<string, string[]> = {
  fellowship: [
    "full_name",
    "email",
    "linkedin",
    "resume_url",
    "preferred_pathway",
    "certifications",
    "certification_links",
    "relevant_experience",
    "motivation",
    "portfolio",
  ],
  product: ["name", "company", "email", "product_interest", "message"],
  contact: ["name", "email", "phone", "company", "subject", "message"],
};

const jsonResponse = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const GOOGLE_SHEETS_API_KEY = Deno.env.get("GOOGLE_SHEETS_API_KEY");
  const SPREADSHEET_ID = Deno.env.get("GOOGLE_SHEETS_SPREADSHEET_ID");

  if (!LOVABLE_API_KEY) return jsonResponse(500, { error: "LOVABLE_API_KEY missing" });
  if (!GOOGLE_SHEETS_API_KEY)
    return jsonResponse(500, { error: "GOOGLE_SHEETS_API_KEY missing (connect Google Sheets)" });
  if (!SPREADSHEET_ID)
    return jsonResponse(200, {
      ok: false,
      skipped: true,
      reason:
        "GOOGLE_SHEETS_SPREADSHEET_ID not configured — submission saved to database only.",
    });

  let body: { tab?: string; row?: Record<string, unknown> };
  try {
    body = await req.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const tab = String(body.tab ?? "");
  const row = body.row ?? {};
  const sheetName = SHEET_TABS[tab];
  const fields = FIELDS[tab];
  const headers = HEADERS[tab];

  if (!sheetName || !fields || !headers)
    return jsonResponse(400, { error: `Unknown tab: ${tab}` });

  // Ensure the sheet/tab exists & has a header row (idempotent).
  await ensureTab(SPREADSHEET_ID, sheetName, headers, LOVABLE_API_KEY, GOOGLE_SHEETS_API_KEY);

  const values = [
    new Date().toISOString(),
    ...fields.map((f) => formatCell(row[f])),
  ];

  const range = `'${sheetName}'!A:A`;
  const appendUrl = `${GATEWAY_URL}/spreadsheets/${SPREADSHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`;

  const resp = await fetch(appendUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GOOGLE_SHEETS_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ values: [values] }),
  });

  if (!resp.ok) {
    const text = await resp.text();
    return jsonResponse(502, {
      error: "Sheets append failed",
      status: resp.status,
      detail: text.slice(0, 500),
    });
  }

  await resp.text();
  return jsonResponse(200, { ok: true });
});

const formatCell = (v: unknown): string => {
  if (v === null || v === undefined) return "";
  if (typeof v === "string") return v;
  return JSON.stringify(v);
};

const ensureTab = async (
  spreadsheetId: string,
  sheetName: string,
  headers: string[],
  lovableKey: string,
  connectorKey: string,
) => {
  // Inspect spreadsheet to see if sheet exists
  const metaResp = await fetch(`${GATEWAY_URL}/spreadsheets/${spreadsheetId}?fields=sheets.properties`, {
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": connectorKey,
    },
  });
  if (!metaResp.ok) {
    await metaResp.text();
    return;
  }
  const meta = await metaResp.json();
  const exists = (meta.sheets ?? []).some(
    (s: { properties?: { title?: string } }) => s.properties?.title === sheetName,
  );

  if (!exists) {
    const addResp = await fetch(`${GATEWAY_URL}/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "X-Connection-Api-Key": connectorKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        requests: [{ addSheet: { properties: { title: sheetName } } }],
      }),
    });
    await addResp.text();

    // Write headers
    const headerRange = `'${sheetName}'!A1`;
    const writeResp = await fetch(
      `${GATEWAY_URL}/spreadsheets/${spreadsheetId}/values/${headerRange}?valueInputOption=RAW`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": connectorKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [headers] }),
      },
    );
    await writeResp.text();
  }
};
