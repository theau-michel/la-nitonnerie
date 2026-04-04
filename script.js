let ALL_WORKS = [];
let curFilter = "all";

async function loadData() {
  try {
    const res = await fetch("/.netlify/functions/get-works");
    if (!res.ok) throw new Error("Impossible de charger les œuvres");

    const data = await res.json();

    ALL_WORKS = (data.records || []).map((item) => {
      const f = item.fields || {};

      return {
        titre: f["Titre"] || "Sans titre",
        technique: f["Technique"] || "",
        categorie: f["Catégorie"] || "",
        photo: f["Photo de l'œuvre"]?.[0]?.url || ""
      };
    });

    renderGal(curFilter);
    updateStats();
  } catch (e) {
    document.getElementById("gg").innerHTML =
      `<div class="state-msg">Impossible de charger les œuvres.</div>`;
    document.getElementById("count-label").textContent = "";
  }
}

function card(w) {
  const isPetit =
    w.categorie === "Petit Niton (3 - 6 ans)" ||
    w.categorie === "Petits Nitons";

  const badge = w.categorie
    ? `<span class="cat-badge ${isPetit ? "badge-p" : "badge-g"}">${w.categorie}</span>`
    : "";

  const photo = w.photo
    ? `<img src="${w.photo}" alt="${w.titre}">`
    : "";

  return `
    <div class="ac">
      <div class="ai">
        ${photo}
        <div class="ao"></div>
        ${badge}
      </div>
      <div class="at">
        <h4>${w.titre}</h4>
        ${w.technique ? `<div class="by">${w.technique}</div>` : ""}
      </div>
    </div>
  `;
}

function renderGal(filter) {
  curFilter = filter;

  const list = filter === "all"
    ? ALL_WORKS
    : ALL_WORKS.filter(
        (w) => w.categorie === filter || w.technique === filter
      );

  document.getElementById("gg").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="state-msg">Aucune œuvre dans cette catégorie pour le moment.</div>`;

  document.getElementById("count-label").textContent =
    `${list.length} œuvre${list.length > 1 ? "s" : ""} exposée${list.length > 1 ? "s" : ""}`;
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

loadData();
