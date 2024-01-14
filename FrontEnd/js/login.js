document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('#loginForm');
    const errorMessageContainer = document.getElementById('error-message');
  
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
  
  
      fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      })
      .then(response => {
        if (response.status == 200) {
            return response.json();
        } else if (response.status == 401) {
            errorMessageContainer.textContent = "Identifiant ou mot de passe incorrect !";
        } else if (response.status == 404) {
            errorMessageContainer.textContent = "Utilisateur non inscrit !";
        }
        errorMessageContainer.style.color = 'red';
        throw new Error("Erreur lors de la connexion.");
    })
    .then((user) => {
        if (user) {
            localStorage.setItem('token', user.token);
            localStorage.setItem('userId', user.userId);
            window.location.href = 'index.html';
        } else {
            console.error('La réponse du serveur ne contient pas les informations utilisateur attendues.');
            errorMessageContainer.textContent = 'Erreur lors de la connexion. Veuillez réessayer.';
            errorMessageContainer.style.color = 'red';
        }
    })   
    });
  });