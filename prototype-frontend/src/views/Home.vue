<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

const router = useRouter()

const infos = ref<{ room?: string, user?: string }>({})

const schema = z.object({
  room: z.string().nonempty("Le code du quiz est requis"),
  user: z.string().nonempty("Votre nom est requis"),
})

type Schema = z.output<typeof schema>

const state = ref<Schema>({ room: '', user: '' })

const handleCTA = () => {
  const username = localStorage.getItem('username');
  if (username) {
    router.push('/my-quizs'); // Redirige vers la page quizs si connecté
  } else {
    router.push('/connexion'); // Sinon, vers la page de connexion
  }
};

const handleQuiz = () => {
  router.push('/join'); // Sinon, vers la page de connexion
};
</script>

<template>
  <div>
    <main class="main-content">
      <section class="hero">
          <img src="/assets/panda.png" alt="Panda" class="hero-image" />
          <div class="hero-text">
            <h1>
              Du <span class="highlight">fun</span>, des <span class="highlight">questions</span>, et un max de <span class="highlight">challenges</span> !
            </h1>
            <p>Apprenez en vous amusant avec nos quiz interactifs.</p>
          </div>
      </section>

      <section class="challenge-section">
        <div class="challenge-content">
          <p class="challenge-text">Rejoignez ou organisez un QWIZ !</p>
          <p class="challenge-subtext">Il suffit de scanner un QR code pour rejoindre une session.</p>
        </div>
        <img src="/assets/ranking.jpeg" alt="QR Code" class="challenge-image" />
      </section>

      <section class="qr-section">
        <div class="qr-content">
          <p class="qr-text">Rejoignez ou organisez un QWIZ !</p>
          <p class="qr-subtext">Il suffit de scanner un QR code pour rejoindre une session.</p>
        </div>
        <img src="/assets/result.png" alt="QR Code" class="qr-image" />
      </section>

      

      <section class="cta-section">
        <button class="cta-button" @click="handleCTA">
          Créer un Qwiz
        </button>
        <button class="cta-button" @click="handleQuiz">Rejoindre un Qwiz</button>
      </section>
  

    </main>

    <footer class="footer">
      <p class="footer-text">QWIZS &copy; 2025</p>
    </footer>
  </div>


</template>

<style scoped>

body {
  margin: 0;
  background-color: white;
  color: #333;
  line-height: 1.5;
}

.main-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 7rem 4rem 0 4rem;
  gap: 5rem;
}

.hero {
  background-color: #F2EAFE;
  display: flex;
  justify-content: center;
  gap: 2rem;
  align-items: center;
  padding: 4rem;
  width: 100%;
  border-radius: 1.5rem;
}

.hero-image {
  width: 15rem;
}

.hero-text {
  display: flex;
  flex-direction: column;
  width: 70ch;
}

.hero h1 {
  font-size: 2.5rem;
  font-weight: bold;
  text-align: left;
  color: #C46FC8;
}

.hero h1 .highlight {
  color: #86218B;
}

.hero p {
  font-size: 1.25rem;
  color: #666;
  text-align: left;
}

.challenge-section, .qr-section {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 4rem;
}

.challenge-section{
  flex-direction: row-reverse;
}

.challenge-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: left;
}

.challenge-image, .qr-image {
  width: 90%;
  max-width: 500px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.challenge-text, .qr-text  {
  font-size: 1.5rem;
  font-weight: 700;
  width: 100%;
  color: black;
}

.qr-content {
  margin-bottom: 20px;
}

.challenge-subtext, .qr-subtext {
  font-size: 1.2rem;
  max-width: 40ch;
  color: #777;
}

.cta-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  justify-content: center;
  gap: 2rem;
  padding: 5rem;
}

.cta-button {
  background-color: #C46FC8;
  color: #fff;
  border: none;
  padding: 15px 40px;
  font-size: 1.2rem;
  font-weight: 600;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.cta-button:hover {
  background-color: #86218B;
  transform: translateY(-3px);
}

.footer {
  color: black;
  padding: 3rem;
  text-align: center;
}

.footer-text {
  margin: 0;
  font-size: 1rem;
  font-weight: bold;
}


.confirm {
  background: #C46FC8;
  color: white;
}

.cancel {
  background: #ccc;
}
</style>