<template>
  <main class="main-content">
    <h1 class="profile">Modifier mes informations</h1>

    <div class="edit-container">
      <label for="username"
        >Nom
        <input
          name="username"
          v-model="newAdmin.username"
          type="text"
          :placeholder="admin.username"
          class="input"
          @input="errorMessage = ''"
        />
      </label>
      <label for=""
        >Mot de passe
        <input
          v-model="newAdmin.password"
          type="password"
          placeholder="********"
          class="input"
          @input="errorMessage = ''"
        />
      </label>
      <p class="errorMessage">{{ errorMessage }}</p>
      <div class="modal-actions" v-if="newAdmin.username !== '' || newAdmin.password !== ''">
        <button @click="updateAdmin" class="btn-primary">Modifier</button>
      </div>
    </div>
  </main>
</template>

<script lang="ts" setup>
import axios from "@/axios";
import { onMounted, Ref, ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
let currentAdmins: string[] = []

const errorMessage = ref("")

const admin = ref({
  idAdministrator: "",
  username: "",
  password: "",
});

const newAdmin = ref({
  username: "",
  password: "",
});

onMounted(async () => {
  loadAdmins();
  loadAdmin();
});

const loadAdmin = async () => {
  const idAmin = localStorage.getItem("idAdmin") || "";
  admin.value.idAdministrator = idAmin;
  admin.value.username = localStorage.getItem("username") || "";

  try {
    const response = await axios.get(`/administrators/${idAmin}`);
    admin.value = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste de quiz", error);
  }
};

const loadAdmins = async () => {
  try {
    const response = await axios.get("/administrators/usernames");
    currentAdmins = response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste de quiz", error);
  }
}

const updateAdmin = async () => {
  if (currentAdmins.includes(newAdmin.value.username)) {
    errorMessage.value = "Nom d'utilisateur déjà utilisé";
    return;
  }
  if (newAdmin.value.password !== "") {
    try {
      const response = await axios.put(
        `/administrators/${admin.value.idAdministrator}`,
        newAdmin.value
      );
      router.push("/connexion");
      localStorage.removeItem("username");
      localStorage.removeItem("idAdmin");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'administrateur");
    }
  } else {
    console.log("egere");

    try {
      const response = await axios.put(
        `/administrators/${admin.value.idAdministrator}`,
        newAdmin.value
      );
      
      localStorage.setItem("username", newAdmin.value.username);
      window.dispatchEvent(new Event("storage")); 
      router.push("/profile");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'administrateur");
    }
  }

  newAdmin.value = {
    username: "",
    password: "",
  };
  errorMessage.value = "";
  loadAdmin();
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Nerko+One&display=swap");

h1.profile {
  text-align: center;
  margin-bottom: 30px;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 0;
}

.edit-container {
  margin-top: 0;
  display: flex;
  width: 100%;
  max-width: 20rem;
  flex-direction: column;

  & .modal-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;

    & .btn-primary,
    .btn-secondary {
      padding: 0.75rem 1rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      width: 100%;
      height: 100%;
      font-size: 1rem;
    }

    & .btn-primary {
      background: #c46fc8;
      color: white;
    }

    & .btn-secondary {
      background: #ccc;
      color: black;
    }

    & .btn-primary:hover {
      background: #86218b;
    }

    & .btn-secondary:hover {
      background: #bbb;
    }
  }
}

.input {
  width: 100%;

  padding: 0.75rem;
  font-size: 1rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  color: #000000;
}

h1 {
  margin-bottom: 30px;
  color: #c46fc8;
}

input {
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.profile {
  display: inline-block;
  margin-top: 2rem;
  text-decoration: none;
  font-size: 3rem;
  color: #c46fc8;
  font-family: "Nerko One", cursive;
  font-weight: bold;
  transition: color 0.2s;
}
</style>
