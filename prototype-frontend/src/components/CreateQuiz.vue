<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal new-question-modal">
      <h2>Nouveau Qwiz</h2>

      <section class="new-question-content">

        <label class="new-question-text">
          Nom
          <input
            v-model="newQwiz.name"
            type="text"
            placeholder="Seconde Guerre Mondiale"
            class="input"
            @input="errorMessage = ''"
          />
        </label>
        <select class="type-select" default="Catégorie" @change="newQwiz.idCategory = Number($event.target.value)">
              <option value="">Ajouter une catégorie</option>
              <option :value="category.idCategory" v-for="category in categories"
            :key="category.idCategory">{{ category.name }}</option>
            </select>
        <p class="error" v-if="errorMessage !== ''">{{ errorMessage }}</p>
      </section>
      
      <div class="modal-actions">
        <button @click="emit('close')" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary">Ajouter</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, toRefs } from "vue";
import axios from "@/axios";


const props = defineProps({
  show: Boolean,
  data: {
    type: Object,
    default: () => [],
  },
});

const emit = defineEmits(["close", "refresh"]);

const newQwiz = ref({ 
  name: "", 
  idCategory: "", 
  idAdministrator: +localStorage.getItem("idAdmin")
});
const errorMessage = ref("");

import { onMounted } from "vue";

const { data } = toRefs(props);
const quizsName = ref([]);
const categories = ref([]);

onMounted(async () => {
  quizsName.value = data.value?.quizs || [];

  if (!data.value?.categories || data.value.categories.length === 0) {
    try {
      const response = await axios.get("/categories/all");
      categories.value = response.data;
    } catch (err) {
      console.error("Erreur lors du chargement des catégories :", err);
    }
  } else {
    categories.value = data.value.categories;
  }
});

const submitForm = async () => {
  if (newQwiz.value.name === "" || newQwiz.value.idCategory === "") {
    errorMessage.value = "Veuillez remplir tous les champs";
    return;
  } else if (quizsName.value.includes(newQwiz.value.name)) {
    errorMessage.value = "Vous avez déja un qwiz avec ce nom";
    return;
  } else {
    try {
      console.log(newQwiz.value);
      const response = await axios.post("/quiz", newQwiz.value);
      
      
      emit("refresh");
      emit("close");
    } catch (error) {
      console.error("Erreur lors de la création du qwiz :", error);
      return;
    }
  }
};
</script>

<style scoped>
.new-question-content {
  display: grid;
  gap: 1rem;

  & label {
    align-items: start;
  }

  & .error {
    color: red;
    font-size: .9rem;
    margin-top: 1rem;
  }

}


.input-field,
.select-field {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-field:focus,
.select-field:focus {
  border-color: #c46fc8;
  outline: none;
}

.qcm-options {
  margin-top: 10px;
  text-align: left;
}

.option-item {
  display: flex;
  gap: 5px;
  align-items: center;
}

.true-false {
  margin-top: 10px;
}

.not-found {
  text-align: center;
  font-size: 1.2rem;
  color: red;
}
.input-field,
.select-field {
  background-color: #fff !important;
  color: #333 !important;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  padding: 10px;
}

.input-field::placeholder {
  color: #999;
}

.select-field {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.type-select {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: 2px solid #ccc;
  font-size: 1rem;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236c63ff' d='M5 8l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

</style>