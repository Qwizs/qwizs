<template>
  <Navbar>
    <router-view />
  </Navbar>
</template>


<script setup>
import Navbar from './layouts/Navbar.vue';
</script>

<style>
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Gabarito";
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fond sombre et opaque */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Assure que l'overlay soit au-dessus du contenu */
  backdrop-filter: blur(5px); /* Applique un flou sur l'arrière-plan */
}


.modal {
  background: #fff;
  padding: 2rem;
  text-align: center;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal h2 {
  font-size: 2rem;
  font-weight: bold; 
  color: #6C546C;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
  gap: .5rem;
  
}



.btn-primary, .btn-secondary {
  width: 100%;
  padding: .75rem 2rem;
  border: none;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
}

.btn-primary {
  background: #C46FC8;
  color: white;

  &.delete{
    background: #EA696C;
  }
}

.btn-secondary {
  background: #ccc;
  color: black;
}

.btn-primary:hover {
  background: #86218B;

  &.delete{
    background: #d13b3d;
  }
}

.btn-secondary:hover {
  background: #bbb;
}

.type-select {
  width: 8rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  border: .1rem solid #ccc;
  font-size: 1rem;
  color: #333;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%236c63ff' d='M5 8l5 5 5-5z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 1rem center;
  background-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
}

label {
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 0.5rem;
}
.input {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  border: 0.1rem solid #ccc;
  border-radius: 0.5rem;
  color: #000000;
  outline: none;
  font-family: "Gabarito";

  &:hover,
  &:active,
  &:focus {
    border-color: #c46fc8;
  }
}

.errorMessage {
    color: red;
    font-size: .9rem;
  }

</style>
