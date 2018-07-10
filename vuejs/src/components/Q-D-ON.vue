<template>
  <div id="q-d-on"> 
    <b-row align-v="center" align-h="center">
      <b-col>
        <h2>{{server.data.session.poll.questions[server.data.session.state].content}}</h2>        
      </b-col> 
    </b-row>         
    <b-row v-for="(answer, index) in server.data.session.poll.questions[server.data.session.state].answers" :key="index">
      <b-col cols="12" sm="3">
        <h4>{{answer.content}}</h4>        
      </b-col>
      <b-col cols="10" sm="7">
        <b-progress :value="answer.votesCount !== undefined ? answer.votesCount : 0" class="w-100" height="40px" variant="info" :max="server.data.session.poll.questions[server.data.session.state].votersCount" ></b-progress>
      </b-col>
      <b-col cols="2">        
        <h5>{{answer.votesCount !== undefined ? answer.votesCount : 0}}</h5>        
      </b-col>
    </b-row>  
  </div>
</template>

<script>
export default {
  name: "q-d-on",
  data() {
    return {
      server: this.$com.server
    };
  }
};
</script>
