<template>
  <div class="modal-overlay" v-if="currentQuiz">
    <div class="modal delete-quiz-modal">
      <h2>Supprimer Qwiz</h2>

      <section class="new-question-content">

        <p>Confirmez-vous la suppression du qwiz : <strong>{{ currentQuiz.name }}</strong></p>
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

interface Quiz {
  idQuiz: number;
  name: string;
  idCategory: number;
  idAdministrator: number;
}
const props = defineProps<{
  data: {
    currentQuiz: Quiz;
  };
}>();

const emit = defineEmits(["close", "refresh"]);

const { data } = toRefs(props);
const currentQuiz = ref(data.value.currentQuiz);

const submitForm = async () => {
    try {
      const response = await axios.delete(`/quiz/${currentQuiz.value.idQuiz}`);
      
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
