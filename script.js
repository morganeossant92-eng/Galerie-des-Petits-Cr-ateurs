const form = document.getElementById('creation-form');
const container = document.getElementById('creations-container');
const formSection = document.getElementById('form-section');
const revealBtn = document.getElementById('btn-reveal-form');
const showFormNav = document.getElementById('show-form');
const checkbox = document.getElementById('forSale');
const priceInput = document.getElementById('price');
const searchBar = document.getElementById('search-bar');
const imageFileInput = document.getElementById('imageFile');

// Lightbox elements
const lightbox = document.getElementById('lightbox');
const lbImage = document.getElementById('lb-image');
const lbTitle = document.getElementById('lb-title');
const lbAuthor = document.getElementById('lb-author');
const lbDate = document.getElementById('lb-date');
const lbStory = document.getElementById('lb-story');
const lbPrice = document.getElementById('lb-price');
const lbLink = document.getElementById('lb-link');
const backButton = document.getElementById('back-button');

let creations = JSON.parse(localStorage.getItem('creations')) || [];

// Toggle formulaire
function toggleForm() {
  formSection.classList.toggle('hidden');
  window.location.hash = "#form-section";
}
revealBtn.addEventListener('click', toggleForm);
showFormNav.addEventListener('click', toggleForm);

// Activer prix
checkbox.addEventListener('change', () => {
  priceInput.disabled = !checkbox.checked;
  if (!checkbox.checked) priceInput.value = "";
});

// Afficher créations
function displayCreations(filtered = creations) {
  container.innerHTML = '';
  if (filtered.length === 0) {
    container.innerHTML = '<p>Aucune œuvre trouvée.</p>';
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p><strong>${item.author}</strong></p>
      <p>${item.date}</p>
      <p>${item.story}</p>
      ${item.forSale ? `<p class="price">À vendre : ${item.price} €</p>` : ''}
    `;
    card.addEventListener('click', () => openLightbox(item));
    container.appendChild(card);
  });
}

// Soumettre création
form.addEventListener('submit', e => {
  e.preventDefault();
  const file = imageFileInput.files[0];
  if (!file) return alert("Sélectionnez une image");
  const reader = new FileReader();
  reader.onload = function(event) {
    const newCreation = {
      title: form.title.value,
      author: form.author.value,
      date: form.date.value,
      story: form.story.value,
      image: event.target.result,
      link: form.link.value,
      forSale: checkbox.checked,
      price: checkbox.checked ? form.price.value : null
    };
    creations.push(newCreation);
    localStorage.setItem('creations', JSON.stringify(creations));
    form.reset();
    priceInput.disabled = true;
    displayCreations();
  }
  reader.readAsDataURL(file);
});

// Recherche
searchBar.addEventListener('input', () => {
  const term = searchBar.value.toLowerCase();
  const filtered = creations.filter(c =>
    c.title.toLowerCase().includes(term) ||
    c.story.toLowerCase().includes(term)
  );
  displayCreations(filtered);
});

// Lightbox
function openLightbox(item) {
  lbImage.src = item.image;
  lbTitle.textContent = item.title;
  lbAuthor.textContent = "Auteur : " + item.author;
  lbDate.textContent = "Date : " + item.date;
  lbStory.textContent = item.story;
  lbPrice.textContent = item.forSale ? "À vendre : " + item.price + " €" : "";
  lbLink.style.display = item.link ? "inline" : "none";
  lbLink.href = item.link;
  lightbox.classList.remove('hidden');
}

backButton.addEventListener('click', () => {
  lightbox.classList.add('hidden');
});

displayCreations();
