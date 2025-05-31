<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal new-question-modal">
      <h2>Nouvelle catégorie</h2>

      <section class="new-question-content">

        <label class="new-question-text">
          Nom
          <input
            v-model="newCategory"
            type="text"
            placeholder="Blind Test"
            class="input"
            @input="errorMessage = ''"
          />
        </label>
        <p class="error">{{ errorMessage }}</p>
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
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["close", "refresh"]);

const newCategory = ref("");
const errorMessage = ref("");

const { data } = toRefs(props);


const submitForm = async () => {
  if (newCategory.value === "") {
    errorMessage.value = "Veuillez entrer un nom de catégorie";
    return;
  } else if (data.value.includes(newCategory.value)) {
    errorMessage.value = "Cette catégorie existe déjà";
    return;
  } else {
    try {
      const response = await axios.post("/categories", {name: newCategory.value});
      emit("refresh");
      emit("close");
    } catch (error) {
      console.error("Erreur lors de la création de la question :", error);
      return;
    }
  }
};
</script>

<style scoped>
.new-question-content {
  display: grid;
  gap: 0 1rem;

  & label {
    align-items: start;
  }

  & .error {
    color: red;
    font-size: .9rem;
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
