export async function handler(event, context) {
  const baseId = "appdqVio1eZpV3qDP";
  const apiKey = process.env.AIRTABLE_API_KEY;
  const table = "Table 1";
  const recordName = "Compteur principal";

  // --- ✅ CORS headers ---
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  try {
    // === Lecture actuelle ===
    const getRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?filterByFormula={Nom}="${recordName}"`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const data = await getRes.json();
    if (!data.records?.length) throw new Error("Aucun enregistrement trouvé");

    const recordId = data.records[0].id;
    const currentValue = data.records[0].fields.Valeur || 0;
    const newValue = currentValue + 1;

    // === Mise à jour dans Airtable ===
    await fetch(`https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { Valeur: newValue } }),
    });

    return {
      statusCode: 200,
      headers, // ✅ très important ici
      body: JSON.stringify({ newValue }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

