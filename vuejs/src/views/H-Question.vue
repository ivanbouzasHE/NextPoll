<template>
  <div class="h-question container fluid">    
      <b-form @submit.prevent="() => {createQuestion();}">
      <b-row>
        <b-col cols="12">
          <h2>Votre Question</h2>
        </b-col>
      </b-row>            
      <b-row>
        <b-col>
          <b-form-input id="iTitle" v-model="question.title"
                  type="text"
                  placeholder="Entrer votre question" required></b-form-input>               
        </b-col>        
      </b-row>      
      <hr>
      <b-row>
        <b-col cols="12">
          <h4>Réponses</h4>
        </b-col>
      </b-row>      
      <transition name="component-fade" mode="out-in">
        <keep-alive>
          <component id="q-t" v-bind:is="currentQuestionType" @interface="updateAnswers" @IMultiple="updateMultiple"></component>
        </keep-alive>
      </transition>                    
      <b-row align-h="center">
        <b-col sm="3">
          <b-button type="submit" variant="info"><icon name="save"></icon> Enregistrer</b-button>
        </b-col>
        <b-col sm="3">
          <b-button type="submit" variant="info" @click.prevent="() => {question.launch = true;createQuestion();}"><icon name="rocket"></icon> Lancer</b-button>
        </b-col>
      </b-row>   
      </b-form>
      <hr>
      <h3>Type de question</h3>  
      <b-row align-h="center">
        <b-col sm="2" v-for="item in types" v-bind:key="item.id">          
           <b-button v-if="currentQuestionType === 'Q-T-' + item" disabled variant="success">{{item}}</b-button>    
           <b-button v-else variant="success" @click="typeChange(item)">{{item}}</b-button>         
        </b-col>
      </b-row>                   
  </div>
</template>

<script>
import QTOuiNon from "@/components/Q-T-OuiNon";
import QTMultiple from "@/components/Q-T-Multiple";
import EQuestionType from "@/models/questionTypes";

export default {
  name: "h-question",
  components: {
    QTOuiNon,
    QTMultiple
  },
  data() {
    return {
      question: {
        title: "",
        type: "ON",
        answers: [],
        isMultiple: false,
        launch: false
      },
      types: ["OuiNon", "Multiple"],
      currentQuestionType: "Q-T-OuiNon",
      validation: true
    };
  },
  methods: {
    typeChange(type) {
      switch (type) {
        case "OuiNon":
          this.question.type = EQuestionType.ON;
          break;
        case "Multiple":
          if (this.isMultiple) {
            this.question.type = EQuestionType.QRM;
          } else {
            this.question.type = EQuestionType.QCM;
          }
          break;
      }
      this.currentQuestionType = "Q-T-" + type;
    },
    createQuestion() {
      for (let i = 0; i < this.question.answers.length; i++) {
        const element = this.question.answers[i];
        if (element.content === "") {
          this.question.answers.splice(i, 1);
        }
      }
      if (this.question.answers.length < 2) {
        this.$swal({
          type: "error",
          title: "Vous devez avoir au moins deux réponses"
        });
        this.question.answers.push({ content: "", correct: false });
      } else {
        this.$com.createQuestion(this.question);
      }
    },
    updateAnswers(event) {
      this.question.answers = event;
    },
    updateMultiple(event) {
      this.question.isMultiple = event;
    }
  }
};
</script>

<style lang="less" scoped>
#q-t {
  min-height: 10em;
}
.component-fade-enter-active,
.component-fade-leave-active {
  transition: opacity 0.3s ease;
}
.component-fade-enter,
.component-fade-leave-to {
  opacity: 0;
}
</style>
