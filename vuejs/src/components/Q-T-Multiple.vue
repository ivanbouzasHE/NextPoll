<template>
  <div id="q-t-multiple">       
    <draggable v-model="answers"  @start="drag=true" @end="drag=false" :options="{handle :'.handle', animation: 100}">      
      <b-row align-v="center" align-h="center" v-for="(answer, index) in answers" :key="index" v-if="!answer.deleted">        
          <b-col cols="2">            
            <b-button id="btnRemoveResponse" @click="removeResponse(index)" title="Retirer la réponse" variant="danger">
              <icon name="minus"></icon>              
            </b-button>                                
          </b-col>
          <b-col cols="2">
            <b-button class="handle">
              <icon class="handleIcon" name="arrows-v"></icon>              
            </b-button> 
          </b-col>
          <b-col>
            <b-form-input v-bind:id="'content'+index" v-model="answer.content"
                      type="text"
                      placeholder="Entrer une réponse"></b-form-input>                      
          </b-col>      
          <b-col sm="3">     
            <b-button v-bind:class="{ 'btn-success': answer.correct }" v-bind:id="'checkboxAnswer'+index" title="Choisir cette réponse comme étant correct" @click="checkChange(index)">           
              <div>
                  <i><strong>Réponse correct </strong></i>
                            <icon v-if="answer.correct" name="check"></icon>  
            <icon v-if="!answer.correct" name="times"></icon>                              
              </div>                          
                                                                                                   
            </b-button>                      
          </b-col>      
        </b-row>       
    </draggable>       
    <b-row>
      <b-col align-v="center" align-h="center" offset="5" cols="2">
        <b-button id="btnAddResponse" @click="addResponse" title="Ajouter une réponse" variant="success">
          <icon name="plus"></icon>
        </b-button>
      </b-col>      
    </b-row>  
    <b-row>
      <b-col>
        <b-button v-bind:class="{ 'btn-success': isMultiple }" id="checkboxMultiple" @click="checkMultiple">           
              <div>
                  <i><strong>Réponses multiples </strong></i>
                  <icon v-if="isMultiple" name="check"></icon>  
                  <icon v-if="!isMultiple" name="times"></icon>                              
              </div>                          
                                                                                                  
            </b-button>
      </b-col>
    </b-row>  
  </div>
</template>

<script>
export default {
  name: "q-t-multiple",
  data() {
    return {
      answers: [
        { content: "", correct: false },
        { content: "", correct: false }
      ],
      isMultiple: false
    };
  },
  methods: {
    addResponse() {
      this.answers.push({
        content: "",
        correct: false
      });
    },
    removeResponse(index) {
      if (this.answers.length < 3) {
        this.$swal({
          type: "error",
          title: "Vous devez avoir au moins deux réponses"
        });
      } else {
        if (this.answers[index].id !== undefined) {
          Object.defineProperty(this.answers[index], "deleted", {
            value: true
          });
        } else {
          this.answers.splice(index, 1);
        }
      }
    },
    checkChange(index) {
      this.answers[index].correct = !this.answers[index].correct;
    },
    checkMultiple() {
      this.isMultiple = !this.isMultiple;
    }
  },
  activated() {
    this.$emit("interface", this.answers);
  },
  watch: {
    isMultiple: function() {
      this.$emit("IMultiple", this.isMultiple);
    }
  }
};
</script>

<style>
.row:focus {
  color: grey;
}
.btn.handle {
  background: white;
  color: black;
  float: left;
  border-radius: 3px;
}
.btn.handle:hover {
  cursor: all-scroll;
  background: lightgrey;
  color: white;
}
.handleIcon.fa-icon {
  padding: 3px 5px 0px 5px;
  height: 15px;
}
.icon-fade-enter-active,
.icon-fade-leave-active {
  transition: opacity 1.2s ease;
}
.icon-fade-enter,
.icon-fade-leave-to {
  transition: 0s;
  opacity: 0;
}
</style>
