<template>
  <div class="modal-overlay">
    <div class="modal delete-quiz-modal">
      <h2>Supprimer une question</h2>

      <section class="new-question-content">

        <p>Confirmez-vous la suppression de la question : <strong>{{ currentQuestion.description }}</strong></p>
      </section>
      
      <div class="modal-actions">
        <button @click="emit('close')" class="btn-secondary">Annuler</button>
        <button @click="submitForm" class="btn-primary delete">Supprimer</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from "vue";
import axios from "@/axios";

export interface Question {
  idQuestion: number;
  description: string;
  type: string;
  duration: number;
  score: number;
}

const props = defineProps<{
  data: {
      currentQuestion: Question;
  },
  quizId: number;
}>();

const emit = defineEmits(["close", "refresh"]);

const { data, quizId } = toRefs(props);
const currentQuestion = ref(data.value.currentQuestion);

const submitForm = async () => {
    try {
      const response2 = await axios.delete(`/questions/${currentQuestion.value.idQuestion}`);
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
  
  & p{
    display: flex;
    font-size: 1.2rem;
    gap: .5rem;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    & strong{
      font-size: 1.5rem;
    }
  }
}


</style>
