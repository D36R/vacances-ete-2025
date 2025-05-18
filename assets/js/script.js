// Chargement de la liste des destinations et initialisation des onglets
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
    loadDestination(destinations[0], 0);
  })
  .catch(e => console.error('Erreur fetch destinations:', e));

let destinationsData = [];

function loadDestination(dest, idx) {
  fetch(`assets/data/${dest.key}.json`)
    .then(r => r.json())
    .then(data => {
      destinationsData[idx] = { dest, data };
      renderTabContent(idx);
    })
    .catch(err => console.error(`Erreur chargement ${dest.key}:`, err));
}

function renderTabContent(idx) {
  const { dest, data } = destinationsData[idx];
  const contents = document.getElementById('contents');
  contents.innerHTML = '';

  // En-tête avec titre de la destination
  const header = document.createElement('div');
  header.innerHTML = `<h2>${dest.label}</h2>`;
  contents.appendChild(header);

  // Parcours de chaque section du JSON
  Object.keys(data).forEach(sectionKey => {
    const items = data[sectionKey];
    if (!Array.isArray(items) || items.length === 0) return; // ignorer sections vides

    // Création de la section
    const section = document.createElement('section');
    section.innerHTML = `<h3>${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}</h3><div class=\"cards\"></div>`;
    const cards = section.querySelector('.cards');

    items.forEach(item => {
      // Fallbacks pour rendre le script tolérant
      const title = item.titre || item.nom || 'Titre indisponible';
      const desc = item.description || item.points_interet || item.specialites || '';
      let imgSrc = '';
      if (item.image) {
        imgSrc = `assets/images/${item.image}`;
      } else if (item.image_url) {
        imgSrc = item.image_url;
      }
      const url = item.url || item.lien || '';

      // Création de la carte
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        ${imgSrc ? `<img src=\"${imgSrc}\" alt=\"${title}\">` : ''}
        <h4>${title}</h4>
        <p>${desc}</p>
        ${url ? `<a href=\"${url}\" target=\"_blank\">Voir plus</a>` : ''}
      `;
      cards.appendChild(card);
    });

    contents.appendChild(section);
  });
}

function showDestination(idx) {
  // Mise à jour de l'onglet actif
  document.querySelectorAll('.tab').forEach((el, i) => el.classList.toggle('active', i === idx));
  // Affichage ou chargement
  if (destinationsData[idx]) {
    renderTabContent(idx);
  } else {
    fetch('assets/data/destinations.json')
      .then(r => r.json())
      .then(destinations => loadDestination(destinations[idx], idx))
      .catch(e => console.error('Erreur reload destinations:', e));
  }
}
