export async function handler(event, context) {
  const baseId = "appdqVio1eZpV3qDP"; // ✅ ton Base ID Airtable
  const apiKey = process.env.AIRTABLE_API_KEY; // ✅ clé API dans Netlify
  const table = "Table 1";
  const recordName = "Compteur principal";

  try {
    // 🔹 Lecture seule sans incrémenter
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

    return {
      statusCode: 200,
      body: JSON.stringify({ value }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}
