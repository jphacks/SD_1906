<template>
  <div id="app">
    <router-view/>
    <header>
        <ul id="nav">
          <li><router-link to="/">Home</router-link></li>
          <!-- <li><router-link to="/about">About</router-link></li> -->
          <li><router-link to="/daily">Daily</router-link></li>
          <li><router-link to="/lifespan">Lifespan</router-link></li>
        </ul>
    </header>
<!--    <img alt="Vue logo" src="./assets/logo.png">-->
<!--    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>-->
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import HelloWorld from './components/HelloWorld.vue';

@Component({
  components: {
    HelloWorld,
  },
})
export default class App extends Vue {}
</script>

<style>
body {
  margin:0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  padding-bottom: 8%;
}

#nav {
  list-style: none;
  position: fixed;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  padding: 0;
  margin: 0;
}
 
#nav li {
  width: 34%;
  text-align: center;
  background-color: #fff;
  border: solid 1px #2c3e50;
  height: 5%;
  line-height: 50px;
}
 
#nav li a {
  display: block;
  width: 100%;
  text-decoration: none;
  color: #41B883;
  font-weight: bold;
  padding: 0px;
}

#nav li:hover {
  background-color: #41B883;
}

#nav li a:hover {
  color: #fff;
}

</style>
