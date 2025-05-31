<template>
  <div class="modal-overlay">
    <div class="modal new-question-modal">
      <h2>Ajouter une réponse</h2>

      <section class="new-question-content" :class="{order: currentQuestion.type === 'order'}">

        <label class="new-question-text">
          Intitulé
          <input
            v-model="newAnswer.value"
            type="text"
            placeholder="1945"
            class="input"
            @input="errorMessage =''"
          />
        </label>

        <label class="new-question-text" v-if="currentQuestion.type === 'order'">
          Ordre
          <input
            v-model="newAnswer.order"
            type="number"
            min="1"
            placeholder="1"
            class="input"
            @input="errorMessage =''"
          />
        </label>

        <label id="label-checkbox" v-if="currentQuestion.type !== 'order' && currentQuestion.type !== 'input'">
          <input type="checkbox" name="goodAnswer" id="goodAnswer" v-model="newAnswer.state">
          Est-ce une bonne réponse ?
        </label>

        
      </section>

      <p class="errorMessage" v-if="errorMessage !== ''">{{ errorMessage }}</p>

      <div class="modal-actions">
        <button @click="emit('close')" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary">Créer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, toRefs, watch } from "vue";
import axios from "@/axios";

const props = defineProps({
  data: {
      type: Object,
      default: () => ({}),
  },
});

const { data } = toRefs(props);
const currentQuestion = ref(data.value.currentQuestion);
const errorMessage = ref("");

const emit = defineEmits(["close", "refresh"]);

const newAnswer = ref({
  value: "",
  idQuestion: currentQuestion.value.idQuestion,
  state: (currentQuestion.value.type === 'order' || currentQuestion.value.type === 'input')? true : false,
  order: null
});

const submitForm = async () => {
  if (newAnswer.value.value === "") {
    errorMessage.value = "Veuillez renseigner une réponse";
    return;
  }

  if (currentQuestion.value.type === 'order' && newAnswer.value.order === null) {
    errorMessage.value = "Veuillez renseigner un ordre";
    return;
  }

  try {
    const response = await axios.post("/answers", newAnswer.value);
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Une erreur s'est produite lors de l'enregistrement de la réponse", error);
    return;
  }
  
};
</script>

<style scoped>
.new-question-content {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem 1rem;

  & label {
    align-items: start;
  }

  &.order{
    grid-template-columns: repeat(2, 1fr);

  }
}

.new-question-modal{
  width: 30vw;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

#label-checkbox {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
}

</style>
