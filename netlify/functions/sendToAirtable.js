// netlify/functions/sendToAirtable.js

export async function handler(event) {
  const baseId = "appDFmI6RTgPRsdPj"; // ✅ Ton Base ID Airtable
  const table = "formulaire"; // ✅ Nom exact de ta table Airtable
  const token = process.env.AIRTABLE_API_KEY_FORM; // ✅ Clé API (configurée dans Netlify)

  // --- ✅ CORS : autoriser Webflow à accéder à cette fonction
  const headers = {
    "Access-Control-Allow-Origin": "*", // ⚠️ Temporaire — à remplacer plus tard par ton domaine Webflow exact
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
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
    // --- Lecture des données envoyées par le formulaire Webflow
    const data = JSON.parse(event.body || "{}");

    // --- Vérification basique
    if (!data.Nom || !data.Email) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Champs requis manquants." }),
      };
    }

    // --- Construction du record Airtable
    const record = {
      fields: {
        Nom: data.Nom,
        Prenom: data.Prenom || "",
        Ville: data.Ville || "",
        Type: data.Type || "",
        RGPD: data.RGPD === true || data.RGPD === "on" ? true : false,
        Email: data.Email,
      },
    };

    // --- Envoi des données vers Airtable
    const res = await fetch(
      `https://api.airtable.com/v0/${baseId}/${encodeURIComponent(table)}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(record),
      }
    );

    // --- Gestion des erreurs d'API
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Erreur Airtable : ${errorText}`);
    }

    // --- Réponse réussie
    const result = await res.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, id: result.id }),
    };
  } catch (error) {
    console.error("Erreur :", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message }),
    };
  }
}


