<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import { io } from 'socket.io-client';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import QRCode from 'qrcode';
import axios from '@/axios';

const route = useRoute();
const router = useRouter();

const quizCode = computed(() => route.params.room as string);
const user = computed(() => route.query.user as string | undefined);
const socket = io('https://prototype-backend-typ0.onrender.com/');

const participants = ref<string[]>([]);
const isAdmin = ref<boolean>(false);
const qrCodeUrl = ref('');
const adminId = ref<number | null>(null);
const storedIdAdministrator = ref('');

interface QuizResponse {
  idAdministrator: number;
}

onMounted(async() => {
    
  storedIdAdministrator.value = localStorage.getItem('idAdmin') || '';
  
  try {
    const response = await axios.get(`/administrators/${storedIdAdministrator.value}/quizs`);
    isAdmin.value = response.data.some((link) => link.idAdministrator === Number(storedIdAdministrator.value)) && user.value === localStorage.getItem('username');

  } catch (error) {
    console.error("Impossible de récupérer les administrateurs liés au quiz ", error);
    
  }


  
  socket.emit('joinWaitingRoom', {
      user: user.value,
      quizCode: quizCode.value,
      isOwner: isAdmin.value,
    });
  
  socket.on('currentParticipants', (currentParticipants) => {
    participants.value = currentParticipants;
  });

  socket.on('userJoined', (username) => {
    console.log(participants.value);
    
  if (!participants.value.includes(username)) {
    participants.value.push(username);
  }
});

  socket.on('startQuiz', () => {
    if (!isAdmin.value) {
      router.push(`/quiz/${quizCode.value}/game?user=${user.value}`);

    }
  });

  generateQRCode();
});

onBeforeUnmount(() => {
  socket.disconnect();
});

const startQuiz = () => {
  socket.emit('startQuiz', quizCode.value);
};

const generateQRCode = () => {
  const url = `https://qwizs.wajrock.me/join?code=${quizCode.value}`;
  QRCode.toDataURL(url, (err: any, url: string) => {
    if (err) throw err;
    qrCodeUrl.value = url;
  });
};
</script>

<template>
  <div class="waiting-room">
    <h1>Waiting Room</h1>
    

    <div class="access-section">
      <p class="quiz-code">Code du quiz : <strong>{{ quizCode }}</strong></p>
    
      <img :src="qrCodeUrl" alt="QR Code pour rejoindre" class="qr-img" />
    </div>

    <p class="status">👥 {{ participants.length }} participant(s) connecté(s)</p>

    <div class="participants-section" v-if="participants.length">
      <div class="participants-grid">
        <div class="participant-card" v-for="participant in participants" :key="participant">
          👤 {{ participant }}
        </div>
      </div>
    </div>

    <div class="admin-actions" v-if="isAdmin && participants.length >= 2">
      <button @click="startQuiz" class="start-btn">🚀 Démarrer le quiz</button>
    </div>
  </div>
</template>

<style scoped>
.waiting-room {
  padding-top: 8rem;
  background: #fff;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

h1 {
  font-size: 3rem;
  color: #C46FC8;
  font-weight: bold;
  font-family: "Nerko One", cursive;
}

.quiz-code {
  font-size: 1.5rem;
  color: #444;
  display: flex;
  flex-direction: column;
  text-align: left;

  & strong {
    font-weight: bold;
    font-size: 2rem;
  }
}

.status {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: .5rem;
}

.access-section {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin: 1rem 0 1.5rem 0;
}

.access-section h2 {
  font-size: 1rem;
  margin-bottom: 10px;
  color: #444;
}

.qr-img {
  width: 7rem;
  border: .25rem solid #eee;
  border-radius: .5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.participants-section{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.participants-section h3 {
  color: #C46FC8;
  margin-bottom: 14px;
  font-size: 1rem;
}

.participants-grid {
  display: flex;
  width: 30rem;
  gap: 1rem;
  text-align: center;
  justify-content: center;
}

.participant-card {
  background: #f5f5f5;
  padding: 10px;
  border-radius: 12px;
  text-align: center;
  font-size: 0.95rem;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s ease;
}

.participant-card:hover {
  transform: scale(1.05);
}

.admin-actions {
  margin-top: 24px;
}

.start-btn {
  background-color: #C46FC8;
  color: #fff;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 1.05rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.start-btn:hover {
  background-color: #a850aa;
}
</style>