document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('#loginForm');
    const errorMessageContainer = document.getElementById('error-message');
  
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
  
      console.log('Email: ', email);
      console.log('Mot de passe: ', password);
  
  
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
      .then((response) => {
        if (response.status == 404) {
            errorMessageContainer.textContent = "Utilisateur non inscri!t !";
            errorMessageContainer.style.color = 'red';
        } else if (response.status == 401) {
            errorMessageContainer.textContent = "Identifiant ou mot de passe incorrect !";
            errorMessageContainer.style.color = 'red';
        } else if (response.status == 200) {
            return response.json();
        }
        })
        .then((user) => {
            if (user) {
                localStorage.setItem('token', user.token);
                localStorage.setItem('userId', user.userId);
                window.location.href = 'index.html'
              } else {
                console.error('La réponse du serveur ne contient pas les informations utilisateur attendues.');
                errorMessageContainer.textContent = 'Erreur lors de la connexion. Veuillez réessayer.';
                errorMessageContainer.style.color = 'red';
            }
        }) 
        .catch(error => {
            console.log(error);
            errorMessageContainer.textContent = "Une erreur est survenue, veuillez contacter l'administrateur du site !";
            errorMessageContainer.style.color = 'red';
        });
    });
  });