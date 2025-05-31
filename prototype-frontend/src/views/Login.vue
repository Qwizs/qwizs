<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">Se connecter</h1>

      <!-- Champs liés aux variables -->
      <input
        v-model="username"
        type="text"
        placeholder="Pseudo"
        class="input"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="input"
        style="margin-top: 1rem;"
      />

      <!-- Bouton avec gestionnaire -->
      <button class="submit-button" @click="onSubmit">Valider</button>
      <button class="inscription" @click="router.push('/inscription')">
        Pas encore de compte ? Inscris-toi ici !
      </button>
      <!-- <div class="google-login">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            alt="Google Login"
            class="google-logo"
          />
        </div> -->
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "@/axios";
import { useRouter } from 'vue-router'



// Déclaration des variables liées aux inputs
const username = ref("");
const password = ref("");
const router = useRouter()

// Soumission du formulaire
const onSubmit = async () => {
  try {
    const response = await axios.post("/administrators/verify", {
      username: username.value,
      password: password.value,
    });
    
    localStorage.setItem("idAdmin", response.data.idAdministrator);
    localStorage.setItem("username", response.data.username);
    window.dispatchEvent(new Event("storage")); 
    router.push("/");

  } catch (error) {
    if (error.response && error.response.status) {
      const status = error.response?.status;

      if (status === 404) {
        alert("Utilisateur introuvable.");
      } else if (status === 401) {
        alert("Mot de passe incorrect.");
      } else {
        alert(
          "Erreur serveur : " + (error.response?.data?.message || error.message)
        );
      }
    } else {
      alert("Une erreur inattendue est survenue.");
      console.error(error);
    }
  }

  
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #fff;
}

.login-card {
  padding: 3rem 2rem;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
}

.title {
  font-size: 3rem;
  font-weight: bold;
  color: #b55fc0;
  margin-bottom: 2rem;
}

.input-field {
  width: 100%;
  background-color: #f1dff3;
  border: none;
  padding: 1rem;
  border-radius: 1rem;
  margin-bottom: 1.2rem;
  font-size: 1rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.inscription {
  font-size: 0.85rem;
  color: rgb(46, 46, 46);
  text-decoration: underline;
  margin-top: 1rem;
  cursor: pointer;
  border: none;
  background-color: transparent;
}

.submit-button {
  background-color: #b55fc0;
  color: white;
  font-weight: 500;
  border: none;
  border-radius: .5rem;
  padding: 0.7rem 2rem;
  font-size: 1rem;
  margin-top: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button:hover {
  background-color: #be6abe;
}

/* .google-login {
    margin-top: 2rem;
  }
  
  .google-logo {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    cursor: pointer;
  } */
</style>
