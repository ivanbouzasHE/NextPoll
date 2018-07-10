# Travail de Bachelor - Poll – Intégration et Industrialisation de solution de vote/sondage
## Auteur
Ivan Bouzas, étudiant en 3ème année de Bachelor, dans la filière "Informatique de gestion", à la Haute École de Gestion ARC de Neuchâtel, Suisse.
## Description
Ce répertoire héberge les sources du système implémenté pour ce travail. Il vient en complément d'un rapport final rendu le 11 juillet 2018.
## Résumé de la thèse
Lors d'une conférence en Suisse, la quasi-totalité des participants a un smartphone. Si les clickers/zappettes ont été utilisés pendant longtemps pour interagir avec son public, on peut aujourd’hui se tourner vers le Web. Les smartphones permettent de proposer des fonctionnalités qui étaient jusqu’alors trop complexes à mettre en place et de réduire les coûts d'une telle installation. Des solutions existent déjà depuis quelques années pour sonder son audience. Avec cette abondance de solutions, la problématique est maintenant de savoir quels sont les réels besoins des utilisateurs ? Ce qui existe actuellement suffit-il ? Manque-t-il une fonctionnalité essentielle sur le marché ? Est-ce que toutes les fonctionnalités sont vraiment utiles ou simplement du marketing ? Existe-t-il une application qui couvre complètement les besoins actuels des utilisateurs ?

Dans le but d’avoir une meilleure vision des fonctionnalités proposées actuellement, nous avons d’abord entrepris de réaliser une exploration des solutions existantes sur le marché et de les comparer pour en faire ressortir les éléments récurrents. S’en suit une étude transversale pour analyser les besoins des utilisateurs, notamment des enseignants. Combiner avec l’exploration des solutions, cette dernière permet de répondre aux questions de la problématique et de continuer par la création d’une application qui couvre ces besoins. Les différentes fonctionnalités de l’application sont réalisées par priorité de selon l’intérêt manifesté, par les enseignants. 

Il est ressorti du questionnaire que certaines fonctionnalités, mises en avant par plusieurs entreprises, ne sont pas forcément considérées comme intéressantes. Selon le degré d’intérêt exprimé pour chaque fonctionnalité, nous avons pu créer une liste qui ordonne celles-ci en commençant par les plus importantes/intéressantes. Beaucoup de sondés ont soulevé des problèmes de connexion et un temps de préparation trop long. Notre application essaye de corriger ces points en alignant une interface simple et épurée, une seule et même application pour le présentateur et le public et de renseigner le plus possible l’utilisateur sur l’état du réseau.

Ce projet pose les bases d’une application de sondage, open source, qui correspond aux attentes des enseignants. Le document contient tout le nécessaire pour d’ores et déjà continuer le projet. Les fonctionnalités étant nombreuses, il convient peut-être de refaire une étude plus étendue, une fois que l’application sera déployée et testée.

## Contenu
Le répertoire contient une application client Vue.js dans le dossier **vuejs** et une application server Node.js dans **server**.
## Démarrage
Pour utiliser l'application, pour le moment, il faut avoir installer 3 choses sur son ordinateur : 
- Node
- Vue CLI
- PostgreSQL

Lancer un invite de commande sur chaque dossier et entrer la commande **npm install**

Ensuite, 

- Créer l'arborescence **dist/lib** dans **server**

- Sur le dossier **server** entrer la commande **nodemon**

- Dans le dossier **dist/lib** de **server**, il faut prendre le fichier **primus.js** et le mettre dans le dossier **vuejs/node_modules/primus**, le dossier primus est à créer

- Sur le dossier **vuejs** entrer la commande **npm run serve** 

L'application cliente est normalement atteignable sur http://localhost.com:8080/

Pour son fonctionnement, elles nécessitent chacune un fichier d'environnement **.env** qui contient des variables globales.
Veuillez consulter ces fichiers et modifier les variables pour qu'elles correspondent à votre environnement. 
Ces fichiers ne devraient normalement pas être versionné avec git, car ils contiennent des informations sensibles, comme des mots de passe.
Ils sont mis ici pour faciliter la reprise et surtout parcequ'ils ne contiennent pas pour l'instant de données sensibles. Toutes les valeurs sont génériques.
