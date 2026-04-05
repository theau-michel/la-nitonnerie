const AIRTABLE_TOKEN = "patXBTkvRqR87CFKO.92a2f3540374de1fca10cf9899844e705358fe441c5bf5d56ff2e1328db36621";
const AIRTABLE_BASE_ID = "appCRGgKOrUSJYWJ8";
const AIRTABLE_TABLE_OEUVRES = "tbl9J6znXf0FuiW7n";

let ALL_WORKS = [];
let curFilter = "all";

async function loadData() {
  try {
    const params = new URLSearchParams();

    ["Titre", "Technique", "Photo de l'œuvre", "Catégorie", "Publier"].forEach((f) =>
      params.append("fields[]", f)
    );

    // Temporairement, on n'applique PAS le filtre Publier
    // pour vérifier que les œuvres remontent bien.
    // Quand tout marche, on pourra remettre :
    // params.append("filterByFormula", "{Publier}=1");

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${encodeURIComponent(AIRTABLE_TABLE_OEUVRES)}?${params.toString()}`;

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Erreur Airtable ${res.status}`);
    }

    const data = await res.json();
    console.log("DATA AIRTABLE =", data);

    ALL_WORKS = (data.records || []).map((item) => {
      const f = item.fields || {};
      return {
        titre: f["Titre"] || "Sans titre",
        technique: f["Technique"] || "",
        categorie: f["Catégorie"] || "",
        photo: f["Photo de l'œuvre"]?.[0]?.url || ""
      };
    });

    document.getElementById("count-label").textContent = `RAW: ${ALL_WORKS.length}`;

    renderGal(curFilter);
    updateStats();
  } catch (e) {
    document.getElementById("gg").innerHTML =
      `<div class="state-msg">Impossible de charger les œuvres.</div>`;
    document.getElementById("count-label").textContent = "";
    document.getElementById("stat-oeuvres").textContent = "—";
    document.getElementById("stat-artistes").textContent = "—";
    console.error(e);
  }
}

function card(w) {
  const isPetit = w.categorie === "Petits Nitons";

  const badge = w.categorie
    ? `<span class="cat-badge ${isPetit ? "badge-p" : "badge-g"}">${escapeHtml(w.categorie)}</span>`
    : "";

  const photo = w.photo
    ? `<img src="${w.photo}" alt="${escapeHtml(w.titre)}">`
    : "";

  return `
    <div class="ac">
      <div class="ai">
        ${photo}
        <div class="ao"></div>
        ${badge}
      </div>
      <div class="at">
        <h4>${escapeHtml(w.titre)}</h4>
        ${w.technique ? `<div class="by">${escapeHtml(w.technique)}</div>` : ""}
      </div>
    </div>
  `;
}

function renderGal(filter) {
  curFilter = filter;

  const list =
    filter === "all"
      ? ALL_WORKS
      : ALL_WORKS.filter((w) => {
          const technique = (w.technique || "").toLowerCase();
          const target = String(filter).toLowerCase();
          return w.categorie === filter || technique === target;
        });

  document.getElementById("gg").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="state-msg">Aucune œuvre dans cette catégorie pour le moment.</div>`;
}

function updateStats() {
  document.getElementById("stat-oeuvres").textContent = ALL_WORKS.length;
  document.getElementById("stat-artistes").textContent = "—";
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fb")) {
    document.querySelectorAll(".fb").forEach((b) => b.classList.remove("on"));
    e.target.classList.add("on");
    renderGal(e.target.dataset.f);
  }
});

function go(p) {
  document.querySelectorAll(".pg").forEach((x) => x.classList.remove("on"));
  document.querySelectorAll(".nav-links a").forEach((x) => x.classList.remove("on"));
  document.getElementById("pg-" + p).classList.add("on");
  document.getElementById("n" + p).classList.add("on");
  window.scrollTo(0, 0);
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadData();
