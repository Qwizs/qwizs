<template>
  <div>
    <header class="navbar">
      <nav class="navbar-container">
        <router-link class="brand" to="/">
          <img src="/assets/logo-qwizs.png" alt="QWIZS Logo" class="brand-logo" />
        </router-link>

        <ul class="nav-links">
          <li><router-link to="/quizs" class="nav-link" active-class="active">Les Qwizs</router-link></li>
          <li><router-link to="/join" class="nav-link" active-class="active">Rejoindre un Qwiz</router-link></li>
          
          <div v-if="username">
           
          </div>
          
        </ul>

        <div v-if="!username">
          <button class="purple-button" @click="goToConnexion">Se connecter</button>
        </div>


        <div v-if="username" class="user-info" @click="toggleMenu" ref="userInfoRef">
          <img class="user-avatar" src="/assets/panda.png" alt="">
          <span class="user-name">{{username}}</span>

          <div class="user-menu" v-show="isMenuVisible" ref="menuRef">

            <router-link to="/my-quizs" class="menu-item">Mes Qwizs</router-link>
            <router-link to="/profile" class="menu-item">Modifier le profil</router-link>
            <router-link to="/profile" class="menu-item" @click="logout">Se déconnecter</router-link>
            
          </div>
        </div>
      </nav>
    </header>

    <main>
      <slot />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const isMenuVisible = ref(false);
const router = useRouter()


const username = ref("");
onMounted(() => {
  document.addEventListener('click', handleClickOutside)

  username.value = localStorage.getItem('username') || "";
  window.addEventListener("storage", () => {
    username.value = localStorage.getItem('username') || "";
  });
});

const menuRef = ref(null)
const userInfoRef = ref(null)

const goToConnexion = () => {
  router.push('/connexion')
}

const toggleMenu = () => {
  isMenuVisible.value = !isMenuVisible.value;
};

const logout = () => {
  localStorage.removeItem('username')
  localStorage.removeItem('idAdmin')
  username.value = "";
  router.push('/connexion')
};

const handleClickOutside = (event) => {
  const menu = menuRef.value
  const userInfo = userInfoRef.value

  if (
    menu &&
    userInfo &&
    !menu.contains(event.target) &&
    !userInfo.contains(event.target)
  ) {
    isMenuVisible.value = false
  }
}


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style>

@import url('https://fonts.googleapis.com/css2?family=Gabarito:wght@400..900&display=swap');

body {
  background-color: #ffffff; 
  margin: 0;
  font-family: "Gabarito", sans-serif;
}

.purple-button {
  background-color: #C46FC8;
  color: white;
  border: none;
  padding: 10px 20px;
  font-weight: bold;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.purple-button:hover {
  background-color: #a84da9;
}


.navbar {
  background-color: #ffffff;
  padding: 2rem 4rem;
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
}

.navbar-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  height: 2rem;
}

.nav-links {
  display: flex;
  justify-content: center;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 3rem;
}

.nav-links .nav-link {
  text-decoration: none;
  color: #000;
  font-size: 1.2rem;
  font-weight: 600;
}

.nav-links .nav-link.active {
  color: #C46FC8; 
}

.nav-links .nav-link:hover {
  color: #C46FC8;
}

.user-info {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  flex-shrink: 0;
  justify-self: end;
}
.user-avatar {
  width: 2rem;
  border-radius: 50%;
}

.user-info .user-name {
  font-size: 1.25rem;
  font-weight: bold;
  color: #C46FC8;
}

.user-menu {
  position: absolute;
  top: 50px; 
  right: 0;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.15);
  padding: 10px 0;
  min-width: 220px;
  z-index: 1000;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.menu-item {
  display: block;
  padding: 12px 18px;
  text-align: left;
  font-size: 1rem;
  font-weight: 500;
  color: #4A4A4A;
  text-decoration: none;
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(134, 33, 139, 0.1);
  color: #C46FC8;
}

@media (max-width: 1024px) {
  .navbar-container {
    flex-direction: row;
    justify-content: space-between;
    padding: 10px 15px;
  }

  .nav-links {
    gap: 15px;
  }

  .user-info {
    gap: 5px;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 10px 15px;
  }

  .navbar-container {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .nav-links {
    gap: 10px;
  }

  .user-info {
    margin-top: 10px;
  }

  .user-info .user-name {
    display: none; 
  }
}
</style>
