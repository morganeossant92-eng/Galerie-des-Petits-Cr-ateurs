const form = document.getElementById('creation-form');
const container = document.getElementById('creations-container');
const formSection = document.getElementById('form-section');
const revealBtn = document.getElementById('btn-reveal-form');
const showFormNav = document.getElementById('show-form');
const checkbox = document.getElementById('forSale');
const priceInput = document.getElementById('price');
const searchBar = document.getElementById('search-bar');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lightbox-image');
const lbTitle = document.getElementById('lightbox-title');
const lbAuthor = document.getElementById('lightbox-author');
const lbDate = document.getElementById('lightbox-date');
const lbStory = document.getElementById('lightbox-story');
const lbPrice = document.getElementById('lightbox-price');
const lbLink = document.getElementById('lightbox-link');
const lbClose = document.getElementById('close-lightbox');

let creations = JSON.parse(localStorage.getItem('creations')) || [];

// Afficher/masquer le formulaire
function toggleForm() {
  formSection.classList.toggle('hidden');
  window.location.hash = "#form-section";
}
revealBtn.addEventListener('click', toggleForm);
showFormNav.addEventListener('click', toggleForm);

// Activer le champ prix si "à vendre" est coché
checkbox.addEventListener('change', () => {
  priceInput.disabled = !checkbox.checked;
  if (!checkbox.checked) priceInput.value = "";
});

// Afficher les créations
function displayCreations(filtered = creations) {
  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<p>Aucune œuvre trouvée.</p>';
    return;
  }

  filtered.forEach((item, index) => {
    const card = document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p>${item.story}</p>
      ${item.forSale ? `<p class="price">À vendre : ${item.price} €</p>` : ''}
    `;
    container.appendChild(card);

    // Clic sur la création pour ouvrir le lightbox
    card.addEventListener('click', () => {
      lbImage.src = item.image;
      lbTitle.textContent = item.title;
      lbAuthor.textContent = "Auteur : " + item.author;
      lbDate.textContent = "Date : " + item.date;
      lbStory.textContent = item.story;
      lbPrice.textContent = item.forSale ? "Prix : " + item.price + " €" : "";
      lbLink.href = item.link || "#";
      lbLink.style.display = item.link ? "inline-block" : "none";

      lightbox.classList.add('active');
    });
  });
}

// Ajouter une création
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = document.getElementById('imageFile').files[0];
  if (!file) return alert("Veuillez sélectionner une image.");

  const reader = new FileReader();
  reader.onload = function(event) {
    const newCreation = {
      title: form.title.value,
      author: form.author.value,
      date: form.date.value,
      story: form.story.value,
      image: event.target.result, // image en base64
      link: form.link.value,
      forSale: checkbox.checked,
      price: checkbox.checked ? form.price.value : null
    };
    creations.push(newCreation);
    localStorage.setItem('creations', JSON.stringify(creations));
    form.reset();
    priceInput.disabled = true;
    displayCreations();
  };
  reader.readAsDataURL(file);
});

// Recherche en direct
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  const filtered = creations.filter(c =>
    c.title.toLowerCase().includes(term) ||
    c.story.toLowerCase().includes(term)
  );
  displayCreations(filtered);
});

// Fermer le lightbox
lbClose.addEventListener('click', () => {
  lightbox.classList.remove('active');
});

// Fermer si clic en dehors du contenu
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('active');
});

displayCreations();
