<template>
    <main class="main-content">
        <h1 class="question-title">{{ questionDescription }}</h1>

    <div class="question-wrapper">
      <div class="quiz-header">
        <img
          src="/assets/add_qwiz.png"
          alt="Add Answer"
          class="button-quiz-image"
          @click="openModal"
        />
        <img
          src="/assets/edit.png"
          alt="Modify Answer"
          class="button-quiz-image"
          @click="openModal3"
        />
        <img
          src="/assets/delete.png"
          alt="Remove Answer"
          class="button-quiz-image"
          @click="openModal2"
        />
        <img
          src="/assets/remove_all.png"
          alt="Remove All Answers"
          class="remove-quiz-image"
          @click="openModal3"
        />
      </div>
        <div class="answer-container">
          <div class="answer-card" v-for="answer in answerList" :key="answer.idAnswer">
            <p class="answer-font">{{ answer.value }}</p>
            <!-- <p class="answer-category">Catégorie : {{ getCategoryName(quiz.idCategory) }}</p> -->
          </div>
        </div>
    </div>        
    </main> 

    <div v-if="showModal" class="modal-overlay">
      <div class="modal">
        <h2>Entrez une réponse</h2>
        <input v-model="newAnswer" type="text" placeholder="Réponse" class="answer-input" />
        <select v-model="selectedRightOrFalse" class="type-select">
          <option disabled value="">Choisissez un type de question</option>
          <option :value="true">Bonne réponse</option>
          <option :value="false">Mauvaise réponse</option>
        </select>
        <h2>Position de la réponse</h2>
        <input type="number" v-model="selectedOrder" min="1" placeholder="1"/>  
        <div class="modal-actions">
          <button @click="addAnswer" class="btn-primary">Créer</button>
          <button @click="closeModal" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>

    <div v-if="showModal2" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez la réponse à supprimer</h2>
        <select v-model="selectedAnswerId" class="answer-select">
          <option disabled value="">Choisissez une réponse</option>
          <option
          v-for="answer in answerList"
            :key="answer.idAnswer"
            :value="answer.idAnswer"
          >
          {{ answer.value }}
          </option>
        </select>
        <div class="modal-actions">
          <button @click="removeAnswer" class="btn-primary">Supprimer</button>
          <button @click="closeModal2" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div> 

    <div v-if="showModal3" class="modal-overlay">
      <div class="modal">
        <h2>Choisissez la réponse à modifier</h2>
        <select v-model="selectedAnswerId" class="type-select">
          <option disabled value="">Choisissez une réponse</option>
          <option
          v-for="answer in answerList"
            :key="answer.idAnswer"
            :value="answer.idAnswer"
          >
          {{ answer.value }}
          </option>
        </select>        
        <h2>Entrez une réponse</h2>
        <input v-model="newAnswer" type="text" placeholder="Réponse" class="answer-input" />
        <select v-model="selectedRightOrFalse" class="type-select">
          <option disabled value="">Choisissez un type de question</option>
          <option :value="true">Bonne réponse</option>
          <option :value="false">Mauvaise réponse</option>
        </select>
        <input type="number" v-model="selectedOrder" min="1" placeholder="1"/>  
        <div class="modal-actions">
          <button @click="modifyAnswer" class="btn-primary">Modifier</button>
          <button @click="closeModal3" class="btn-secondary">Annuler</button>
        </div>
      </div>
    </div>    
</template>

<script setup>
import { useRoute } from 'vue-router';
import { ref, computed, onMounted } from 'vue';

const route = useRoute();
const questionDescription = ref("");
const answerList = ref([]);
const questionId = computed(() => route.params.id);
const currentQuestion = ref({
    idQuestion: null,
    description: '',
    type: '',
    duration: null,
    score: null
});

const newAnswer = ref("");
const selectedRightOrFalse = ref(null);
const selectedOrder = ref('');
const selectedAnswerId = ref('');

const showModal = ref(false);
const showModal2 = ref(false);
const showModal3 = ref(false);
const showModal4 = ref(false);

onMounted(() => {
  loadQuestion();
  loadAnswers();
  
});

const openModal = () => {
  showModal.value = true;
  newAnswer.value = "";
  selectedRightOrFalse.value = "";
  selectedOrder.value = "";
};

const openModal2 = () => {
  showModal2.value = true;
  selectedAnswerId.value = "";
};

const openModal3 = () => {
  showModal3.value = true;
  selectedAnswerId.value = "";
  newAnswer.value = "";
  selectedRightOrFalse.value = "";
  selectedOrder.value = "";
};

const closeModal = () => {
  showModal.value = false;
  newAnswer.value = "";
  selectedRightOrFalse.value = "";
  selectedOrder.value = "";
};

const closeModal2 = () => {
  showModal2.value = false;
  selectedAnswerId.value = "";
};

const closeModal3 = () => {
  showModal3.value = false;
  selectedAnswerId.value = "";
  newAnswer.value = "";
  selectedRightOrFalse.value = "";
  selectedOrder.value = "";
};

const loadQuestion = async () => {
  console.log("question.id :", questionId.value);

  const { data: question, error: questionFetchError } = await useFetch(`/questions/${questionId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (questionFetchError.value) {
    console.error(`Erreur lors de la récupération de la question ${questionId.value}`);
  }

  currentQuestion.value = question.value;
  questionDescription.value = currentQuestion.value.description;

  console.log("currentQuestion, ", currentQuestion.value);
  console.log("questionDescription, ", questionDescription.value);
}

// Fonction pour charger les quiz depuis l'API
const loadAnswers = async () => {

  const { data, error } = await useFetch(`/answer-question/${questionId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'GET',
  });

  if (error.value || !data.value) {
  console.error("Erreur lors de la récupération des réponses");
  return;
}

  const answerL = []; 

  for (const link of data.value) {
    const { data: answerData, error : answerError } = await useFetch(`/answers/${link.idAnswer}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'GET',
    });

    if (answerError.value || !answerData.value) {
      console.error("Erreur lors de la récupération ddes réponses");
      return;
    }

    if (answerData.value) {
      answerL.push(answerData.value);
    }
  }

  answerList.value = answerL;
  console.log("answerList :", answerList.value);

};

const addAnswer = async () => {
  if (
  newAnswer.value.trim() === "" ||
  selectedRightOrFalse.value === "" ||
  selectedOrder.value === "" ||
  isNaN(Number(selectedOrder.value))
) return;


  try {
    const { data, error } = await useFetch('/answers', {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        value: newAnswer.value,
      },
    });

    if (error.value) {
      console.error('Erreur lors de la création de la réponse :', error.value);
      return;
    }  

    answerList.value.push({
      value: data.value.value,
    });

    const createdAnswer = data.value;
    console.log("createdAnswer :", createdAnswer);    
    
    const { data: data2, error: error2 } = await useFetch(`/answer-question`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'POST',
      body: {
        idQuestion: questionId.value,
        idAnswer: data.value.idAnswer,
        state: selectedRightOrFalse.value,
        order: selectedOrder.value
      },
    });  

    console.log(data2)
    
    if (error2.value) {
      console.error('Erreur lors de la création de question-quiz :', error2.value);
      return;
    }

    newAnswer.value = "";
    selectedRightOrFalse.value = "";
    selectedOrder.value = "";   
    closeModal();  
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};

const removeAnswer = async () => {

if (selectedAnswerId.value === "") return;

try {
  console.log("selectedAnswerId.value  :", selectedAnswerId.value);
  const { error: error2 } = await useFetch(`/answer-question/${questionId.value}/${selectedAnswerId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'DELETE'
  });  
  
  if (error2.value) {
    console.error('Erreur lors de la suppression de la réponse :', error.value);
    console.error('Détails de l\'erreur:', error.value.response || error.value);
    return;
  }  

  const { error: deleteErr } = await useFetch(`/answers/${selectedAnswerId.value}`, {
    baseURL: useRuntimeConfig().public.apiBase,
    method: 'DELETE'
  });

  if (deleteErr.value) {
    console.error('Erreur lors de la suppression de la réponse :', deleteErr.value);
    return;
  }

  answerList.value = answerList.value.filter(answer => answer.idAnswer !== selectedAnswerId.value);

  selectedAnswerId.value = "";
  closeModal2();
} catch (err) {
  console.error("Erreur inattendue :", err);
}
};

const modifyAnswer = async () => {
  if (!selectedAnswerId.value?.toString().trim()) return;

  try {

    const body = {};
    body.id

    if (newAnswer.value?.trim()) {
      body.value = newAnswer.value.trim();
    }

    const { data, error } = await useFetch(`/answers/${selectedAnswerId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PATCH',
      body,
    });

    if (error.value) {
      console.error('Erreur lors de la modification de la réponse :', error.value);
      return;
    }  

    const updatedAnswerId = data.value;
    console.log("updatedAnswerId", updatedAnswerId);
    
    const body2 = {};

    body2.idQuestion = questionId.value;
    body2.idAnswer = selectedAnswerId.value;

    if (selectedRightOrFalse.value !== null) {
      body2.state = selectedRightOrFalse.value;
    }

    const orderString = selectedOrder.value?.toString().trim();
    if (orderString) {
      body2.order = orderString;
    }    
    
    if (Object.keys(body2).length === 0) {
      console.warn("Aucune donnée à modifier.");
      selectedAnswerId.value = "";
      newAnswer.value = "";
      selectedRightOrFalse.value = "";
      loadAnswers();
      closeModal3();  
    }

    const { data: data2, error: error2 } = await useFetch(`/answer-question/${questionId.value}/${selectedAnswerId.value}`, {
      baseURL: useRuntimeConfig().public.apiBase,
      method: 'PATCH',
      body: body2,
    });  
    
    if (error2.value) {
      console.error('Erreur lors de la création de answer-quiz :', error2.value);
      return;
    }

    console.log(data2)

    selectedAnswerId.value = "";
    newAnswer.value = "";
    selectedRightOrFalse.value = "";
    selectedOrder.value = "";
    loadAnswers();
    closeModal3();  
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};
</script>

<style scoped>
.main-content {
  margin-top: 80px; 
  padding-top: 100px;
  text-align: center;
  background-color: #ffffff;
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

.quiz-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}

.button-quiz-image {
  width: 60px;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative; /* plus "absolute" */
}

.button-quiz-image:hover {
  transform: scale(1.1);
}

.remove-quiz-image {
  width: auto;
  height: 60px;
  cursor: pointer;
  margin: 1%;
  transition: transform 0.2s ease;
  z-index: 1;
  position: relative; /* plus "absolute" */
}

.remove-quiz-image:hover {
  transform: scale(1.1);
}

.answer-container {
  display: flex;
  flex-direction: column; /* ✅ Vertical */
  gap: 20px; /* ✅ Espacement entre les answers */
  max-width: 800px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
}


.answer-wrapper {
  position: relative;
  border: 2px solid #f7f7f7;
  border-radius: 15px;
  padding: 20px;
  background: #ffffff;
  margin: 40px auto; /* Augmentez la marge supérieure ici */
  max-width: 800px;
}

.answer-font {
  font-size: 1.2rem;
  font-weight: bold;
  color: #C46FC8;
  margin-bottom: 15px;
}

.question-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #C46FC8;
  margin-bottom: 15px;
}

.answer-list {
  margin-top: 20px;
  text-align: left;
}

.answer-item {
  background: #f7f7f7;
  padding: 10px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.answer-card {
  background: #F9F9FB;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.05);
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  text-align: left;
}

.answer-card:hover {
  transform: translateY(-3px);
  background-color: #f0e9f1;
}

.correct {
  color: #4CAF50;
  font-weight: bold;
}

.answer-form {
  margin-top: 20px;
  padding: 20px;
  background: #F9F9FB;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.answer-input {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  border: 3px solid #ccc;
  border-radius: 8px;
  margin-bottom: 15px;
  color: #000000;
}

.start-quiz-container {
  margin-top: 20px;
  text-align: center;
}

.btn-start {
  background: #28a745;
  color: white;
  padding: 12px 25px;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}

.btn-start:hover {
  background: #218838;
}

.quiz-started-message {
  font-size: 1.5rem;
  font-weight: bold;
  color: #28a745;
  margin-top: 15px;
}

.input-field, .select-field {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.input-field:focus, .select-field:focus {
  border-color: #C46FC8;
  outline: none;
}

.btn-primary {
  background: #C46FC8;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background 0.3s ease;
}

.btn-primary:hover {
  background: #86218B;
}

.btn-secondary {
  background: #ddd;
  color: black;
  padding: 8px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 5px;
}

.btn-secondary:hover {
  background: #bbb;
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
.input-field, .select-field {
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
</style> 