<template>
  <div id="app" class="page-background">
    <div class="todo-list-main">
      <router-view></router-view>
      <router-view name="PomodoroTimer"> </router-view>
    </div>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

.page-background {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  min-width: 1250px;
  background-color: transparent;
}

.todo-list-main {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  width: 90%;
}
</style>
