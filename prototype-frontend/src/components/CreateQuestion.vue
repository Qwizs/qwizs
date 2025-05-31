<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal new-question-modal">
      <h2>Nouvelle question</h2>

      <section class="new-question-content">

        <label class="new-question-text">
          Intitulé
          <input
            v-model="newQuestion.description"
            type="text"
            placeholder="Quelle est la capitale de la France ?"
            class="input"
          />
        </label>

        <label>
          Type
          <select v-model="newQuestion.type" class="type-select">
            <option value="simpleChoice">QCU</option>
            <option value="multipleChoice">QCM</option>
            <option value="input">Texte</option>
            <option value="order">Ordre</option>
          </select>
        </label>

        <label>
          Durée
          <input
            type="number"
            class="input"
            v-model="newQuestion.duration"
            min="1"
            placeholder="1"
          />
        </label>

        <label>
          Score
          <input
            type="number"
            class="input"
            v-model="newQuestion.score"
            min="1"
            placeholder="1"
          />
        </label>
      </section>

      <div class="modal-actions">
        <button @click="emit('close')" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary">Créer</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch,toRefs } from "vue";
import axios from "@/axios";

const props = defineProps({
  show: Boolean,
  quizId: Number,
  data: {
      type: Object,
      default: () => ({}),
  },
});

const { data } = toRefs(props);

const emit = defineEmits(["close", "refresh"]);

const newQuestion = ref({
  description: "",
  type: "simpleChoice",
  duration: 0,
  score: 0,
});

const submitForm = async () => {
  let createdQuestion = null;

  try {
    const response = await axios.post("/questions", newQuestion.value);
    createdQuestion = response.data;
  } catch (error) {
    console.error("Erreur lors de la création de la question :", error);
    return;
  }

  try {
    await axios.post("/quiz-question", {
      idQuiz: props.quizId,
      idQuestion: createdQuestion.idQuestion,
      order: data.value.questionNumber,
    });
  } catch (error) {
    console.error("Erreur lors de l'association question-quiz :", error);
    return;
  }

  newQuestion.value = {
    description: "",
    type: "simpleChoice",
    duration: 0,
    score: 0,
  };

  emit("refresh");
  emit("close");
};
</script>

<style scoped>
.new-question-content {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;

  & label {
    align-items: start;
  }

  & .new-question-text {
    grid-column: 1 / span 3;
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

</style>
