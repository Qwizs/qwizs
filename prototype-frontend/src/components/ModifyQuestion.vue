<template>
  <div class="modal-overlay">
    <div class="modal new-question-modal">
      <h2>Modifier question</h2>

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
        <button @click="submitForm" class="btn-primary">Modifier</button>
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

const emit = defineEmits(["close", "refresh"]);
const { data } = toRefs(props);
const currentQuestion = ref({...data.value.question});
const newQuestion = ref({
  description: currentQuestion.value.description,
  type: currentQuestion.value.type,
  duration: currentQuestion.value.duration,
  score: currentQuestion.value.score,
});

const submitForm = async () => {
  try {
    const response = await axios.patch(
      `/questions/${currentQuestion.value.idQuestion}`,
      newQuestion.value
    );
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Erreur lors de la modification de la question :", error);
    return;
  }
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

.new-question-modal {
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

<!-- <script>
// const modifyQuestion = async () => {
//   if (!selectedQuestionId.value?.toString().trim()) return;

//   try {

//     const body = {};
//     body.id

//     if (newQuestion.value?.trim()) {
//       body.description = newQuestion.value.trim();
//     }

//     if (selectedType.value?.trim()) {
//       body.type = selectedType.value.trim();
//     }

//     const scoreString = selectedScore.value?.toString().trim();
//     if (scoreString) {
//       body.score = scoreString;
//     }

//     const durationString = selectedDuration.value?.toString().trim();
//     if (durationString) {
//       body.duration = durationString;
//     }

//     const { data, error } = await useFetch(`/questions/${selectedQuestionId.value}`, {
//       baseURL: useRuntimeConfig().public.apiBase,
//       method: 'PATCH',
//       body,
//     });

//     if (error.value) {
//       console.error('Erreur lors de la modification de la question :', error.value);
//       return;
//     }

//     const updatedQuestionId = data.value;
//     console.log("updatedQuestionId", updatedQuestionId);

//     const body2 = {};

//     const orderString = selectedOrder.value?.toString().trim();
//     if (orderString) {
//       body2.order = orderString;
//     }

//     if (Object.keys(body2).length === 0) {
//       console.warn("Aucune donnée à modifier.");
//       selectedQuestionId.value = "";
//       newQuestion.value = "";
//       selectedType.value = "";
//       selectedScore.value = "";
//       selectedDuration.value = "";
//       loadQuestions();
//       loadQuizQuestions()
//       closeModal3();
//     }

//     const { data: data2, error: error2 } = await useFetch(`/quiz-question/${quizId.value}/${selectedQuestionId.value}`, {
//       baseURL: useRuntimeConfig().public.apiBase,
//       method: 'PATCH',
//       body: body2,
//     });

//     if (error2.value) {
//       console.error('Erreur lors de la création de question-quiz :', error2.value);
//       return;
//     }

//     console.log(data2)

//     selectedQuestionId.value = "";
//     newQuestion.value = "";
//     selectedType.value = "";
//     selectedScore.value = "";
//     selectedDuration.value = "";
//     selectedOrder.value = "";
//     loadQuestions();
//     loadQuizQuestions()
//     closeModal3();

//   } catch (err) {
//     console.error("Erreur inattendue :", err);
//   }
// };
</script> -->
