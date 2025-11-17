// ----- GALERIE & FORMULAIRE -----
const formEl = document.getElementById('creation-form');
const container = document.getElementById('creations-container');
const formSectionMain = document.getElementById('form-section');
const revealBtn = document.getElementById('btn-reveal-form');
const showFormNav = document.getElementById('show-form');
const checkbox = document.getElementById('forSale');
const priceInput = document.getElementById('price');
const emailInput = document.getElementById('email');
const searchBar = document.getElementById('search-bar');
const imageFileInput = document.getElementById('imageFile');

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
  formSectionMain.classList.toggle('hidden');
  window.location.hash = "#form-section";
}
revealBtn.addEventListener('click', toggleForm);
showFormNav.addEventListener('click', toggleForm);

// Prix/email à vendre
checkbox.addEventListener('change', () => {
  priceInput.disabled = !checkbox.checked;
  emailInput.disabled = !checkbox.checked;
  if(!checkbox.checked){ priceInput.value=''; emailInput.value=''; }
});

// Affichage créations
function displayCreations(filtered=creations){
  container.innerHTML='';
  if(filtered.length===0){ container.innerHTML='<p>Aucune œuvre trouvée.</p>'; return; }
  filtered.forEach(item=>{
    const card=document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML=`
      <img src="${item.image}" alt="${item.title}">
      <h3>${item.title}</h3>
      <p><strong>${item.author}</strong></p>
      <p>${item.date}</p>
      <p>${item.story}</p>
      ${item.forSale?`<p class="price">À vendre : ${item.price} €</p>`:''}
    `;
    card.addEventListener('click',()=>openLightbox(item));
    container.appendChild(card);
  });
}

// Soumettre création
formEl.addEventListener('submit', e=>{
  e.preventDefault();
  const file=imageFileInput.files[0];
  if(!file) return alert("Sélectionnez une image");
  const reader=new FileReader();
  reader.onload=function(event){
    const newCreation={
      title:formEl.title.value,
      author:formEl.author.value,
      date:formEl.date.value,
      story:formEl.story.value,
      image:event.target.result,
      link:formEl.link.value,
      forSale:checkbox.checked,
      price:checkbox.checked?formEl.price.value:null,
      email:checkbox.checked?emailInput.value:null
    };
    creations.push(newCreation);
    localStorage.setItem('creations', JSON.stringify(creations));
    formEl.reset();
    priceInput.disabled=true;
    emailInput.disabled=true;
    displayCreations();
  };
  reader.readAsDataURL(file);
});

// Recherche
searchBar.addEventListener('input', ()=>{
  const term=searchBar.value.toLowerCase();
  const filtered=creations.filter(c=>c.title.toLowerCase().includes(term) || c.story.toLowerCase().includes(term));
  displayCreations(filtered);
});

// LIGHTBOX
function openLightbox(item){
  lbImage.src=item.image;
  lbTitle.textContent=item.title;
  lbAuthor.textContent="Auteur : "+item.author;
  lbDate.textContent="Date : "+item.date;
  lbStory.textContent=item.story;
  lbPrice.textContent=item.forSale?"À vendre : "+item.price+" €":"";
  if(item.forSale && item.email){ lbLink.style.display="inline-block"; lbLink.textContent="Contacter le créateur"; lbLink.href="mailto:"+item.email; }
  else if(item.link){ lbLink.style.display="inline-block"; lbLink.textContent="Découvrir l’artiste"; lbLink.href=item.link; }
  else{ lbLink.style.display="none"; }
  lightbox.classList.remove('hidden');
}
backButton.addEventListener('click', ()=>lightbox.classList.add('hidden'));

// ----- CONNEXION / PROFIL -----
const loginBtn=document.getElementById('login-btn');
const loginModal=document.getElementById('login-modal');
const loginClose=document.getElementById('login-close');
const loginForm=document.getElementById('login-form');
const signupLink=document.getElementById('signup-link');

const profileSection=document.getElementById('profile-section');
const backHomeBtn=document.getElementById('back-home');
const profileName=document.getElementById('profile-name');
const subscribeBtn=document.getElementById('subscribe-btn');

const aboutSection=document.getElementById('about');
const creationsSection=document.getElementById('creations-section');

let currentUser=null;
let subscribers=0;

loginBtn.addEventListener('click', ()=>{
  if(!currentUser){ loginModal.classList.remove('hidden'); }
  else{ showProfile(); }
});
loginClose.addEventListener('click', ()=>loginModal.classList.add('hidden'));

// Créer compte
signupLink.addEventListener('click', ()=>{
  loginForm.innerHTML=`
    <label>Nom d’utilisateur :</label><input type="text" name="username" required>
    <label>Mot de passe :</label><input type="password" name="password" required>
    <button type="submit" class="btn-main">Créer un compte</button>
    <p>Déjà un compte ? <span id="login-back" style="cursor:pointer;color:#7b3f29;">Se connecter</span></p>
  `;
  document.getElementById('login-back').addEventListener('click', ()=>location.reload());
});

// Soumettre connexion / création
loginForm.addEventListener('submit', e=>{
  e.preventDefault();
  const username=loginForm.username.value;
  if(!username) return;
  currentUser=username;
  loginModal.classList.add('hidden');
  loginBtn.textContent="Mon profil";
  showProfile();
});

// Afficher profil
function showProfile(){
  aboutSection.classList.add('hidden');
  creationsSection.classList.add('hidden');
  formSectionMain.classList.add('hidden');
  profileSection.classList.remove('hidden');
  profileName.textContent=currentUser;
}

// Bouton retour profil
backHomeBtn.addEventListener('click', ()=>{
  profileSection.classList.add('hidden');
  aboutSection.classList.remove('hidden');
  creationsSection.classList.remove('hidden');
  formSectionMain.classList.remove('hidden');
});

// S'abonner
subscribeBtn.addEventListener('click', ()=>{
  subscribers++;
  subscribeBtn.textContent=`S'abonner (${subscribers})`;
});

displayCreations();
function showProfile() {
  aboutSection.classList.add('hidden');
  creationsSection.classList.add('hidden');
  formSectionMain.classList.add('hidden');
  profileSection.classList.remove('hidden');
  profileName.textContent = currentUser;

  // Afficher uniquement les créations de l'utilisateur
  const profileGallery = document.getElementById('profile-gallery');
  profileGallery.innerHTML = '';
  const userCreations = creations.filter(c => c.author === currentUser);
  if(userCreations.length === 0){
    profileGallery.innerHTML = '<p>Vous n’avez encore publié aucune œuvre.</p>';
    return;
  }
  userCreations.forEach(item => {
    const card = document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML = `<img src="${item.image}" alt="${item.title}">`;
    card.addEventListener('click', () => openLightbox(item));
    profileGallery.appendChild(card);
  });
}

