export async function handler(event, context) {
  const baseId = "appdqVio1eZpV3qDP"; // ✅ ton Base ID Airtable
  const apiKey = process.env.AIRTABLE_API_KEY; // ✅ clé API cachée
  const table = "Table 1"; // ✅ nom exact de ta table
  const recordName = "Compteur principal"; // ✅ ton enregistrement

  // --- ✅ CORS : autoriser Webflow à accéder à cette fonction
  const headers = {
    "Access-Control-Allow-Origin": "*", // (tu peux mettre ton domaine Webflow à la place du * si tu veux sécuriser)
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // --- Réponse directe aux requêtes OPTIONS (prévol CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "OK",
    };
  }

  try {
    // === 1️⃣ Lecture seule sans incrémenter ===
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?filterByFormula={Nom}="${recordName}"`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const data = await res.json();

    if (!data.records?.length) {
      throw new Error("Aucun enregistrement trouvé");
    }

    const value = data.records[0].fields.Valeur || 0;

    // ✅ On renvoie la valeur + les headers CORS
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ value }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message }),
    };
  }
}


