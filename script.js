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
    if (!currentUser) {
        alert("Vous devez être connecté pour publier une œuvre");
        return;
    }
    formSectionMain.classList.toggle('hidden');
    formEl.author.value = currentUser;
    window.location.hash = "#form-section";
}

revealBtn.addEventListener('click', toggleForm);
showFormNav.addEventListener('click', toggleForm);

// Prix/email à vendre
checkbox.addEventListener('change', () => {
    priceInput.disabled = !checkbox.checked;
    emailInput.disabled = !checkbox.checked;
    if (!checkbox.checked) {
        priceInput.value = '';
        emailInput.value = '';
    }
});

// Affichage créations
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
            <div class="actions">
                <button class="edit-post">Éditer</button>
                <button class="delete-post">Supprimer</button>
            </div>
        `;

        const likeBtn = document.createElement('button');
        likeBtn.classList.add('like-btn');
        if (item.liked) likeBtn.classList.add('liked');
        likeBtn.addEventListener('click', e => {
            e.stopPropagation();
            item.liked = !item.liked;
            likeBtn.classList.toggle('liked');
            localStorage.setItem('creations', JSON.stringify(creations));
            showProfile();
        });
        card.appendChild(likeBtn);

        card.querySelector('img').addEventListener('click', () => openLightbox(item));

        card.querySelector('.edit-post').addEventListener('click', e => {
            e.stopPropagation();
            if (item.author === currentUser) openEditModal(item);
            else alert("Vous pouvez éditer seulement vos publications");
        });

        card.querySelector('.delete-post').addEventListener('click', e => {
            e.stopPropagation();
            if (item.author === currentUser) {
                creations = creations.filter(c => c !== item);
                localStorage.setItem('creations', JSON.stringify(creations));
                displayCreations();
                showProfile();
            } else alert("Vous pouvez supprimer seulement vos publications");
        });

        container.appendChild(card);
    });
}

// Soumettre création
formEl.addEventListener('submit', e => {
    e.preventDefault();
    if (!currentUser) {
        alert("Vous devez être connecté pour publier une œuvre");
        return;
    }
    const file = imageFileInput.files[0];
    if (!file) return alert("Sélectionnez une image");

    const reader = new FileReader();
    reader.onload = function (event) {
        const newCreation = {
            title: formEl.title.value,
            author: currentUser,
            date: formEl.date.value,
            story: formEl.story.value,
            image: event.target.result,
            link: formEl.link.value,
            forSale: checkbox.checked,
            price: checkbox.checked ? formEl.price.value : null,
            email: checkbox.checked ? emailInput.value : null,
            liked: false
        };
        creations.push(newCreation);
        localStorage.setItem('creations', JSON.stringify(creations));
        formEl.reset();
        priceInput.disabled = true;
        emailInput.disabled = true;
        displayCreations();
    };
    reader.readAsDataURL(file);
});

// Recherche
searchBar.addEventListener('input', () => {
    const term = searchBar.value.toLowerCase();
    const filtered = creations.filter(c =>
        c.title.toLowerCase().includes(term) || c.story.toLowerCase().includes(term)
    );
    displayCreations(filtered);
});

// LIGHTBOX
function openLightbox(item) {
    lbImage.src = item.image;
    lbTitle.textContent = item.title;
    lbAuthor.textContent = "Auteur : " + item.author;
    lbDate.textContent = item.date;
    lbStory.textContent = item.story;
    lbPrice.textContent = item.forSale ? "À vendre : " + item.price + " €" : "";
    if (item.forSale && item.email) {
        lbLink.style.display = "inline-block";
        lbLink.textContent = "Contacter le créateur";
        lbLink.href = "mailto:" + item.email;
    } else if (item.link) {
        lbLink.style.display = "inline-block";
        lbLink.textContent = "Découvrir l’artiste";
        lbLink.href = item.link;
    } else lbLink.style.display = "none";

    lightbox.classList.remove('hidden');
}

backButton.addEventListener('click', () => lightbox.classList.add('hidden'));

// ----- CONNEXION / PROFIL -----
const loginBtn = document.getElementById('login-btn');
const loginModal = document.getElementById('login-modal');
const loginClose = document.getElementById('login-close');
const loginForm = document.getElementById('login-form');
const signupLink = document.getElementById('signup-link');

const profileSection = document.getElementById('profile-section');
const backHomeBtn = document.getElementById('back-home');
const profileName = document.getElementById('profile-name');
const profilePhoto = document.getElementById('profile-photo');
const profileBio = document.getElementById('profile-bio');
const editBtn = document.getElementById('edit-btn');
const editForm = document.getElementById('edit-profile-form');
const editUsername = document.getElementById('edit-username');
const editBio = document.getElementById('edit-bio');
const editPhoto = document.getElementById('edit-photo');
const saveProfileBtn = document.getElementById('save-profile-btn');

const aboutSection = document.getElementById('about');
const creationsSection = document.getElementById('creations-section');

let currentUser = null;

// Connexion / profil
loginBtn.addEventListener('click', () => {
    if (!currentUser) loginModal.classList.remove('hidden');
    else showProfile();
});
loginClose.addEventListener('click', () => loginModal.classList.add('hidden'));

// Créer compte
signupLink.addEventListener('click', () => {
    loginForm.innerHTML = `
        <label>Nom d’utilisateur :</label><input type="text" name="username" required>
        <label>Mot de passe :</label><input type="password" name="password" required>
        <button type="submit" class="btn-main">Créer un compte</button>
        <p>Déjà un compte ? <span id="login-back" style="cursor:pointer;color:#7b3f29;">Se connecter</span></p>
    `;
    document.getElementById('login-back').addEventListener('click', () => location.reload());
});

// Soumettre connexion / création
loginForm.addEventListener('submit', e => {
    e.preventDefault();
    const username = loginForm.username.value;
    if (!username) return;
    currentUser = username;
    loginModal.classList.add('hidden');
    loginBtn.textContent = "Mon profil";
    showProfile();
});

// Afficher profil
function showProfile() {
    aboutSection.classList.add('hidden');
    creationsSection.classList.add('hidden');
    formSectionMain.classList.add('hidden');
    profileSection.classList.remove('hidden');
    profileName.textContent = currentUser;

    const profileGallery = document.getElementById('profile-gallery');
    profileGallery.innerHTML = '';
    const userCreations = creations.filter(c => c.author === currentUser);
    if (userCreations.length === 0) {
        profileGallery.innerHTML = '<p>Vous n’avez encore publié aucune œuvre.</p>';
    } else {
        userCreations.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('creation-card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.date}</p>
                <div class="actions">
                    <button class="edit-post">Éditer</button>
                    <button class="delete-post">Supprimer</button>
                </div>
            `;
            const likeBtn = document.createElement('button');
            likeBtn.classList.add('like-btn');
            if (item.liked) likeBtn.classList.add('liked');
            likeBtn.addEventListener('click', e => {
                e.stopPropagation();
                item.liked = !item.liked;
                likeBtn.classList.toggle('liked');
                localStorage.setItem('creations', JSON.stringify(creations));
                showProfile();
            });
            card.appendChild(likeBtn);

            card.querySelector('img').addEventListener('click', () => openLightbox(item));
            card.querySelector('.edit-post').addEventListener('click', (e) => {
                e.stopPropagation(); openEditModal(item);
            });
            card.querySelector('.delete-post').addEventListener('click', (e) => {
                e.stopPropagation();
                creations = creations.filter(c => c !== item);
                localStorage.setItem('creations', JSON.stringify(creations));
                displayCreations();
                showProfile();
            });
            profileGallery.appendChild(card);
        });
    }

    const profileLiked = document.getElementById('profile-liked');
    profileLiked.innerHTML = '';
    const likedCreations = creations.filter(c => c.liked);
    if (likedCreations.length === 0) {
        profileLiked.innerHTML = '<p>Vous n’avez encore aimé aucune œuvre.</p>';
    } else {
        likedCreations.forEach(item => {
            const card = document.createElement('div');
            card.classList.add('creation-card');
            card.innerHTML = `
                <img src="${item.image}" alt="${item.title}">
                <h3>${item.title}</h3>
                <p>${item.author}</p>
            `;
            card.querySelector('img').addEventListener('click', () => openLightbox(item));
            profileLiked.appendChild(card);
        });
    }
}

// Bouton retour profil
backHomeBtn.addEventListener('click', () => {
    profileSection.classList.add('hidden');
    aboutSection.classList.remove('hidden');
    creationsSection.classList.remove('hidden');
    formSectionMain.classList.remove('hidden');
});

// Edit profil
editBtn.addEventListener('click', () => {
    editForm.classList.toggle('hidden');
    editUsername.value = currentUser;
    editBio.value = profileBio.textContent;
});
saveProfileBtn.addEventListener('click', () => {
    currentUser = editUsername.value;
    profileName.textContent = currentUser;
    profileBio.textContent = editBio.value;
    if (editPhoto.files[0]) {
        const reader = new FileReader();
        reader.onload = e => { profilePhoto.src = e.target.result; };
        reader.readAsDataURL(editPhoto.files[0]);
    }
    editForm.classList.add('hidden');
});

// ----- EDITION COMPLET DES CREATIONS -----
function openEditModal(item) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.style.zIndex = '3000';
    modal.innerHTML = `
        <div style="background:#fff7ee; padding:2rem; border:2px solid #b65c41; border-radius:6px; width:350px; max-height:90%; overflow-y:auto; position:relative;">
            <button id="close-edit" style="position:absolute;top:10px;right:10px;background:#7b3f29;color:#fff;border:none;padding:0.3rem 0.6rem;border-radius:4px;cursor:pointer;">X</button>
            <h3>Éditer votre œuvre</h3>
            <form id="edit-form-inner" style="display:flex; flex-direction:column; gap:0.8rem;">
                <label>Titre :</label><input type="text" name="title" required value="${item.title}">
                <label>Date :</label><input type="date" name="date" required value="${item.date}">
                <label>Description :</label><textarea name="story" rows="3" required>${item.story}</textarea>
                <label>Lien :</label><input type="url" name="link" value="${item.link}">
                <label><input type="checkbox" name="forSale" ${item.forSale ? 'checked' : ''}> Œuvre à vendre</label>
                <label>Prix (€) :</label><input type="number" name="price" value="${item.price || ''}">
                <label>Email :</label><input type="email" name="email" value="${item.email || ''}">
                <label>Image :</label><input type="file" name="image">
                <button type="submit" class="btn-main">Enregistrer</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#close-edit');
    const editFormInner = modal.querySelector('#edit-form-inner');
    const forSaleCheck = editFormInner.querySelector('input[name="forSale"]');
    const priceField = editFormInner.querySelector('input[name="price"]');
    const emailField = editFormInner.querySelector('input[name="email"]');

    priceField.disabled = !forSaleCheck.checked;
    emailField.disabled = !forSaleCheck.checked;

    forSaleCheck.addEventListener('change', () => {
        priceField.disabled = !forSaleCheck.checked;
        emailField.disabled = !forSaleCheck.checked;
        if (!forSaleCheck.checked) {
            priceField.value = '';
            emailField.value = '';
        }
    });

    closeBtn.addEventListener('click', () => modal.remove());

    editFormInner.addEventListener('submit', e => {
        e.preventDefault();
        const fileInput = editFormInner.querySelector('input[name="image"]');
        if (fileInput.files[0]) {
            const reader = new FileReader();
            reader.onload = function (ev) {
                item.image = ev.target.result;
                saveEdits();
            };
            reader.readAsDataURL(fileInput.files[0]);
        } else saveEdits();

        function saveEdits() {
            item.title = editFormInner.title.value;
            item.date = editFormInner.date.value;
            item.story = editFormInner.story.value;
            item.link = editFormInner.link.value;
            item.forSale = forSaleCheck.checked;
            item.price = forSaleCheck.checked ? priceField.value : null;
            item.email = forSaleCheck.checked ? emailField.value : null;
            localStorage.setItem('creations', JSON.stringify(creations));
            displayCreations();
            showProfile();
            modal.remove();
        }
    });
}

displayCreations();
