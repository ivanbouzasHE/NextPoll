<template>
  <div class="room container fluid">       
    <b-row align-h="center" v-if="Object.keys(server.data.room).length > 0">
      <b-col cols="12" sm="4" >
        <h4>Vous êtes dans la salle : <strong>{{server.data.room.accessCode}}</strong></h4>               
      </b-col>  
      <b-col sm="4">
        <b-button  variant="info" @click="leaveRoom">
          <icon name="angle-right"></icon>
          Quitter la salle
        </b-button> 
      </b-col>   
    </b-row> 
    <b-row v-if="Object.keys(server.data.room).length === 0">       
      <b-col >
        <b-button variant="info" @click="joinRoom">
          <icon name="angle-right"></icon>
          Rejoindre une salle
        </b-button>        
      </b-col>
    </b-row> 
    <hr>                  
    <component v-if="Object.keys(server.data.session.currentQuestion).length > 0" id="q-r-" v-bind:is="'Q-R-' + server.data.session.currentQuestion.questionType"></component>            
  </div>
</template>                                                                         

<script>
import QRON from "@/components/Q-R-ON";

export default {
  name: "room",
  components: {
    QRON
  },
  data() {
    return {
      server: this.$com.server
    };
  },
  mounted() {
    if (Object.keys(this.server.data.room).length === 0) {
      this.joinRoom();
    }
  },
  methods: {
    leaveRoom() {
      this.$com.leaveRoom();
    },
    joinRoom() {
      this.showPopUpJoinRoom().then(o => {
        if (o.value) {
          this.$com.joinRoom(o.value);
        }
      });
    },
    showPopUpJoinRoom() {
      return this.$swal({
        title: "Code d'accès",
        input: "text",
        inputPlaceholder: "Entrer le code d'accès",
        inputValidator: value => {
          return !value && "Entrez un code !";
        }
      });
    }
  }
};
</script>
