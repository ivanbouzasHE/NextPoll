<template>
  <div class="home container fluid">       
      <b-row>
        <b-col cols="12">
          <h3>
            Bienvenue sur NextPoll
          </h3><br>
          <h4>Votre application de sondage en direct</h4>
        </b-col>        
      </b-row>
      <hr>
      <b-row align-h="center">
        <b-col sm="4" class="mt-3">
            <b-button variant="success" to="/question"><icon name="question-circle"></icon><br> Créer une question</b-button>                      
            Commencez ici pour créer votre question. Vous pouvez ensuite lancer directement une session ou l'enregistrer pour plus tard          
        </b-col>     
        <b-col sm="4" class="mt-3">
            <b-button variant="success" to="/polls"><icon name="list-ul"></icon><br> Polls</b-button>             
            Retrouvez ici tous les sondages/questions que vous avez créés
        </b-col>   
        <b-col sm="4" class="mt-3">
            <b-button variant="success" to="/room"><icon name="users"></icon><br> Rejoindre une salle</b-button>             
        </b-col>   
      </b-row> 
      <hr>
      <b-row>
        <b-col cols="12">          
        </b-col>        
      </b-row> 
  </div>
</template>

<script>
export default {
  name: "home"
};
</script>

<style lang="less" scoped>
.fa-icon {
  width: auto;
  height: 5em; /* or any other relative font sizes */

  /* You would have to include the following two lines to make this work in Safari */
  max-width: 100%;
  max-height: 100%;
}
.btn {
  width: 100%;
  min-width: 100px;
}
</style>
