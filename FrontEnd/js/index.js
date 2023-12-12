document.addEventListener('DOMContentLoaded', function () {
    // Section 1: Récupération des travaux via l'API et affichage initial dans la galerie
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            console.log("Réponse de l'API :", data);

            // Sélectionner la galerie
            const gallery = document.querySelector('.gallery');

            // Vider la galerie actuelle
            gallery.innerHTML = '';

            // Ajouter les travaux à la galerie
            data.forEach(work => {
                const figure = document.createElement('figure');
                const img = document.createElement('img');
                const figcaption = document.createElement('figcaption');

                img.src = work.imageUrl;
                img.alt = work.title;
                figcaption.textContent = work.title;

                figure.appendChild(img);
                figure.appendChild(figcaption);

                gallery.appendChild(figure);
            });

            console.log("Contenu de la galerie après ajout :", gallery.innerHTML);
        })
        .catch(error => {
            console.error('Erreur de récupération des travaux :', error);
        });


       
/************Ajouter le tri des projets par catégorie dans la galerie *******/
document.addEventListener('DOMContentLoaded', function() {
    let allWorks = []; // Variable pour stocker tous les travaux récupérés

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(data => {
            allWorks = data; // Stocke tous les travaux récupérés

            // Affiche tous les travaux au chargement de la page
            displayWorks(allWorks, document.querySelector('.gallery'));

            const buttons = document.querySelectorAll('.button-container button');

            buttons.forEach(button => {
                button.addEventListener('click', () => {
                    const category = button.id; // Récupère l'ID du bouton (correspondant à la catégorie)

                    if (category === 'tousButton') {
                        // Affiche tous les travaux si le bouton "Tous" est cliqué
                        displayWorks(allWorks, document.querySelector('.gallery'));
                    } else {
                        const filteredWorks = allWorks.filter(work => work.category.name === category);
                        // Filtrer et afficher les travaux de la catégorie correspondante
                        displayWorks(filteredWorks, document.querySelector('.gallery'));
                    }
                });
            });
        })
        .catch(error => {
            console.error('Erreur de récupération des travaux :', error);
        });
});

// Fonction générique pour afficher les travaux dans une galerie
function displayWorks(works, galleryContainer) {
    galleryContainer.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const img = document.createElement('img');
        const figcaption = document.createElement('figcaption');

        img.src = work.imageUrl;
        img.alt = work.title;
        figcaption.textContent = work.title;

        figure.appendChild(img);
        figure.appendChild(figcaption);

        galleryContainer.appendChild(figure);
    });
}
});


