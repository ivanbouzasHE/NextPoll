<template>
  <div class="polls container fluid">         
    <b-row>
      <b-col cols="12">
        <h2>Vos sondages</h2><hr>
      </b-col>
    </b-row> 
    <div v-if="Object.keys(server.data.polls).length === 0">
      <b-row>
        <b-col>
          <div class="poll">
            Vous n'avez aucun sondage<br>
          </div>
        </b-col>
      </b-row>
      <b-row align-v="center" align-h="center">
        <b-col sm="4"> <b-button variant="success" to="/question"><icon name="question-circle"></icon> Créer une question</b-button></b-col>
        <b-col sm="4"><b-button variant="success" to="/createPoll"><icon name="list-ul"></icon> Créer un sondage</b-button></b-col>           
      </b-row>      
    </div> 
    <div v-if="Object.keys(server.data.polls).length > 0"> 
      <b-row >        
        <b-col sm="6" cols="12"> 
          <b-button-group>
            <b-button v-bind:class="[tri === 'name' ? 'disabled' : '']" variant="success" @click="sortName"><icon name="sort-down"></icon> Par nom</b-button>
            <b-button v-bind:class="[tri === 'dateDesc' ? 'disabled' : '']" variant="success" @click="sortDateDesc"><icon name="sort-up"></icon> Plus récent</b-button> 
            <b-button v-bind:class="[tri === 'dateAsc' ? 'disabled' : '']" variant="success" @click="sortDateAsc"><icon name="sort-down"></icon> Plus ancien</b-button>
          </b-button-group>
        </b-col>           
      </b-row>  
    
    <b-row class="poll" align-v="center" align-h="center" v-for="(poll, index) in server.data.polls" :key="index">  
      <b-col sm="6">
        <div v-bind:id="poll.id" >
          {{poll.name}}          
        </div>        
      </b-col>
      <b-col cols="12" sm="6"> 
        <b-button-group>
          <b-button variant="info" @click="editPoll(poll)"><icon name="edit" ></icon> Modifier</b-button>     
          <b-button variant="info" @click="launchPoll(poll)"><icon name="rocket" ></icon> Lancer</b-button>
          <b-button variant="danger" @click="deletePoll(poll)"><icon name="trash"></icon> Supprimer</b-button>
        </b-button-group>
      </b-col>
    </b-row>    
    </div>
  </div>
</template>

<script>
export default {
  name: "polls",
  data() {
    return {
      server: this.$com.server,
      tri: "dateDesc"
    };
  },
  mounted() {
    this.$com.popup.type = "info";
    this.$com.popup.message = "Un instant";
    this.$com.popup.onOpen = () => {
      this.$swal.showLoading();
    };
    this.$com.popup.time = 1500;
    this.$com.popup.new = !this.$com.popup.new;

    let interval = setInterval(() => {
      if (this.$com.online) {
        this.$com.getPolls();
        clearInterval(interval);
        this.$com.popup.onOpen = () => {};
      }
      this.$com.popup.same = !this.$com.popup.same;
    }, 1000);
  },
  methods: {
    deletePoll(poll) {
      this.$swal({
        title: "Êtes-vous sûr de vouloir supprimer ce sondage ?",
        type: "warning",
        text: poll.name,
        showCancelButton: true,
        confirmButtonColor: "#17a2b8",
        cancelButtonColor: "#dc3545",
        confirmButtonText: "Oui",
        cancelButtonText: "Annuler"
      }).then(result => {
        if (result.value) {
          this.$com.deletePoll(poll.id);
        }
      });
    },
    sortName() {
      this.server.data.polls.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      this.tri = "name";
    },
    sortDateAsc() {
      this.server.data.polls.sort((a, b) => {
        if (a.created_at < b.created_at) return -1;
        if (a.created_at > b.created_at) return 1;
        return 0;
      });
      this.tri = "dateAsc";
    },
    sortDateDesc() {
      this.server.data.polls.sort((a, b) => {
        if (a.created_at < b.created_at) return 1;
        if (a.created_at > b.created_at) return -1;
        return 0;
      });
      this.tri = "dateDesc";
    }
  }
};
</script>

<style lang="less" scoped>
.poll {
  font-size: 20px;
}
.poll:hover {
  color: #28a745;
}
</style>
