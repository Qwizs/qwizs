import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import QuestionDetail from '../views/question/QuestionDetail.vue'
import AllQuizs from '../views/AllQuizs.vue'
import JoinQuiz from '../views/JoinQuiz.vue'
import GameQuiz from '../views/quiz/GameQuiz.vue'
import ResultQuiz from '../views/quiz/ResultQuiz.vue'
import WaitingRoomQuiz from '../views/quiz/WaitingRoomQuiz.vue'
import Login from '../views/Login.vue'
import Profile from '../views/Profile.vue'
import Signin from '../views/Signin.vue'
import QuizsList from '../views/quizs/QuizsList.vue'
import QuizDetails from '../views/quizs/QuizDetails.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/question/:id', component: QuestionDetail},
  

  { path: '/quiz/:room/game', component: GameQuiz },
  { path: '/quiz/:room/result', component: ResultQuiz },
  { path: '/quiz/:room/waiting', component: WaitingRoomQuiz },

  { path: '/my-quizs', component: QuizsList },
  { path: '/my-quizs/:id', component: QuizDetails },

  { path: '/new-quiz', component: Home },

  { path: '/quizs', component: AllQuizs },
  { path: '/join', component: JoinQuiz },
  { path: '/connexion', component: Login },
  { path: '/profile', component: Profile },
  { path: '/inscription', component: Signin },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})