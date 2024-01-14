// Get the modal

var modal = document.getElementById("myModal");
const modalGallery = document.querySelector(".modal-main");
const modalAjout = document.querySelector(".modal-ajout");
var galleryModaleImg = document.querySelector(".galleryModaleImg");

// Get the button that opens the modal
var listBtnModifier = document.querySelectorAll(".btnmodifier");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var returnButton = document.querySelector(".return");
var ajoutModaleBtn = document.querySelector(".ajoutModaleBtn");
var galleryCreated = false;
const ajoutBtn = document.querySelector('.ajout-btn');
ajoutBtn.addEventListener('click', function() {
    document.getElementById('file').click();
});
// When the user clicks on the button, open the modal
listBtnModifier.forEach(btn => {
    btn.onclick = function () {
        modal.style.display = "block";
        modalGallery.style.display = "flex";
        modalAjout.style.display = "none";
        if (!galleryCreated) {
            createGalleryModale();
            galleryCreated = true;
        }
    }
});

ajoutModaleBtn.onclick = function () {
    modalGallery.style.display = "none";
    modalAjout.style.display = "flex";
    returnButton.style.display = "block";
}
returnButton.onclick = function () {
    modalGallery.style.display = "flex";
    modalAjout.style.display = "none";
    returnButton.style.display = "none";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
function displayErrorMessage(message) {
    const errorMessageContainer = document.getElementById('errorMessageContainer');
    errorMessageContainer.textContent = message;
    errorMessageContainer.style.color = 'red';
}
function createGalleryModale() {

    const galleryModaleImg = document.querySelector(".galleryModaleImg");
    allWorks.forEach((item) => {
        const figure = createImgModale(item);
        galleryModaleImg.appendChild(figure);

    });
}


function createImgModale(projet) {
    const figure = document.createElement("figure");
    figure.id = "figureModale" + projet.id;
    figure.dataset.categoryId = projet.categoryId;
    figure.setAttribute("class", "figureModale");
    const image = document.createElement("img");
    image.src = projet.imageUrl;

    const editLink = document.createElement("p");
    editLink.textContent = "éditer";
    editLink.classList.add("editLink");

    const deleteButton = document.createElement("div");
    deleteButton.setAttribute("class", "deleteButton");
    deleteButton.addEventListener('click', () => {
        const res = confirm("Etes vous sur de bien vouloir supprimer le projet " + projet.id + "?");
        if (res) {
            // supprimer le projet depuis l'api
            deleteProject(projet.id);
        }
    });

    const icon = document.createElement("i");
    icon.setAttribute("class", "fas fa-trash-can");

    deleteButton.appendChild(icon);
    figure.appendChild(deleteButton);



    figure.appendChild(image);
    figure.appendChild(editLink);

    return figure;

}
function deleteProject(id) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`
        },
    })
    .then(response => {
        if (response.status == 204) {
            // Supprimer le projet depuis la modale
            const figureToDelete = document.getElementById(`figureModale${id}`);
            if (figureToDelete) {
                figureToDelete.remove();
            }

            // Émettre un événement personnalisé pour indiquer la suppression
            const event = new CustomEvent('photoDeleted', { detail: { id } });
            document.dispatchEvent(event);
        } else {
            console.error('Failed to delete project from API');
            alert('Une erreur est survenue lors de la suppression du projet ! ');
        }
    })
    .catch(error => {
        console.error('Une erreur est survenue lors de la suppression du projet !', error);
    });
}

// Fonction pour prévisualiser une image 
function previewImage(e) {

    // Sélection de l'élément de prévisualisation de l'image
    const image = document.getElementById("image");
    const removeImage = document.querySelector(".removeImage");
    removeImage.addEventListener("click", function (e) {
        image.src = "";
        previewImageBlock.style.display = "none";
        formImageBlock.style.display = "flex";
    });
    const previewImageBlock = document.querySelector(".previewImage");
    // Sélection de l'élément du formulaire des détails de sélection
    const formImageBlock = document.querySelector(".formImage");

    const file = e.target.files[0]; // Récupérer le fichier sélectionné

    if (file && file.type.match("image.*") && file.size <= 4194304) {
        const reader = new FileReader(); // Créer un objet FileReader
        reader.onload = function (e) {

            image.src = e.target.result;
            previewImageBlock.style.display = "flex";
            formImageBlock.style.display = "none";
        };
        reader.readAsDataURL(file); // Lire le fichier en tant qu'URL de données
    }
    else {
        alert("Veuillez selectionner un fichier image ! ")
    }
}

const formulaireAjout = document.querySelector('#form');
if (formulaireAjout) {
    formulaireAjout.addEventListener('submit', function (e) {
        e.preventDefault();
        ajoutProjet();
    });
}
function resetModal2() {
    const galleryModaleImg = document.querySelector(".galleryModaleImg");
    galleryModaleImg.innerHTML = '';

    const formulaireAjout = document.querySelector('#form');
    if (formulaireAjout) {
        formulaireAjout.reset();
    }  
}
// Fonction pour supprimer la prévisualisation de l'image dans la modale 2
function deletepreviewImage() {
    const image = document.getElementById('image');
    const previewImageBlock = document.querySelector('.previewImage');
    const formImageBlock = document.querySelector('.formImage');

    image.src = "";
    previewImageBlock.style.display = "none";
    formImageBlock.style.display = "flex";
}

// Modifier l'écouteur d'événements existant pour le span removeImage
removeImage.addEventListener("click", function (e) {
    deletepreviewImage();
});
function ajoutProjet() {
    const image = document.getElementById('file').files[0];
    const title = document.getElementById('title').value;
    const category = document.getElementById('category').value;

    if (!image || title.trim() === "" || category.trim() === "") {
        displayErrorMessage("Veuillez renseigner tous les champs");

        // Effacer le message d'erreur après 3 secondes
        setTimeout(() => {
            displayErrorMessage("");
        }, 3000);

    } else {
        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('image', image);

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: formData,
        })
            .then(response => {
                if (response.status === 400) {
                    displayErrorMessage("Veuillez vérifier les champs saisis !");
                } else if (response.status === 401) {
                    displayErrorMessage("Veuillez vous authentifier avant d'ajouter un projet !");
                } else if (response.status === 201) {
                    return response.json();
                } else {
                    throw new Error('Erreur inattendue lors de l\'ajout du projet');
                }
            })
            .then(projet => {
                if (projet) {

                    // Mettre à jour le tableau global
                    allWorks.push(projet);

                    // Mettre à jour la modale : ajouter le nouveau projet sur la modale
                    const galleryModaleImg = document.querySelector(".galleryModaleImg");
                    const figureModale = createImgModale(projet);
                    galleryModaleImg.appendChild(figureModale);

                    // Mettre à jour la page index avec l'ajout du projet sur la page index
                    const gallery = document.querySelector(".gallery");
                    const figureIndex = createFigure(projet);
                    gallery.appendChild(figureIndex);

                    // Réinitialiser le formulaire
                    const formulaireAjout = document.querySelector('#form');
                    if (formulaireAjout) {
                        formulaireAjout.reset();
                    }

                    // Appeler deletepreviewImage pour réinitialiser la prévisualisation de l'image dans la modale 2
                    deletepreviewImage();
                    
                    // Fermer la modal
                    returnButton.click();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                displayErrorMessage("Une erreur est survenue lors de l'ajout du projet !");

            });
    }
}
