// 1. Charger la liste des destinations et initialiser les onglets
fetch('assets/data/destinations.json')
  .then(r => r.json())
  .then(destinations => {
    const tabs = document.getElementById('tabs');
    destinations.forEach((dest, idx) => {
      const btn = document.createElement('button');
      btn.className = 'tab' + (idx === 0 ? ' active' : '');
      btn.textContent = dest.label;
      btn.onclick = () => showDestination(idx);
      tabs.appendChild(btn);
    });
    // Afficher la première destination par défaut
    loadDestination(destinations[0], 0);
  })
  .catch(e => console.error(e));

let destinationsData = [];

function loadDestination(dest, idx) {
  // Charger le JSON complet pour cette destination
  fetch(`assets/data/${dest.key}.json`)
    .then(r => r.json())
    .then(data => {
      destinationsData[idx] = { dest, data };
      renderTabContent(idx);
    });
}

function renderTabContent(idx) {
  const { dest, data } = destinationsData[idx];
  const contents = document.getElementById('contents');
  contents.innerHTML = '';

  // Titre et info dates/adresse (à adapter si besoin)
  const header = document.createElement('div');
  header.innerHTML = `
    <h2>${dest.label}</h2>
    <!-- Dates et adresse statiques ou dynamiques -->
  `;
  contents.appendChild(header);

  // Pour chaque rubrique présente dans le JSON
  Object.keys(data).forEach(sectionKey => {
    const section = document.createElement('section');
    section.innerHTML = `<h3>${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}</h3><div class="cards"></div>`;
    const cards = section.querySelector('.cards');
    data[sectionKey].forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <img src="assets/images/${item.image}" alt="${item.titre}">
        <h4>${item.titre}</h4>
        <p>${item.description}</p>
        ${item.url ? `<a href="${item.url}" target="_blank">Voir plus</a>` : ''}
      `;
      cards.appendChild(card);
    });
    contents.appendChild(section);
  });
}

function showDestination(idx) {
  // Mettre à jour l'onglet actif
  document.querySelectorAll('.tab').forEach((el,i)=> el.classList.toggle('active', i===idx));
  // Si déjà chargé, afficher ; sinon, charger puis afficher
  if (destinationsData[idx]) {
    renderTabContent(idx);
  } else {
    fetch('assets/data/destinations.json')
      .then(r=>r.json())
      .then(destinations=> loadDestination(destinations[idx], idx));
  }
}
