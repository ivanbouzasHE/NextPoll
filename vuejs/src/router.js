import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import HQuestion from "./views/H-Question.vue";
import Polls from "./views/Polls.vue";
import Room from "./views/Room.vue";
import Session from "./views/Session.vue";
import Sessions from "./views/Sessions.vue";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: "NextPoll - Home"
      }
    },
    {
      path: "/question",
      name: "question",
      component: HQuestion,
      meta: {
        title: "NextPoll - Question"
      }
    },
    {
      path: "/polls",
      name: "polls",
      component: Polls,
      meta: {
        title: "NextPoll - Sondages"
      }
    },
    {
      path: "/room",
      name: "room",
      component: Room,
      meta: {
        title: "NextPoll - Room"
      }
    },
    {
      path: "/session",
      name: "session",
      component: Session,
      meta: {
        title: "NextPoll - Session"
      }
    },
    {
      path: "/sessions",
      name: "sessions",
      component: Sessions,
      meta: {
        title: "NextPoll - Sessions"
      }
    }
  ]
});
