const AIRTABLE_TOKEN = "patXBTkvRqR87CFKO.92a2f3540374de1fca10cf9899844e705358fe441c5bf5d56ff2e1328db36621";
const AIRTABLE_BASE_ID = "appCRGgKOrUSJYWJ8";
const AIRTABLE_TABLE_OEUVRES = "Œuvres";

let DATA = [];

async function load() {
  try {
    const url = `https://api.airtable.com/v0/${BASE}/${encodeURIComponent(TABLE)}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    });

    if (!res.ok) throw new Error("Erreur API");

    const json = await res.json();
    console.log(json);

    DATA = json.records.map(r => ({
      titre: r.fields["Titre"] || "",
      technique: r.fields["Technique"] || "",
      categorie: r.fields["Catégorie"] || "",
      photo: r.fields["Photo de l'œuvre"]?.[0]?.url || ""
    }));

    render("all");

    document.getElementById("count").innerText =
      DATA.length + " œuvres";

  } catch (e) {
    console.error(e);
    document.getElementById("gallery").innerHTML =
      "Erreur de chargement";
  }
}

function render(filter) {

  let list = DATA;

  if (filter !== "all") {
    list = DATA.filter(x =>
      x.categorie === filter
    );
  }

  const html = list.map(x => `
    <div class="card">
      <img src="${x.photo}" />
      <h3>${x.titre}</h3>
      <p>${x.technique}</p>
    </div>
  `).join("");

  document.getElementById("gallery").innerHTML = html;
}

document.querySelectorAll(".filters button").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".filters button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    render(btn.dataset.f);
  };
});

load();
