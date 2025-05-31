<template>
  <div class="modal-overlay">
    <div class="modal delete-quiz-modal">
      <h2>Supprimer une réponse</h2>

      <section class="new-question-content">

        <p>Confirmez-vous la suppression de la réponse : <strong>{{ currentAnswer.value }}</strong></p>
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

export interface Answer {
  idAnswer: number;
  value: string;
  idQuestion: number;
}

const props = defineProps<{
  currentAnswer: Answer;
}>();

const emit = defineEmits(["close", "refresh"]);

const { currentAnswer } = toRefs(props);

const submitForm = async () => {
  try {
      const response = await axios.delete(`/answers/${currentAnswer.value.idAnswer}`);
      emit("refresh");
      emit("close");
    } catch (error) {
      console.error("Erreur lors de la suppression de la question :", error);
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
