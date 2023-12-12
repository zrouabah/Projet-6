document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById("loginForm");
    const errorMessageElement = document.getElementById("errorMessage");

    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            console.log('Avant la requête Fetch');

            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email, password: password }),
            });

            console.log('Après la requête Fetch');

            const data = await response.json();

            console.log('Réponse de l\'API :', data);

            // Vérifie si l'utilisateur est un administrateur
            if (email === 'sophie.bluel@test.tld' && password === 'S0phie') {
                console.log('Redirection vers la page d\'administration');
                // Redirige l'administrateur vers la page d'administration
                window.location.replace('index.html');
            } else { 
                // Stocke le token dans le localStorage
                localStorage.setItem('token', data.token);
                console.log('Token stocké dans le localStorage :', localStorage.getItem('token'));
                console.log('Redirection vers la page d\'accueil');
                // Redirige les autres utilisateurs vers la page d'accueil
                window.location.replace('index.html');
            }
        } catch (error) {
            console.error('Erreur de connexion :', error);
            errorMessageElement.innerText = error.message || 'Email ou mot de passe incorrect.';
        }
    });
});
