<template>
  <div id="q-t-ouinon">         
    <b-row align-v="center" align-h="center" v-for="(answer, index) in answers" :key="index" v-if="index !== 2">
      <b-col cols="3">
        <strong>{{answer.content}}</strong>
      </b-col>
      <b-col sm="3">
        <b-button v-bind:class="{ 'btn-success': answer.correct }"  v-bind:id="'checkboxAnswer'+index" title="Choisir cette réponse comme étant correct" @click="checkChange(index)">           
          <div >
              <i><strong>Réponse correct </strong></i>
            <icon v-if="answer.correct" name="check"></icon>  
            <icon v-if="!answer.correct" name="times"></icon>                            
          </div>                                                                                                                             
        </b-button>  
      </b-col>      
    </b-row>    
  </div>
</template>

<script>
export default {
  name: "q-t-ouinon",
  data() {
    return {
      answers: [
        { content: "Oui", correct: false },
        { content: "Non", correct: false },
        { content: "Je ne sais pas", correct: false }
      ]
    };
  },
  activated() {
    this.$emit("interface", this.answers);
  },
  methods: {
    checkChange(index) {
      this.answers[index].correct = !this.answers[index].correct;
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  height: 150px;
}
</style>
