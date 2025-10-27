import fetch from "node-fetch";

export async function handler(event, context) {
  const baseId = "appXXXXXXXX"; // ton Base ID Airtable
  const apiKey = "keyXXXXXXXX"; // ta clé API Airtable
  const table = "Compteurs";
  const recordName = "Compteur principal";

  try {
    const getRes = await fetch(`https://api.airtable.com/v0/${baseId}/${table}?filterByFormula={Nom}="${recordName}"`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    });
    const data = await getRes.json();
    const recordId = data.records[0].id;
    const currentValue = data.records[0].fields.Valeur;
    const newValue = currentValue + 1;

    await fetch(`https://api.airtable.com/v0/${baseId}/${table}/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ fields: { Valeur: newValue } })
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ newValue })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
}
