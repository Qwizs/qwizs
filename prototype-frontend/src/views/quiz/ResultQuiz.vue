<script setup lang="ts">
import { useRoute } from "vue-router";
import { onMounted, ref, computed } from "vue";
import confetti from "canvas-confetti";

const route = useRoute();

const score = computed(() => Number(route.query.score));
const user = computed(() => route.query.user as string);

type ScoreMap = { [username: string]: number };

const rawScores = computed<ScoreMap>(
  () => JSON.parse(decodeURIComponent(route.query.scores as string)) as ScoreMap
);

const sortedScores = computed(() =>
  Object.entries(rawScores.value).sort((a, b) => b[1] - a[1])
);

console.log(sortedScores);

const winner = computed(() => sortedScores.value[0]?.[0] === user.value);

const rawHistory = computed(
  () =>
    JSON.parse(decodeURIComponent(route.query.history as string)) as number[]
);

const confettiCanvas = ref<HTMLCanvasElement | null>(null);
const loaded = ref(false);

const audio = new Audio("/sounds/victory.mp3");

onMounted(() => {
  setTimeout(() => {
    loaded.value = true;

    const top3 = sortedScores.value.slice(0, 3).map(([name]) => name);
    if (top3.includes(user.value)) {
      audio.play().catch(() => {
        console.warn("Audio autoplay bloqué");
      });
    }
  }, 300);

  if (confettiCanvas.value) {
    const myConfetti = confetti.create(confettiCanvas.value, {
      resize: true,
      useWorker: true,
    });

    myConfetti({ particleCount: 120, spread: 100, origin: { y: 0.6 } });

    const interval = setInterval(() => {
      myConfetti({
        particleCount: 40,
        angle: 60 + Math.random() * 60,
        spread: 60,
        origin: { y: 0.3 },
      });
    }, 1000);

    setTimeout(() => clearInterval(interval), 6000);
  }
});

const getMedal = (index: number) => {
  return index === 0
    ? '🥇'
    : index === 1
    ? '🥈'
    : index === 2
    ? '🥉'
    : index + 1;
};
</script>

<template>
  <div
    class="container"
  >
        <h1>
          🎉 Quiz terminé !
        </h1>

        <p v-if="winner" class="message">
          🥳 Félicitations {{ user }}, tu as remporté la partie !
        </p>

        <p v-if="!winner" class="message">
            😅  Dommage {{ user }}, tu feras mieux la prochaine fois !
        </p>


        <div class="scoreboard">
          <table class="score-table">
            <tbody>
               <tr v-for="(entry, index) in sortedScores" :key="entry[0]">
                <td :class="[
                      [1].includes(index+1) ? 'podium' : 'not-podium']">
                  {{ getMedal(index) }}
                </td>
                <td>{{ entry[0] }}</td>
                <td>{{ entry[1] }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <router-link
          to="/"
          class="back-btn"
        >
          Retour à l'accueil
        </router-link>

    <canvas
      ref="confettiCanvas"
      class="confetti"
      v-if="user === sortedScores[0][0]"
    ></canvas>
  </div>
</template>

<style scoped>
.scale-110 {
  transform: scale(1.2);
}

.confetti {
  width: 100%;
  z-index: -1;
  top: 8rem;
  position: fixed;
}

.fade-pop-enter-active {
  /* animation: fadePop 0.8s ease-out; */
}
@keyframes fadePop {
  0% {
    opacity: 0;
    transform: scale(0.95);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-bounce {
  /* animation: bounce 1s infinite alternate; */
}
@keyframes bounce {
  from {
    transform: translateY(0px);
  }
  to {
    transform: translateY(-10px);
  }
}

.container {
  padding-top: 10rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.container h1 {
  margin-bottom: 1rem;
  font-size: 3rem;
  font-weight: 600;
  color: #7b2e87;
  text-align: center;
  font-family: "Nerko One", cursive;
}
.message{
  font-size: 1.25rem;
  font-weight: 500;
}
.scoreboard {
  padding: 1.5rem;
  border-radius: 12px;
  text-align: center;
  width: 50vw;
  background-color: #fff;
}



.score-table {
  width: 100%;
  border-collapse: collapse;
}

.score-table th,
.score-table td {
  padding: 12px;
}

.score-table th {
  background-color: #f7e9fc;
  color: #7b2e87;
  font-weight: 600;
}

.score-table td {
  color: #333;
  text-align: center;
  width: 100%;
  padding: 1.5rem 0;
  font-size: 1.15rem;
  font-weight: 500;

  &.podium{
    font-size: 1.75rem
  }

  &.not-podium{
    font-size: 1.5rem
  }
}
.score-table tr {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #e0e0e0;
  &:last-child {
    border-bottom: none;
  }
}

.back-btn {
  background-color: #C46FC8;
  color: #fff;
  border: none;
  padding: 1rem 2rem;
  border-radius: .5rem;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
}
</style>
