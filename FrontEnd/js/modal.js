/**********modal1********** */
document.addEventListener('DOMContentLoaded', function () {
    const gallerymodal = document.querySelector('.gelleriesModal');
    let modal = null;

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            console.log("Réponse de l'API :", data);

            // Ajouter les travaux à la galerie
            data.forEach(work => {
                const figure = document.createElement('figure');
                const imageContainer = document.createElement('div');
                const img = document.createElement('img');
                const deleteIcon = document.createElement('i');

                img.src = work.imageUrl;
                img.alt = work.title;

                deleteIcon.className = 'fas fa-trash-alt delete-icon';

                // Écouteur d'événements pour le clic sur l'icône de corbeille
                deleteIcon.addEventListener('click', () => deleteImage(work.id));

                // Supprimer l'élément figcaption s'il existe déjà
                const existingFigcaption = figure.querySelector('figcaption');
                if (existingFigcaption) {
                    figure.removeChild(existingFigcaption);
                }

                figure.appendChild(img);
                figure.appendChild(deleteIcon);
                figure.appendChild(imageContainer);

                gallerymodal.appendChild(figure);
            });

            console.log("Contenu de la galerie après ajout :", gallerymodal.innerHTML);
        })
        .catch(error => {
            console.error('Erreur de récupération des travaux :', error);
        });

    const openModal = function (e) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        modal = target;
        modal.style.display = 'flex';
        modal.removeAttribute('aria-hidden');
        modal.setAttribute('aria-modal', 'true');

        // Fermer la modal au clic sur la croix
        modal.querySelector('.close-modal').addEventListener('click', closeModal);

        // Fermer la modal en dehors de celle-ci
        modal.addEventListener('click', closeModalOutside);
    };

    const closeModal = function (e) {
        e.preventDefault();
        modal.style.display = 'none';
        modal.setAttribute('aria-hidden', 'true');
        modal.removeAttribute('aria-modal');

        // Retirer les écouteurs d'événements
        modal.querySelector('.close-modal').removeEventListener('click', closeModal);
        modal.removeEventListener('click', closeModalOutside);

        modal = null;
    };

    const closeModalOutside = function (e) {
        if (e.target === modal) {
            closeModal(e);
        }
    };

    document.querySelectorAll('.js-modal').forEach(a => {
        a.addEventListener('click', openModal);
    });

    // Fonction pour supprimer une image en fonction de son ID
   function deleteImage(imageId) {
    const apiUrl = `http://localhost:5678/api/works/${imageId}`;

    fetch(apiUrl, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTcwMjI0NTcyMSwiZXhwIjoxNzAyMzMyMTIxfQ.1EvRAmD3CoIy3KTR4vIegHavGnuulMTlFB_O_FEDQDI', // Remplacez par votre jeton d'accès sans guillemets supplémentaires
        },
    })
        .then(response => {
            console.log('Statut de la réponse DELETE :', response.status);

            if (!response.ok && response.status !== 204) {
                throw new Error(`Erreur lors de la suppression de l'image (ID : ${imageId})`);
            }

            // Pas besoin de return response.json() ici car la réponse n'a pas de contenu JSON
        })
        .then(() => {
            console.log(`Image (ID : ${imageId}) supprimée avec succès.`);

            // Actualiser la liste des travaux après suppression
            fetchAndDisplayImages(); // Assurez-vous d'avoir cette fonction définie
        })
        .catch(error => {
            console.error('Erreur lors de la suppression de l\'image :', error.message);
        })
        .finally(() => {
            console.log('Fin de la fonction deleteImage');
        });
}


    // Fonction pour récupérer et afficher les images après une suppression
    function fetchAndDisplayImages() {
        // Implémentez cette fonction si elle n'est pas déjà définie
    }
});

/***********Modal2******************** */
const modal2 = document.getElementById('modal2');
const previewImage = function (e) {
    const preview = document.getElementById('previewImage');
    const fileInput = e.target;
    const icon = document.querySelector('.upload-button i');
    const button = document.getElementById('submitPhoto');
    const paragraph = document.querySelector('.upload-section p');
    const customUploadLabel = document.querySelector('.custom-upload-label');
    const ajoutTypeDiv = document.querySelector('.ajout-type');

    if (fileInput.files && fileInput.files[0]) {
        const reader = new FileReader();

        reader.onload = function (e) {
            preview.src = e.target.result;

            // Appliquer les styles à l'image prévisualisée
            preview.style.width = '100%'; // Ajustez la largeur pour occuper toute la section
            preview.style.height = 'auto'; // Ajustez la hauteur pour conserver les proportions

            // Cacher les éléments associés
            icon.style.display = 'none';
            button.style.display = 'none';
            paragraph.style.display = 'none';
            customUploadLabel.style.display = 'none';
            ajoutTypeDiv.style.display = 'none';
        };

        reader.readAsDataURL(fileInput.files[0]);

        // Rendre la div d'upload visible
        preview.style.display = 'block';
    } else {
        alert("Veuillez sélectionner un fichier image !");
    }
}
const openAddPhotoModal = function (e) {
    e.preventDefault();
    modal2.style.display = 'flex';
    modal2.removeAttribute('aria-hidden');
    modal2.setAttribute('aria-modal', 'true');

    // Fermer la modal au clic sur la croix
    modal2.querySelector('.close-modal').addEventListener('click', closeModal2);

    // Retourner à la galerie au clic sur la flèche
    modal2.querySelector('#backToGallery').addEventListener('click', backToGallery);
}

// Ajouter un gestionnaire d'événements au bouton de téléchargement
const uploadButton = modal2.querySelector('#file');
uploadButton.addEventListener('change', previewImage);

// Associez l'ouverture de la deuxième modal au bouton "Ajouter une photo"
document.getElementById('ajouterButton').addEventListener('click', openAddPhotoModal);




// Fonction pour fermer la modal d'ajout de photo
const closeModal2 = function (e) {
    e.preventDefault();
    modal2.style.display = 'none';
    modal2.setAttribute('aria-hidden', 'true');
    modal2.removeAttribute('aria-modal');

    // Retirer les écouteurs d'événements
    modal2.querySelector('.close-modal').removeEventListener('click', closeModal2);
    modal2.querySelector('#backToGallery').removeEventListener('click', backToGallery);
    modal2.querySelector('#submitPhoto').removeEventListener('click', addPhoto);
}
const backToGallery = function (e) {
    e.preventDefault();
    const targetModalId = modal2.getAttribute('data-target');
    const targetModal = document.getElementById(targetModalId);

    // Fermer la modal actuelle (modal2)
    closeModal2(e);

    // Afficher la modal cible (modal1)
    targetModal.style.display = 'flex';
}
const ajoutProjet = function () {
    // Récupérez les valeurs des champs (upload, name, categorie)
    const uploadInput = document.getElementById('file');
    const titleInput = document.getElementById('title');
    const categoryInput = document.getElementById('category');

    // Initialisez une variable pour suivre si le formulaire est valide
    let isFormValid = validateForm(titleInput, categoryInput, uploadInput);
    console.log('Formulaire est valide :', isFormValid);

    // Vérifiez si les champs sont correctement remplis
    if (isFormValid) {
        // Construisez un objet FormData avec les données du formulaire
        const formData = new FormData();
        formData.append('image', uploadInput.files[0]);
        formData.append('title', titleInput.value);
        formData.append('category', categoryInput.value);

        // Effectuez la requête fetch pour envoyer les données au serveur
        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then(response => {
                if (response.status === 400) {
                    alert("Veuillez vérifier les champs saisis !");
                }
                if (response.status === 401) {
                    alert("Veuillez vous authentifier avant d'ajouter un projet !");
                }
                if (response.status === 201) {
                    alert("Projet ajouté avec succès !");
                    return response.json();
                }
            })
            .then(projet => {
                if (projet) {
                    console.log(projet);
                    // Mettez à jour la galerie ou modale avec le nouveau projet
                    const gallery = document.querySelector('.gallery');
                    const figure = createFigure(projet);
                    gallery.appendChild(figure);

                    // Fermez la modal après l'ajout
                    closeModal2();

                    // Actualiser la liste des travaux après ajout
                    // Vous devriez avoir une fonction fetchAndDisplayImages() pour cela
                    // fetchAndDisplayImages();
                }
            })
            .catch(error => {
                console.error('Erreur:', error);
                alert("Une erreur est survenue lors de l'ajout du projet !");
            });
    } else {
        // Affichez un message d'erreur ou effectuez d'autres actions nécessaires
        console.log('Veuillez remplir tous les champs du formulaire.');
    }
};
