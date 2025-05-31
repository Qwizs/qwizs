<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { io } from "socket.io-client";
import { ref, onMounted, onBeforeUnmount, computed } from "vue";
import Draggable from "vuedraggable";

interface OrderAnswer {
  id: number;
  label: string;
}

const route = useRoute();
const router = useRouter();

const room = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);



let startTime: number;
let answerTime: number | null = null;

const currentQuestion = ref<{
  infos: { description: string; type: string; duration: number };
  options: any[];
  correctOption: string[];
} | null>(null);
const selectedQCUAnswer = ref<string | null>(null);
const selectedQCMAnswers = ref<string[]>([]);
const inputAnswer = ref<string | null>(null);
const orderAnswers = ref<OrderAnswer[]>(
  currentQuestion.value?.options.map((option, index) => ({
    id: index,
    label: option.value,
  })) || []
);

const score = ref(0);
const maxPoints = 1000;
const maxDelay = 10000;

const currentQuestionScore = ref<number | null>(null);
const perQuestionScores = ref<number[]>([]);

const allUsersResponded = ref(false);
const finalScores = ref<{ [user: string]: number }>({});
const answerRevealed = ref(false);
const answerIsSend = ref(false);
const questionIndex = ref(0);
const progress = ref(100);

let progressInterval: ReturnType<typeof setInterval> | null = null;

const resetProgress = () => {
  if (!currentQuestion.value || !currentQuestion.value.infos?.duration) {
    console.warn("Durée de la question non définie");
    return;
  }

  progress.value = 100;

  if (progressInterval) clearInterval(progressInterval);

  const durationMs = currentQuestion.value.infos.duration * 1000;
  const stepTime = 100; 
  const stepsCount = durationMs / stepTime;
  const decrement = 100 / stepsCount;

  progressInterval = setInterval(() => {
    if (progress.value > 0) {
      progress.value -= decrement;
      if (progress.value < 0) progress.value = 0;
    } else {
      if (progressInterval !== null) {
        clearInterval(progressInterval);
        progressInterval = null;
      }

      if (currentQuestionScore.value === null){
      switch (currentQuestion.value?.infos.type) {
            case "simpleChoice":
              selectedQCUAnswer.value = "";
              break;
            case "multipleChoice":
              selectedQCMAnswers.value = [];
              break;
            case "input":
              inputAnswer.value = "";
              break;
            case "order":
              orderAnswers.value = [];
              break;
          
            default:
              break;
          }
          answerIsSend.value = true;
          currentQuestionScore.value = 0;
          socket.emit("submitAnswer", {
            user: user.value,
            room: room.value,
            score: currentQuestionScore.value,
          });
      }
    
    }
  }, stepTime);
};

const socket = io("https://prototype-backend-typ0.onrender.com/", {
  transports: ["websocket", "polling"],
});

const selectOption = (option: string) => {
  switch (currentQuestion.value?.infos.type) {
    case "simpleChoice":
      selectedQCUAnswer.value = option;
      submitAnswer();
      break;

    case "multipleChoice":
      if (selectedQCMAnswers.value.includes(option)) {
        selectedQCMAnswers.value = selectedQCMAnswers.value.filter(
          (answer) => answer!== option
        );
      } else {
        selectedQCMAnswers.value.push(option);
      }
      break;

    default:
      break;
  }
};

const submitAnswer = () => {
  let earnedScore = 0;
  answerIsSend.value = true;
  switch (currentQuestion.value?.infos.type) {
    case "simpleChoice":
      if (
        selectedQCUAnswer.value &&
        currentQuestion.value.correctOption.includes(
          selectedQCUAnswer.value.trim().toLowerCase()
        )
      ) {
        const delay = (answerTime ?? Date.now()) - startTime;
        const clampedDelay = Math.min(delay, maxDelay);
        const speedRatio = 1 - clampedDelay / maxDelay;
        earnedScore = Math.floor(maxPoints * speedRatio);
        score.value += earnedScore;
      }
      break;
    case "multipleChoice":
      if (
        compareAnswers(
          selectedQCMAnswers.value,
          currentQuestion.value.correctOption
        )
      ) {
        const delay = (answerTime ?? Date.now()) - startTime;
        const clampedDelay = Math.min(delay, maxDelay);
        const speedRatio = 1 - clampedDelay / maxDelay;
        earnedScore = Math.floor(maxPoints * speedRatio);
        score.value += earnedScore;
      }
      break;
    case "input":
      const correctAnswer = currentQuestion.value.correctOption.map((option) => option.trim().toLowerCase());
      
      if (
        inputAnswer.value &&
        correctAnswer.includes(
          inputAnswer.value.trim().toLowerCase()
        )
      ) {
        const delay = (answerTime ?? Date.now()) - startTime;
        const clampedDelay = Math.min(delay, maxDelay);
        const speedRatio = 1 - clampedDelay / maxDelay;
        earnedScore = Math.floor(maxPoints * speedRatio);
        score.value += earnedScore;
        
      }
      break;
    case "order":
      if(areAnswersInSameOrder(orderAnswers.value, currentQuestion.value.correctOption)){
        const delay = (answerTime ?? Date.now()) - startTime;
        const clampedDelay = Math.min(delay, maxDelay);
        const speedRatio = 1 - clampedDelay / maxDelay;
        earnedScore = Math.floor(maxPoints * speedRatio);
        score.value += earnedScore;
      }
      break;
    default:
      break;
  }

  currentQuestionScore.value = earnedScore;
  console.log(currentQuestionScore.value);
  
  socket.emit("submitAnswer", {
  user: user.value,
  room: room.value,
  score: currentQuestionScore.value,
  });
};

onMounted(() => {
  socket.connect();

  if (room.value) {
    socket.emit("joinQuizRoom", { user: user.value, room: room.value });
  }

  socket.on("newQuestion", (data) => {
    currentQuestion.value = data;
    startTime = Date.now();
    answerTime = null;
    selectedQCUAnswer.value = null;
    selectedQCMAnswers.value = [];
    inputAnswer.value = null;
    orderAnswers.value = currentQuestion.value?.options.map((option, index) => ({
    id: index,
    label: option.value,
  })) || [];
    allUsersResponded.value = false;
    answerIsSend.value = false;
    answerRevealed.value = false;
    currentQuestionScore.value = null;
    questionIndex.value += 1;
    resetProgress();
  });

  socket.on("allUsersResponded", () => {
    allUsersResponded.value = true;
    if (progressInterval) {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  });

  socket.on("revealAnswer", (data) => {
    answerRevealed.value = true;
    perQuestionScores.value.push(currentQuestionScore.value!);
  });

  socket.on("quizEnded", (scores) => {
    finalScores.value = scores;
    router.push({
      path: `/quiz/${room.value}/result`,
      query: {
        user: user.value,
        score: score.value.toString(),
        scores: encodeURIComponent(JSON.stringify(scores)),
        history: encodeURIComponent(JSON.stringify(perQuestionScores.value)),
      },
    });
  });

  socket.on("exception", (data) => {
    console.error("Erreur:", data);
  });

  socket.on("disconnect", () => {
    console.log("Déconnecté");
  });
});

const compareAnswers = (selected: string[], correct: string[]): boolean => {
  const selectedSet = new Set(selected.map((s) => s.trim().toLowerCase()));
  const correctSet = new Set(correct.map((c) => c.trim().toLowerCase()));

  return (
    selectedSet.size === correctSet.size &&
    [...selectedSet].every((val) => correctSet.has(val))
  );
};

const areAnswersInSameOrder = (answersObjArray, answersIdArray, idKey = 'id') => {
  if (answersObjArray.length !== answersIdArray.length) return false;
  for (let i = 0; i < answersObjArray.length; i++) {
    if (answersObjArray[i].label != answersIdArray[i]) {
      return false;
    }
  }
  return true;
}

onBeforeUnmount(() => {
  socket.disconnect();
  if (progressInterval) clearInterval(progressInterval);
});

const handleInputAnswer = () => {};
</script>

<template>
  <main class="game-wrap">
    <UContainer
      class="flex flex-col justify-start p-4 gap-4 bg-white text-black"
    >
      <transition name="fade-slide" mode="out-in">
        <div v-if="currentQuestion" :key="questionIndex" class="question-card">
          <div class="progress-bar-wrapper" v-if="!allUsersResponded">
            <div class="progress-bar" :style="{ width: progress + '%' }"></div>
          </div>

          <h3 class="question-text">{{ currentQuestion.infos.description }}</h3>

          <div class="input-list" v-if="currentQuestion.infos.type === 'input'">
            <input
              v-model="inputAnswer"
              v-if="!answerRevealed"
              type="text"
              placeholder="Votre réponse"
              class="input answer-input"
           />

            <input
              v-model="currentQuestion.correctOption[0]"
              v-if="answerRevealed"
              type="text"
              class="input answer-input"
              :class="[{correct: inputAnswer && currentQuestion.correctOption[0].trim().toLowerCase() === inputAnswer!.trim().toLowerCase()},{incorrect: !inputAnswer || currentQuestion.correctOption[0].trim().toLowerCase() !== inputAnswer!.trim().toLowerCase()}]"
            />
            <button
              @click="!answerRevealed && submitAnswer()"
              class="btn-primary"
              v-if="!answerIsSend"
            >
              Valider
            </button>
          </div>

          <div
            class="options-list"
            v-if="
              currentQuestion.infos.type === 'simpleChoice' ||
              currentQuestion.infos.type === 'multipleChoice'
            "
          >
            <div
              v-for="option in currentQuestion.options"
              :key="option"
              @click="
                !selectedQCUAnswer &&
                  !answerRevealed &&
                  selectOption(option.value)
              "
              :class="[
                'option-button',
                {
                  selected:
                    (currentQuestion.infos.type === 'simpleChoice' &&
                      selectedQCUAnswer === option.value) ||
                    (currentQuestion.infos.type === 'multipleChoice' &&
                      selectedQCMAnswers?.includes(option.value)),
                },
                {
                  correct:
                    answerRevealed &&
                    currentQuestion.correctOption?.includes(option.value),
                },
                {
                  incorrect:
                    answerRevealed &&
                    ((currentQuestion.infos.type === 'simpleChoice' &&
                      selectedQCUAnswer === option.value &&
                      !currentQuestion.correctOption.includes(option.value)) ||
                      (currentQuestion.infos.type === 'multipleChoice' &&
                        selectedQCMAnswers?.includes(option.value) &&
                        !currentQuestion.correctOption.includes(option.value) &&
                        !currentQuestion.correctOption?.includes(
                          option.value
                        ))),
                },
                {
                  'disabled-option':
                    currentQuestion.infos.type === 'simpleChoice' &&
                    selectedQCUAnswer &&
                    selectedQCUAnswer !== option.value &&
                    !answerRevealed,
                },
              ]"
            >
              {{ option.value }}
            </div>
            <button
              @click="!answerRevealed && submitAnswer()"
              class="btn-primary"
              v-if="
                !answerIsSend && currentQuestion.infos.type !== 'simpleChoice'
              "
            >
              Valider
            </button>
          </div>

          <div class="order-list" v-if="currentQuestion.infos.type === 'order'">
            <div class="list-container" :class="{'two-columns': answerRevealed}">
              <Draggable v-model="orderAnswers" item-key="id" style="display: flex; flex-direction: column; gap: .25rem;">
                <template #item="{ element, index }">
                  <div
                    class="option-button order"
                    :class="[{ correct: answerRevealed && element.label === currentQuestion.correctOption[index]}, {incorrect: answerRevealed && element.label !== currentQuestion.correctOption[index] }]"
                    
                  >
                    {{ element.label }}
                  </div>
                </template>
              </Draggable>
              <div v-if="answerRevealed" class="correct-list" style="display: flex; flex-direction: column; gap: .25rem;">
                <div
                    class="option-button order"
                     v-for="option in currentQuestion.correctOption"
                    :key="option"
                  >
                    {{ option }}
                  </div>
              </div>
            </div>
            
            <button
              @click="!answerRevealed && submitAnswer()"
              class="btn-primary"
              v-if="!answerIsSend"
            >
              Valider
            </button>
          </div>

          <p
            v-if="answerRevealed && currentQuestionScore !== null"
            class="mt-4 text-sm text-gray-600"
          >
            Tu as gagné {{ currentQuestionScore }} point{{
              currentQuestionScore !== 1 ? "s" : ""
            }}
            sur cette question.
          </p>
        </div>
      </transition>
    </UContainer>
  </main>
</template>

<style scoped>
.game-wrap {
  padding-top: 8rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.question-card {
  padding: 1rem;
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 60vw;
}

.question-text {
  font-size: 2rem;
  font-weight: 600;
  color: #7b2e87;
  margin-bottom: 1.25rem;
}

.options-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  gap: .5rem;
  width: 20rem;

  & .btn-primary{
  width: 100%;
  grid-column: 1 / span 2;
}
  
}



.input-list, .order-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  & .btn-primary{
  width: 100%;
  }
  
}

.list-container {
  display: grid;
  grid-template-columns: repeat(1, 10rem);
  gap: 1rem;

  &.two-columns{
    grid-template-columns: repeat(2, 10rem);
  }
}

.answer-input{
  &.correct{
    background-color: #c8f7d2;
    border-color: #4caf50;
    color: #2e7d32;
  }

  &.incorrect{
    background-color: #f8d2d2;
    border-color: #f44336;
    color: #c62828;
  }
}

.option-button {
  background-color: #fff;
  border: 2px solid #ddd;
  padding: 12px;
  border-radius: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.option-button:hover:not(.order) {
  background-color: #f5ecfa;
}

.option-button.selected {
  border-color: #c46fc8;
  background-color: #f0dbf8;
}

.option-button.correct {
  background-color: #c8f7d2;
  border-color: #4caf50;
  color: #2e7d32;
}

.option-button.incorrect {
  background-color: #f8d2d2;
  border-color: #f44336;
  color: #c62828;
}

.disabled-option {
  pointer-events: none;
  opacity: 0.5;
}

.progress-bar-wrapper {
  width: 100%;
  height: 8px;
  background-color: #f8effa;
  border-radius: 20px;
  overflow: hidden;
  margin-bottom: 16px;
}

.progress-bar {
  height: 100%;
  background-color: #c46fc8;
  transition: width 0.1s linear;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
