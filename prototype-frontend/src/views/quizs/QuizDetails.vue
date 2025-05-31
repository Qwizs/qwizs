<template>
  <main class="main-content">
    <h1>Modifier mon Qwiz : {{ quizName }}</h1>
    <div class="questions-wrapper">
      <div class="questions-header">
        <img
          src="/assets/add_question.png"
          alt="Add Question"
          class="add-question-btn"
          @click="showCreateQuestionModal = true"
        />
        <img
          src="/assets/edit_order.png"
          alt="Add Question"
          class="add-question-btn"
          @click="showEditOrderModal = true"
        />
      </div>
      <div class="questions-container">
        <div
          class="question-wrap"
          v-for="(question, index) in questionsList"
          :key="question.idQuestion"
        >
          <div class="question-card">
            <div class="question-left">
              <span class="question-number">{{ question.order }}</span>
              <span class="question-font">{{ question.description }}</span>
              
            </div>
            <div class="question-right">
              <span class="question-time"
                >{{ question.duration }} seconde(s)</span
              >
              <span class="question-score">{{ question.score }} point(s)</span>
              <span class="question-font">{{ (question.type === "simpleChoice") ? "QCU" : (question.type === "multipleChoice" ? "QCM" : (question.type === "order") ? "Ordre" : "Texte") }}</span>
              <div class="question-actions">
                <img
                  src="/assets/edit.png"
                  alt="Modify Quiz"
                  class="button-quiz-image"
                  @click="openEditQuestionModal(question)"
                />
                <img
                  src="/assets/delete.png"
                  alt="Remove Quiz"
                  class="button-quiz-image"
                  @click="openDeleteQuestionModal(question)"
                />
              </div>
            </div>
          </div>
          <div class="question-content">
            <div class="answers-header">
              <h3>{{question.answers.length > 1 ? "Réponses" : "Réponse"}}</h3>
              <img
                src="/assets/add_answer.png"
                alt="Add Answer"
                class="add-answer-btn"
                @click="openCreateAnswerModal(question)"
                v-if="!(question.type === 'input' && question.answers.length === 1)"
              />
            </div>
            <div class="answers-container">
              <div
                class="answer-card"
                v-for="(answer, index) in questionsList[index].answers"
                :key="answer.idAnswer"
              >
              <div class="question-left">
              <span class="question-number">{{ index+1 }}</span>
              <span class="question-font">{{ answer.value }}</span>
            </div>
            <div class="question-right">
              <span v-if="answer.order" class="question-time"
                >Ordre : {{ answer.order }}</span
              >
              <span v-if="answer.state" class="question-score">Bonne réponse</span>
              <div class="answer-actions">
                <img
                  src="/assets/edit.png"
                  alt="Modify Quiz"
                  class="edit-answer-image"
                  @click="openEditAnswerModal(answer, question)"
                />
                <img
                  src="/assets/delete.png"
                  alt="Remove Quiz"
                  class="delete-answer-image"
                  @click="openDeleteAnswerModal(answer, question)"
                />
              </div>
            </div>
            
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Draggable v-model="items" item-key="id">
      <template #item="{ element }">
        <div style="padding: 8px; margin: 4px; border: 1px solid #ccc; background-color: grey;">
          {{ element.name }}
        </div>
      </template>
    </Draggable>

  </main>

  <EditOrder
    v-if="showEditOrderModal"
    :data="{questions: questionsList, quizId: quizId }"
    @close="showEditOrderModal = false"
    @refresh="loadQuestions"
  />

  <CreateQuestion
    :show="showCreateQuestionModal"
    :quizId="Number(quizId)"
    @close="showCreateQuestionModal = false"
    :data="{questionNumber: questionsList.length + 1}"
    @refresh="loadQuestions"
  />

  <ModifyQuestion
    v-if="(showEditQuestionModal && selectedQuestion)"
    :data="{ question: selectedQuestion }"
    @close="showEditQuestionModal = false"
    @refresh="loadQuestions"
  />

  <DeleteQuestion
    v-if="showDeleteQuestionModal"
    :data="{currentQuestion: selectedQuestion, quizId: quizId }"
    @close="showDeleteQuestionModal = false"
    @refresh="loadQuestions"
  />

  <CreateAnswer
    v-if="showCreateAnswerModal"
    :data="{currentQuestion: selectedQuestion }"
    @close="showCreateAnswerModal = false"
    @refresh="loadQuestions"
  />

  <ModifyAnswer
    v-if="showEditAnswerModal"
    :data="{currentQuestion: selectedQuestion, currentAnswer: selectedAnswer }"
    @close="showEditAnswerModal = false"
    @refresh="loadQuestions"
  />

  <DeleteAnswer
    v-if="showDeleteAnswerModal"
    :currentAnswer="selectedAnswer"
    @close="showDeleteAnswerModal = false"
    @refresh="loadQuestions"
  />
</template>

<script setup>
import { useRouter, useRoute } from "vue-router";
import { ref, computed, onMounted } from "vue";
import axios from "@/axios";
import CreateQuestion from "@/components/CreateQuestion.vue";
import DeleteQuestion from "../../components/DeleteQuestion.vue";
import ModifyQuestion from "../../components/ModifyQuestion.vue";
import Draggable from "vuedraggable";
import EditOrder from "../../components/EditOrder.vue";
import CreateAnswer from "../../components/CreateAnswer.vue";
import DeleteAnswer from "../../components/DeleteAnswer.vue";
import ModifyAnswer from "../../components/ModifyAnswer.vue";

const route = useRoute();
const quizId = computed(() => route.params.id);
const questionsList = ref([]);
const quizName = ref("");

const items = ref([]);

const showEditOrderModal = ref(false);


const showCreateQuestionModal = ref(false);
const showEditQuestionModal = ref(false);
const showDeleteQuestionModal = ref(false);

const showCreateAnswerModal = ref(false);
const showEditAnswerModal = ref(false);
const showDeleteAnswerModal = ref(false);

const selectedQuestion = ref(null);
const selectedAnswer = ref(null);

onMounted(() => {
  loadQuestions();
  loadQuizName();
});

const openEditQuestionModal = (question) => {
  selectedQuestion.value = question;
  showEditQuestionModal.value = true;
}

const openEditAnswerModal = (answer, question) => {
  selectedAnswer.value = answer;
  selectedQuestion.value = question;
  showEditAnswerModal.value = true;
}

const openDeleteQuestionModal = (question) => {
  selectedQuestion.value = question;
  showDeleteQuestionModal.value = true;
  console.log(showDeleteQuestionModal.value);
}

const loadQuizName = async () => {
  try {
    const response = await axios.get(`/quiz/${quizId.value}`);
    quizName.value = response.data.name;

  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
};


const loadQuestions = async () => {
  try {
    const response = await axios.get(`/quiz-question/${quizId.value}/questions`);
    const questionL = [];
    

    for (const link of response.data) {
      let currentQuestion = null;
      const answerL = [];
      
      try {
        const response = await axios.get(`/questions/${link.idQuestion}`);
        if (response.data) {
          currentQuestion = { ...response.data, order: link.order }
          console.log(currentQuestion);
          
        }

        // REPONSES
        const response2 = await axios.get(
          `/answer-question/${link.idQuestion}`
        );

        

        for (const link of response2.data) {
          const response = await axios.get(
            `/answers/${link.idAnswer}`
          );

          if (response.data) {
            answerL.push({...response.data, ...link});
          }
        }
        currentQuestion = {
          ...currentQuestion,
          answers: answerL,
        };
      } catch (err) {
        console.error(
          `Erreur lors de la récupération de la question ${link.idQuestion}`, err
        );
      }
      questionL.push(currentQuestion);
    }
    questionsList.value = questionL.sort((a, b) => a.order - b.order);
    
  } catch (err) {
    console.error("Erreur inattendue :", err);
  }
  
  
};

</script>

<style lang="scss">
.main-content {
  padding: 7rem 0 3rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  text-align: center;
  background-color: #ffffff;
}

h1 {
  font-size: 3rem;
  font-weight: bold;
  color: #c46fc8;
  font-family: "Nerko One", cursive;
}

.questions-wrapper {
  position: relative;
  width: 55vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.questions-header {
  display: flex;
  justify-content: center;
  gap: 1rem;
  align-items: center;

  & h2 {
    font-size: 2rem;
  }

  & .add-question-btn {
    height: 3rem;
    cursor: pointer;
    margin: 1%;
    transition: transform 0.2s ease;
    z-index: 1;
    position: relative;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.question-card {
  background: #f9f9fb;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;

  
}

.question-left {
  display: flex;
  align-items: center;
  gap: 8px;

  & .question-number {
    background-color: #c46fc8;
    color: white;
    border-radius: 12px;
    padding: 4px 10px;
    font-weight: bold;
    font-size: 14px;
    line-height: 1;
    text-align: center;
  }

  & .question-font {
    color: #c46fc8;
    font-weight: bold;
    font-size: 16px;
    line-height: 1.2;
    margin: 0; /* important si tu gardes un <p> */
    display: inline-block;
  }
}


.question-right {
  display: flex;
  align-items: center;
  gap: 1rem;

  & .question-time {
    font-size: 14px;
    color: #666;
  }
  & .question-score {
    font-size: 14px;
    font-weight: bold;
    color: #28a745;
  }

  & .question-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  & img {
    height: 3rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
}
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

.question-wrap {
  display: flex;
  flex-direction: column;
}
.question-content {
  padding: 1rem;
}
.answers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  & h2 {
    font-size: 2rem;
  }

  & .add-answer-btn {
    height: 2.5rem;
    cursor: pointer;
    margin: 1%;
    transition: transform 0.2s ease;
    z-index: 1;
    position: relative;

    &:hover {
      transform: scale(1.1);
    }
  }
}

.answers-container {
  display: grid;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}
.answer-card {
  background: #fef5ff;
  padding: 1.25rem 1.5rem;
  border-radius: 10px;
  width: 100%;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 3rem;
}

.answer-actions {
  display: flex;
  gap: 0.5rem;
  margin-left: 1rem;

  & img {
    height: 2.5rem;
    aspect-ratio: 1/1;
    cursor: pointer;
    transition: transform 0.2s ease, background-color 0.3s ease;
    &:hover {
      transform: scale(1.1);
    }
  }
}
</style>
