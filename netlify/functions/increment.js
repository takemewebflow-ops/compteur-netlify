export async function handler(event, context) {
  // === 🔐 Variables principales ===
  const baseId = "appdqVio1eZpV3qDP"; // ✅ ton Base ID Airtable
  const apiKey = process.env.AIRTABLE_API_KEY; // ✅ clé API cachée dans Netlify
  const table = "Table 1"; // ✅ ton vrai nom de table
  const recordName = "Compteur principal"; // ✅ ton enregistrement

  try {
    // === 1️⃣ Lecture de la valeur actuelle ===
    const getRes = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}?filterByFormula=FIND("${recordName}", {Nom})`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    const data = await getRes.json();

    // === Sécurité : si pas de résultat, on stoppe ===
    if (!data.records || data.records.length === 0) {
      throw new Error("Aucun enregistrement trouvé pour Compteur principal");
    }

    // === 2️⃣ Récupère l’ID + valeur actuelle ===
    const recordId = data.records[0].id;
    const currentValue = data.records[0].fields.Valeur || 0;
    const newValue = currentValue + 1;

    // === 3️⃣ Mise à jour de la valeur dans Airtable ===
    await fetch(`https://api.airtable.com/v0/${baseId}/${table}/${recordId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ fields: { Valeur: newValue } }),
    });

    // === 4️⃣ Réponse ===
    return {
      statusCode: 200,
      body: JSON.stringify({ newValue }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
}

