<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const router = useRouter()

const schema = z.object({
  room: z.string().nonempty("Le code du quiz est requis"),
  user: z.string().nonempty("Votre nom est requis"),
})

type Schema = z.output<typeof schema>
const state = ref<Schema>({ room: '', user: '' })

const onSubmit = (event: FormSubmitEvent<Schema>) => {
  event.preventDefault()
  router.push(`/quiz/${state.value.room}/waiting?user=${state.value.user}`)
}
</script>

<template>
  <div class="join-page">
    <div class="card">
      <img src="/assets/panda.png" alt="Mascotte Qwizs" class="mascot" />
      <h1 class="title">Rejoindre un Quiz</h1>

      <div :schema="schema" :state="state" class="form" >
        <input v-model="state.user" placeholder="Nom du Joueur" class="input" />

        <input v-model="state.room" placeholder="Code du Quiz" class="input" />

        <div class="form-actions">
          <button type="submit" class="form-button confirm" @click="onSubmit">Rejoindre</button>
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped>
*{
    font-family: 'Gabarito';
}
.join-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: white;
  padding: 20px;
  font-family: 'Poppins', sans-serif;
}

.card {
  background: white;
  padding: 40px 30px;
  border-radius: 25px;
  text-align: center;
  width: 100%;
  max-width: 400px;
  display: flex;
    flex-direction: column;
    align-items: center;
}

.mascot {
  width: 5rem;
  margin-bottom: 1.5rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

.title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #c46fc8;
  margin-bottom: 30px;
  
}

.input {
  width: 100%;
  padding: .75rem;
  font-size: 1rem;
  border: .1rem solid #ccc;
  border-radius: .5rem;
  margin-bottom: 1rem;
  color: #000000;
}

.form-actions {
  display: flex;
  justify-content: center;
  gap: .5rem;
}

.form-button {
  padding:.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: .5rem;
  cursor: pointer;
  flex: 1;
  transition: background-color 0.3s ease;
}


.form-button.confirm {
  background-color: #c46fc8;
  color: white;
}

.form-button.confirm:hover {
  background-color: #a850aa;
}

.form-button.cancel {
  background-color: #f3f3f3;
  color: #444;
}

.form-button.cancel:hover {
  background-color: #e0e0e0;
}

</style>