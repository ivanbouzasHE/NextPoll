<template>
  <div class="session container fluid"> 
    <b-row align-h="center">
      <b-col cols="12" sm="4">
        <h3>Code d'accès : </h3>          
      </b-col>
      <b-col sm="2">
        <h3><div v-bind:class="{ fullCode: fullCode }" @click="toggleCode">{{server.data.room.accessCode}}</div></h3>
      </b-col>
      <b-col sm="1">
        <b-button @click="toggleCode" ><icon name="expand"></icon></b-button>     
      </b-col>
    </b-row>
    <hr>         
    <component v-if="Object.keys(server.data.session).length > 0" id="q-d-" v-bind:is="'Q-D-' + server.data.session.poll.questions[server.data.session.state].questionType"></component>                    
  </div>
</template>

<script>
import QDON from "@/components/Q-D-ON";

export default {
  name: "session",
  components: {
    QDON
  },
  data() {
    return {
      server: this.$com.server,
      fullCode: false,
      questionToggle: false
    };
  },
  methods: {
    toggleCode() {
      this.fullCode = !this.fullCode;
    },
    btnQuestionToggle() {
      this.questionToggle = !this.questionToggle;
    }
  }
};
</script>

<style lang="less" scoped>
.fullCode {
  z-index: 9999;
  font-size: 20vw;
  width: 100vw;
  height: 150vh;
  position: fixed;
  margin-top: -40vh;
  left: 0;
  padding-top: 50vh;
  background-color: white;
}
</style>
