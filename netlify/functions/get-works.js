exports.handler = async function () {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hasToken: !!process.env.AIRTABLE_TOKEN,
      tokenStartsWithPat: process.env.AIRTABLE_TOKEN
        ? process.env.AIRTABLE_TOKEN.startsWith("pat")
        : false,
      tokenLength: process.env.AIRTABLE_TOKEN
        ? process.env.AIRTABLE_TOKEN.length
        : 0,
      hasBaseId: !!process.env.AIRTABLE_BASE_ID,
      baseStartsWithApp: process.env.AIRTABLE_BASE_ID
        ? process.env.AIRTABLE_BASE_ID.startsWith("app")
        : false,
      hasTableOeuvres: !!process.env.AIRTABLE_TABLE_OEUVRES,
      hasTableArtistes: !!process.env.AIRTABLE_TABLE_ARTISTES
    })
  };
};
