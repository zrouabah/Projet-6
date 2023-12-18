document.addEventListener('DOMContentLoaded', function () {

    const loginForm = document.querySelector('#loginForm');
  
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
          console.log(response);
          if (response.status == 404) alert("Utilisateur non inscrit !!");
          if (response.status == 401) alert("Veuillez verifier les paramètres d'authentification !!");
          if (response.status == 200) {
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
                alert('Erreur lors de la connexion. Veuillez réessayer.');
             }
        }) 
        .catch(error => {
          console.log(error);
          alert("Une erreur est survenue, veuillez contacter l'administrateur du site !");
        });
  
    });
  });