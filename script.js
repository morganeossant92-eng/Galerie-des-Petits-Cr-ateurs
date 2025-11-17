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
      <button class="edit-post">Éditer</button>
      <button class="delete-post">Supprimer</button>
    `;
    // Lightbox au clic sur image
    card.querySelector('img').addEventListener('click',()=>openLightbox(item));
    // Édition
    card.querySelector('.edit-post').addEventListener('click', (e)=>{
      e.stopPropagation();
      if(item.author===currentUser){
        editCreation(item);
      } else { alert("Vous pouvez éditer seulement vos publications"); }
    });
    // Suppression
    card.querySelector('.delete-post').addEventListener('click', (e)=>{
      e.stopPropagation();
      if(item.author===currentUser){
        creations = creations.filter(c=>c!==item);
        localStorage.setItem('creations', JSON.stringify(creations));
        displayCreations();
        showProfile();
      } else { alert("Vous pouvez supprimer seulement vos publications"); }
    });
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
const profilePhoto=document.getElementById('profile-photo');
const profileBio=document.getElementById('profile-bio');
const editBtn=document.getElementById('edit-btn');
const editForm=document.getElementById('edit-profile-form');
const editUsername=document.getElementById('edit-username');
const editBio=document.getElementById('edit-bio');
const editPhoto=document.getElementById('edit-photo');
const saveProfileBtn=document.getElementById('save-profile-btn');
const subscribeBtn=document.getElementById('subscribe-btn');

const aboutSection=document.getElementById('about');
const creationsSection=document.getElementById('creations-section');

let currentUser=null;
let subscribers=0;

// Connexion / profil
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

  // Créations utilisateur
  const profileGallery=document.getElementById('profile-gallery');
  profileGallery.innerHTML='';
  const userCreations=creations.filter(c=>c.author===currentUser);
  if(userCreations.length===0){
    profileGallery.innerHTML='<p>Vous n’avez encore publié aucune œuvre.</p>';
    return;
  }
  userCreations.forEach(item=>{
    const card=document.createElement('div');
    card.classList.add('creation-card');
    card.innerHTML=`<img src="${item.image}" alt="${item.title}">
                    <h3>${item.title}</h3>
                    <p>${item.date}</p>
                    <button class="edit-post">Éditer</button>
                    <button class="delete-post">Supprimer</button>`;
    card.querySelector('img').addEventListener('click',()=>openLightbox(item));
    // Edition / suppression
    card.querySelector('.edit-post').addEventListener('click',(e)=>{
      e.stopPropagation(); editCreation(item);
    });
    card.querySelector('.delete-post').addEventListener('click',(e)=>{
      e.stopPropagation();
      creations=creations.filter(c=>c!==item);
      localStorage.setItem('creations',JSON.stringify(creations));
      displayCreations();
      showProfile();
    });
    profileGallery.appendChild(card);
  });
}

// Bouton retour profil
backHomeBtn.addEventListener('click', ()=>{
  profileSection.classList.add('hidden');
  aboutSection.classList.remove('hidden');
  creationsSection.classList.remove('hidden');
  formSectionMain.classList.remove('hidden');
});

// Edit profil
editBtn.addEventListener('click', ()=>{
  editForm.classList.toggle('hidden');
  editUsername.value=currentUser;
  editBio.value=profileBio.textContent;
});
saveProfileBtn.addEventListener('click', ()=>{
  currentUser=editUsername.value;
  profileName.textContent=currentUser;
  profileBio.textContent=editBio.value;
  if(editPhoto.files[0]){
    const reader=new FileReader();
    reader.onload=e=>{ profilePhoto.src=e.target.result; }
    reader.readAsDataURL(editPhoto.files[0]);
  }
  editForm.classList.add('hidden');
});

// S'abonner
subscribeBtn.addEventListener('click', ()=>{
  subscribers++;
  subscribeBtn.textContent=`S'abonner (${subscribers})`;
});

// Editer création
function editCreation(item){
  const title=prompt("Titre",item.title);
  const story=prompt("Description",item.story);
  const date=prompt("Date",item.date);
  const price=item.forSale?prompt("Prix",item.price):null;
  if(title && story && date){
    item.title=title;
    item.story=story;
    item.date=date;
    if(item.forSale) item.price=price;
    localStorage.setItem('creations',JSON.stringify(creations));
    displayCreations();
    showProfile();
  }
}

displayCreations();
