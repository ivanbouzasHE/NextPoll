<template>
  <div id="nav">
    <b-navbar toggleable="md" type="light">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav >
          <b-nav-item> <router-link to="/">Home</router-link></b-nav-item>
          <b-nav-item ><router-link to="/question">Question</router-link></b-nav-item>
          <b-nav-item ><router-link to="/polls">Polls</router-link></b-nav-item>
          <b-nav-item ><router-link to="/room">Salle</router-link></b-nav-item>
          <b-nav-item ><router-link to="/sessions">Sessions</router-link></b-nav-item>
        </b-navbar-nav>
      </b-collapse> 
    </b-navbar>       
  </div>
</template>

<script>
export default {
  name: "Nav"
};
</script>
