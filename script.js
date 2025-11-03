const form = document.getElementById('creation-form');
const container = document.getElementById('creations-container');
const formSection = document.getElementById('form-section');
const revealBtn = document.getElementById('btn-reveal-form');
const showFormNav = document.getElementById('show-form');
const checkbox = document.getElementById('forSale');
const priceInput = document.getElementById('price');
const searchBar = document.getElementById('search-bar');

let creations = JSON.parse(localStorage.getItem('creations')) || [];

// ✅ afficher/masquer le formulaire
function toggleForm() {
  formSection.classList.toggle('hidden');
  window.location.hash = "#form-section";
}
revealBtn.addEventListener('click', toggleForm);
showFormNav.addEventListener('click', toggleForm);

// ✅ activer le champ prix si "à vendre" est coché
checkbox.addEventListener('change', () => {
  priceInput.disabled = !checkbox.checked;
  if (!checkbox.checked) priceInput.value = "";
});

// ✅ afficher les créations
function displayCreations(filtered = creations) {
  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<p>Aucune œuvre trouvée.</p>';
    return;
  }

  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.story}</p>
      ${item.forSale ? `<p class="price">À vendre : ${item.price} €</p>` : ''}
      ${item.link ? `<a href="${item.link}" target="_blank">Découvrir l’artiste</a>` : ''}
    `;
    container.appendChild(card);
  });
}

// ✅ ajout d’une création
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const newCreation = {
    title: form.title.value,
    story: form.story.value,
    image: form.image.value,
    link: form.link.value,
    forSale: checkbox.checked,
    price: checkbox.checked ? form.price.value : null
  };
  creations.push(newCreation);
  localStorage.setItem('creations', JSON.stringify(creations));
  form.reset();
  priceInput.disabled = true;
  displayCreations();
});

// ✅ recherche en direct
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  const filtered = creations.filter(c =>
    c.title.toLowerCase().includes(term) ||
    c.story.toLowerCase().includes(term)
  );
  displayCreations(filtered);
});

displayCreations();
