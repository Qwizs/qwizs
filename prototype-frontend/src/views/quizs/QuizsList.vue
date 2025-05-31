<template>
  <div>
    <main class="quizs-wrap">
      <div class="title-container">
        <h1>Mes Qwizs</h1>
        <div class="actions">
          <img src="/assets/add_category.png" alt="" @click="isCategoryModalOpen = true" />
          <img src="/assets/add_qwiz.png" alt="" @click="isQuizModalOpen = true" />
        </div>
      </div>

      <div class="quiz-wrapper">

      <div class="quiz-container">
        <div
          class="quiz-card"
          v-for="quiz in quizzes"
          v-if="quizzes.length > 0"
          :key="quiz.idQuiz"
        >
          <img src="/assets/quiz-icon.png" alt="Quiz Icon" class="quiz-icon-full" @click="goToQuiz(quiz.idQuiz)"/>
          <p class="quiz-title">{{ quiz.name }}</p>
          <p class="quiz-category">{{ getCategoryName(quiz.idCategory) }}</p>
          <div class="buttons-container">
            <img v-if="quiz.questionsCount > 0" src="/assets/play.png" class="start" alt="" @click="launchQuiz(quiz.idQuiz)">
            <img src="/assets/edit.png" class="edit" alt="" @click="openModifyModal(quiz)"/>
            <img src="/assets/delete.png" class="delete" alt="" @click="openDeleteModal(quiz)">          
          </div>
          
        </div>

        <!--<p v-if="quizzes.length === 0">Aucun QWIZS</p>-->
        
     
      </div>

      
      </div>

    </main>
  </div>

  <CreateCategory
    :show="isCategoryModalOpen"
    :data="categories.map(category => category.name)"
    @close="isCategoryModalOpen = false"
    @refresh="loadCategories"
  />

  <CreateQuiz
    :show="isQuizModalOpen"
    :data="{quizs: quizzes.map(quiz => quiz.name), categories: categories}"
    @close="isQuizModalOpen = false"
    @refresh="loadQuizzes"
  />

  <ModifyQuiz
          v-if="isQuizModifyModalOpen && selectedQuiz"
          :data="{currentQuiz: selectedQuiz, quizs: quizzes.map(quiz => quiz.name), categories: categories}"
          @close="isQuizModifyModalOpen = false"
          @refresh="loadQuizzes"
        />
     

  <DeleteQuiz
    v-if="isQuizDeleteModalOpen && selectedQuiz"
    :data="{currentQuiz: selectedQuiz}"
    @close="isQuizDeleteModalOpen = false"
    @refresh="loadQuizzes"
  />

</template>


<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import axios from '@/axios';
import CreateQuiz from '@/components/CreateQuiz.vue';
import CreateCategory from '@/components/CreateCategory.vue';
import ModifyQuiz from '../../components/ModifyQuiz.vue';
import DeleteQuiz from '../../components/DeleteQuiz.vue';

const router = useRouter();

const quizzes = ref([]);
const categories = ref([]);

const isQuizModalOpen = ref(false);
const isCategoryModalOpen = ref(false);
const isQuizModifyModalOpen = ref(false);
const isQuizDeleteModalOpen = ref(false);
const selectedQuiz = ref(null);

const storedIdAdministrator = ref('');

const loadQuizzes = async () => {
  const storedId = storedIdAdministrator.value;

  try {
    const { data: quizList } = await axios.get(`/administrators/${storedId}/quizs`);
    const enrichedQuizList = [];

    for (const quiz of quizList) {
      let questionsCount = 0;
      try {
        const response = await axios.get(`/quiz-question/${quiz.idQuiz}/questions`);
        questionsCount = response.data.length;
      } catch (error) {
        console.error(`Erreur lors de la récupération du nombre de questions du quiz ${quiz.idQuiz}`, error);
      }

      enrichedQuizList.push({
        ...quiz,
        questionsCount,
      });
    }

    quizzes.value = enrichedQuizList.sort((a, b) => a.idQuiz - b.idQuiz);
    console.log(quizzes.value);
    
    
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste de quiz", error);
  }
};

function getCategoryName(idCategory) {
  for (let i = 0; i < categories.value.length; i++) {
    if (categories.value[i].idCategory === idCategory) {
      return categories.value[i].name;
    }
  }
  return 'inconnue';
}

const loadCategories = async () => {
  try {
  const response = await axios.get('/categories/all');
  const data = response.data;
  categories.value = data;
} catch (error) {
  console.error('Erreur lors de la récupération des catégories :', error);
}

  
};
const load = () => {
  storedIdAdministrator.value = localStorage.getItem('idAdmin') || '';
  loadQuizzes();
  loadCategories();
};

onMounted(() => {
    load();
    router.afterEach(() => {
      storedIdAdministrator.value = localStorage.getItem('idAdmin') || '';
    })
});

const openModifyModal = (quiz) =>{
  selectedQuiz.value = quiz;
  isQuizModifyModalOpen.value = true;
}

const openDeleteModal = (quiz) =>{
  selectedQuiz.value = quiz;
  isQuizDeleteModalOpen.value = true;
}

const goToQuiz = (quizId) => {
  router.push(`/my-quizs/${quizId}`); 
};

const goToNewQuiz = () => {
  router.push(`/new-quiz`); 
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

.quizs-wrap {
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  text-align: center;
  background-color: #ffffff;
}

.title-container{
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  h1 {
    font-size: 3rem;
    font-weight: bold; 
    color: #C46FC8; 
    font-family: 'Nerko One', cursive;
  }
}
.actions{
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


.quiz-wrapper {
  position: relative; 
  display: flex;
  flex-direction: column;
  align-items: center;
}
.quiz-container {
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
  padding: 0 20px;
  background: #ffffff; 
}
.quiz-card, .add-quiz-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: none; 
  width: 12rem;
  overflow: hidden;
}

.add-quiz-card{
  gap: 0;
  &:hover {
    cursor: pointer;
  }
}
.quiz-icon-full {
  width: 100%;
  object-fit: contain;
  cursor: pointer;
}
.quiz-title {
  font-size: 1.25rem;
  font-weight: bold;
  color: #C46FC8;
  text-align: center;
  margin-top: .5rem;
}

.quiz-category {
  font-size: .9rem; /* plus petit que le titre */
  color: #3d3d3d;
  font-weight: 500;
}

.buttons-container {
  display: flex;
  justify-content: center;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  width: 100%;
  margin-top: .5rem;
}
.buttons-container img{
  cursor: pointer;
  height: 2.8rem;
  aspect-ratio: 3/2.5;
  transition: transform 0.2s ease;

  &:hover{
    transform: scale(1.05);
  }
}


</style>

