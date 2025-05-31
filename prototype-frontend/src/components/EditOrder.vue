<template>
  <div class="modal-overlay">
    <div class="modal delete-quiz-modal">
      <h2>Modifier l'ordre</h2>

      <section>
        <Draggable
          v-model="questions"
          item-key="idQuestion"
          class="edit-order-content"
          @change="updateOrders"
        >
          <template #item="{ element }">
            <div class="question-card">
              <div class="question-left">
                <span class="question-number">{{ element.order }}</span>
                <span class="question-font">{{ element.description }}</span>
              </div>
            </div>
          </template>
        </Draggable>
      </section>

      <div class="modal-actions">
        <button @click="emit('close')" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary">Valider</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import axios from "@/axios";
import Draggable from "vuedraggable";

interface Question {
  idQuestion: number;
  description: string;
  type: string;
  duration: number;
  score: number;
  order: number;
}

const props = defineProps<{
  data: {
    questions: Question[];
    quizId: number;
  };
}>();

const emit = defineEmits(["close", "refresh"]);

const { data } = toRefs(props);
const questions = ref(data.value.questions);
const quizId = ref(data.value.quizId);

const updateOrders = () => {
  console.log("here");

  questions.value.forEach((q, idx) => {
    q.order = idx + 1;
  });
};

const submitForm = async () => {
  console.log(questions.value[0]);

  try {
    const response = await axios.put(
      `/quiz-question/${quizId.value}/questions-order`,
      questions.value.map((q) => ({ idQuestion: q.idQuestion, order: q.order }))
    );
    emit("refresh");
    emit("close");
  } catch (error) {
    console.error("Erreur lors de la création du qwiz :", error);
    return;
  }
};
</script>

<style scoped>
.delete-quiz-modal {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.edit-order-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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
</style>
