exports.handler = async function () {
  const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
  const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
  const AIRTABLE_TABLE_OEUVRES = process.env.AIRTABLE_TABLE_OEUVRES;
  const AIRTABLE_TABLE_ARTISTES = process.env.AIRTABLE_TABLE_ARTISTES;

  if (!AIRTABLE_TOKEN || !AIRTABLE_BASE_ID || !AIRTABLE_TABLE_OEUVRES || !AIRTABLE_TABLE_ARTISTES) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Variables d'environnement manquantes" }),
    };
  }

  const headers = {
    Authorization: `Bearer ${AIRTABLE_TOKEN}`,
  };

  async function fetchAll(tableId, fields) {
    let records = [];
    let offset = "";

    do {
      const params = new URLSearchParams();
      fields.forEach((f) => params.append("fields[]", f));
      if (offset) params.append("offset", offset);

      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${tableId}?${params.toString()}`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Airtable error ${res.status}`);
      }

      const data = await res.json();
      records = records.concat(data.records);
      offset = data.offset || "";
    } while (offset);

    return records;
  }

  try {
    const artistesRecords = await fetchAll(AIRTABLE_TABLE_ARTISTES, [
      "Prénom",
      "Âge"
    ]);

    const artistesMap = {};
    artistesRecords.forEach((r) => {
      artistesMap[r.id] = {
        prenom: r.fields["Prénom"] || "",
        age: r.fields["Âge"] || "",
      };
    });

    let oeuvres = [];
    let offset = "";

    do {
      const params = new URLSearchParams();
      [
        "Titre",
        "Technique",
        "Photo de l'œuvre",
        "Catégorie",
        "Publier",
        "Artistes",
      ].forEach((f) => params.append("fields[]", f));
      params.append("filterByFormula", "{Publier}=1");
      if (offset) params.append("offset", offset);

      const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_OEUVRES}?${params.toString()}`;
      const res = await fetch(url, { headers });

      if (!res.ok) {
        throw new Error(`Airtable error ${res.status}`);
      }

      const data = await res.json();
      oeuvres = oeuvres.concat(data.records);
      offset = data.offset || "";
    } while (offset);

    const result = oeuvres.map((r) => {
      const f = r.fields;
      const artisteId = f["Artistes"] ? f["Artistes"][0] : null;
      const artiste = artisteId ? artistesMap[artisteId] : null;

      return {
        id: r.id,
        titre: f["Titre"] || "Sans titre",
        technique: f["Technique"] || "",
        categorie: f["Catégorie"] || "",
        photo: f["Photo de l'œuvre"] ? f["Photo de l'œuvre"][0].url : null,
        prenom: artiste ? artiste.prenom : "",
        age: artiste ? artiste.age : "",
      };
    });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
