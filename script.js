let ALL_WORKS = [];
let curFilter = "all";

async function loadData() {
  try {
    const res = await fetch("/.netlify/functions/get-works");
    if (!res.ok) throw new Error("Impossible de charger les œuvres");
    ALL_WORKS = await res.json();

    renderGal(curFilter);
    updateStats();
  } catch (e) {
    document.getElementById("gg").innerHTML =
      `<div class="state-msg">Impossible de charger les œuvres.</div>`;
    document.getElementById("count-label").textContent = "";
  }
}

function card(w) {
  const isPetit = w.categorie === "Petit Niton (3 - 6 ans)";
  const badge = w.categorie
    ? `<span class="cat-badge ${isPetit ? "badge-p" : "badge-g"}">${w.categorie}</span>`
    : "";

  const photo = w.photo
    ? `<img src="${w.photo}" alt="${w.titre}">`
    : "";

  const meta = [w.prenom, w.technique].filter(Boolean).join(" · ");

  return `
    <div class="ac">
      <div class="ai">
        ${photo}
        <div class="ao"></div>
        ${badge}
      </div>
      <div class="at">
        <h4>${w.titre || "Sans titre"}</h4>
        ${meta ? `<div class="by">${meta}</div>` : ""}
        ${w.age ? `<span class="ag">${w.age} ans</span>` : ""}
      </div>
    </div>
  `;
}

function renderGal(filter) {
  curFilter = filter;

  const list = filter === "all"
    ? ALL_WORKS
    : ALL_WORKS.filter(
        w => w.categorie === filter || w.technique === filter
      );

  document.getElementById("gg").innerHTML = list.length
    ? list.map(card).join("")
    : `<div class="state-msg">Aucune œuvre dans cette catégorie pour le moment.</div>`;

  document.getElementById("count-label").textContent =
    `${list.length} œuvre${list.length > 1 ? "s" : ""} exposée${list.length > 1 ? "s" : ""}`;
}

function updateStats() {
  document.getElementById("stat-oeuvres").textContent = ALL_WORKS.length;
  const uniqueArtists = new Set(ALL_WORKS.map(w => `${w.prenom}-${w.age}`));
  document.getElementById("stat-artistes").textContent = uniqueArtists.size;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fb")) {
    document.querySelectorAll(".fb").forEach(b => b.classList.remove("on"));
    e.target.classList.add("on");
    renderGal(e.target.dataset.f);
  }
});

function go(p) {
  document.querySelectorAll(".pg").forEach(x => x.classList.remove("on"));
  document.querySelectorAll(".nav-links a").forEach(x => x.classList.remove("on"));
  document.getElementById("pg-" + p).classList.add("on");
  document.getElementById("n" + p).classList.add("on");
  window.scrollTo(0, 0);
}

loadData();
async function loadWorks() {
  const res = await fetch('/.netlify/functions/get-works');
  const data = await res.json();

  const container = document.getElementById('gallery');

  data.records.forEach(item => {
    const f = item.fields;

    const imageUrl = f["Photo de l'œuvre"]?.[0]?.url;

    const card = document.createElement('div');
    card.className = 'card';

    card.innerHTML = `
      <img src="${imageUrl}" alt="${f.Titre}" />
      <h3>${f.Titre}</h3>
      <p>${f.Technique}</p>
      <p>${f.Catégorie}</p>
    `;

    container.appendChild(card);
  });
}

loadWorks();
