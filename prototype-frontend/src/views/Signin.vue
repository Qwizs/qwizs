<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="title">S'inscrire</h1>

      <!-- Champs liés aux variables -->
      <input
        v-model="username"
        type="text"
        placeholder="Pseudo"
        class="input-field"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Mot de passe"
        class="input-field"
      />

      <!-- Bouton avec gestionnaire -->
      <button class="submit-button" @click="onSubmit">Valider</button>

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
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";

const username = ref("");
const password = ref("");
const router = useRouter();
let adminsList = [];

onMounted(async() => {
  try {
    const response = await axios.get("/administrators/usernames");

    adminsList = response.data
    
  } catch (error) {
    console.error("Erreur lors de la recuperation des admins :", error);
  }
});

const onSubmit = async () => {
  if (username.value === "" || password.value === "") {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  if (adminsList.includes(username.value)) {
    alert("Ce pseudo existe déjà.");
    return;
  } else {
    try {
      const response = await axios.post("/administrators", {
        username: username.value,
        password: password.value,
      });
      
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("idAmin", response.data.idAmdinistrator);
      router.push("/");
    } catch (error) {
      console.error("Erreur lors de la creation du compte :", error);
    }
  }
  

  // const { data, error } = await useFetch("/administrators", {
  //   baseURL: useRuntimeConfig().public.apiBase,
  //   method: "POST",
  //   body: {
  //     username: username.value,
  //     password: password.value,
  //   },
  // });

  // if (error.value) {
  //   console.log("Username :", username.value);
  //   console.log("Password :", password.value);
  //   console.error("Erreur lors de la création :", error.value);
  // } else {
  //   console.log("Utilisateur trouvé :", data.value);
  //   console.log("Username :", username.value);
  //   console.log("Password :", password.value);
  //   console.log("Data :", data.value);
  //   localStorage.setItem("username", username.value); // ou sessionStorage
  //   localStorage.setItem("password", password.value); // ou sessionStorage
  //   router.push("/");
  // }
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
  background-color: #fdf4fb;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 90%;
  max-width: 400px;
}

.title {
  font-family: "Comic Sans MS", cursive, sans-serif;
  font-size: 1.8rem;
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

.submit-button {
  background-color: #d67fd6;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 9999px;
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
