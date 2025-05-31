<template>
  <div>
    <main class="main-content">
      <div class="title-container">
        <h1>Tous les QWIZS</h1>
        <div class="categories">
            <select class="type-select" default="Catégorie" v-model="selectedCategory">
              <option value="Catégorie">Trier par catégorie</option>
              <option :value="category.name" v-for="category in categories"
            :key="category.idCategory">{{ category.name }}</option>
            </select>
        </div>
       
      </div>

      <div class="quiz-container">
        <div
          class="quiz-card"
          v-for="quiz in filteredQuizzes"
          v-if="filteredQuizzes.length > 0"
          :key="quiz.idQuiz"
          @click="launchQuiz(quiz.idQuiz)"
        >
          <img src="/assets/quiz-icon.png" alt="Quiz Icon" class="quiz-icon-full" />
          <p class="quiz-title">{{ quiz.name }}</p>
          <p class="quiz-category">{{ getCategoryName(quiz.idCategory) }}</p> <!-- Ajouté -->
     
        </div>
        <p v-if="filteredQuizzes.length === 0">Aucun QWIZ</p>
      </div>
    </main>
  </div>

  
</template>

<script setup>
import { ref, reactive, onMounted, computed  } from "vue";
import { useRouter } from "vue-router";
import axios from "@/axios";
import { io } from 'socket.io-client';

const router = useRouter();

const quizzes = ref([]);
const categories = ref([]);
const showCategoryModal = ref(false);
const selectedCategory = ref("Catégorie");

const loadQuizzes = async () => {
  let quizList = [];

  try {
    const response = await axios.get(`/quiz/all`);
    
    
    quizList = response.data;
    
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste de quiz", error);
  }

  quizzes.value = quizList;
  console.log(quizzes.value);
};

function getCategoryName(idCategory) {
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].idCategory === idCategory) {
      return categories.value[i].name;
    }
  }
  return "";
}


const loadCategories = async () => {
  try {
    const response = await axios.get(`/categories/all`);
    categories.value = response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des catégories`, error);
  }
};

const filteredQuizzes = computed(() => {
  if (selectedCategory.value === 'Catégorie') {
    return quizzes.value;
  }
  return quizzes.value.filter(
    quiz => getCategoryName(quiz.idCategory) === selectedCategory.value
  );
});

onMounted(() => {
  loadQuizzes();
  loadCategories();
});

const goToQuiz = (quizId) => {
  router.push(`/quizs/${quizId}`);
};

const socket = io('https://prototype-backend-typ0.onrender.com/');

const launchQuiz = (quizId) => {
  socket.emit('generateQuizCode', quizId);

  socket.on('quizCodeGenerated', (code) => {
    router.push(`/quiz/${code}/waiting/?user=${localStorage.getItem('username')}`);
  });
};
</script>

<style scoped>
.main-content {
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  text-align: center;
  background-color: #ffffff;

  & .type-select {
    width: 13rem;
  }

  & label {
    align-items: start;
  }
}

.title-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #c46fc8;
    margin-bottom: 2rem;
    font-family: "Nerko One", cursive;
  }
}

.categories{
  display: flex;
  align-items: center;
  gap: 1rem;

  & img{
    height: 3rem;
    transition: transform 0.2s ease;
    z-index: 1;
    position: relative;
    cursor: pointer;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.quiz-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 1.25rem;
  justify-content: center;
  padding: 0 1.25rem;
  background: #ffffff;
}
.quiz-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none;
  width: 15rem;
  overflow: hidden;
  box-shadow: none; 
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  padding: .5rem;
  border-radius: 1rem;
}

.quiz-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.quiz-icon-full {
  width: 100%;
  object-fit: contain;
}
.quiz-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #c46fc8;
  text-align: center;
  margin-top: 0.5rem;
}

.quiz-category {
  font-size: 0.9rem; /* plus petit que le titre */
  color: #3d3d3d;
  font-weight: 500;
}
</style>
