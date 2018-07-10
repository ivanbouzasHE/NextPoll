<template>
  <div id="q-r-on">  
        <b-row align-v="center" align-h="center">
      <b-col>
        <h2>{{server.data.session.currentQuestion.content}}</h2>        
      </b-col> 
    </b-row>        
    <b-row>
      <b-col>
        <b-form-group>
          <b-form-radio-group v-model="vote"
                              :options="answers"
                              name="radioInline">
          </b-form-radio-group>
        </b-form-group>
      </b-col>      
    </b-row>  
    <b-row>
      <b-col>
        <b-button variant="info" @click="sendResponse">
          <icon name="check-circle"></icon>
          Envoyer
        </b-button>
      </b-col>
    </b-row>     
  </div>
</template>

<script>
export default {
  name: "q-r-on",
  data() {
    return {
      server: this.$com.server,
      vote: ""
    };
  },
  computed: {
    answers() {
      return this.server.data.session.currentQuestion.answers.map(element => {
        return {
          text: element.content,
          value: element.index
        };
      });
    }
  },
  methods: {
    sendResponse() {
      if (this.vote === "") {
        this.$swal({
          type: "error",
          title: "Vous devez selectionner une réponse"
        });
      } else {
        this.$com.sendResponse(this.vote);
      }
    }
  }
};
</script>
