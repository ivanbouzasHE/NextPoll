<template>
  <div id="app">
    <Nav/>              
    <router-view/>    
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from "@/components/Nav.vue";

export default {
  name: "app",
  components: {
    Nav
  },
  data() {
    return {
      popup: this.$com.popup,
      route: this.$com.route
    };
  },
  watch: {
    "popup.new": {
      handler() {
        this.$swal({
          position: "center",
          type: this.popup.type,
          title: this.popup.message,
          showConfirmButton: false,
          timer: this.popup.time,
          onOpen: () => {
            this.popup.onOpen();
          }
        });
      }
    },
    "popup.same": {
      handler() {
        if (this.$swal.getTitle() !== null) {
          this.$swal.getTitle().textContent = this.popup.message;
        }
      }
    },
    "route.path": {
      handler() {
        this.$router.push(this.route.path);
        this.route.path = "";
      }
    }
  }
};
</script>

<style lang="less">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
.fa-icon {
  width: auto;
  height: 12px; /* or any other relative font sizes */
  /* You would have to include the following two lines to make this work in Safari */
  max-width: 100%;
  max-height: 100%;
  min-width: 15px;
}
.row {
  margin: 12px 0px 6px 0px;
}
.container {
  min-width: 250px;
}
</style>
