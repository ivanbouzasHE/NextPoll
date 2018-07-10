/**
 * Communication module, uses Primus library http://primus.io
 * Library must be in node_modules/primus
 * Compiled from server primus.save()
 */
import Primus from "../../node_modules/primus/primus";
import uuid4 from "uuid/v4";

// Server address
const url =
  "http://" +
  process.env.VUE_APP_SERVER_ADDRESS +
  ":" +
  process.env.VUE_APP_SERVER_PORT;

// Starts websocket
let primus = Primus.connect(
  url,
  {
    strategy: ["online", "timeout", "disconnect"],
    reconnect: {
      max: Infinity, // Number: The max delay before we try to reconnect.
      min: 1000, // Number: The minimum delay before we try reconnect.
      retries: 4 // Number: How many times we should try to reconnect.
    }
  }
);

let user = {
  uuid: localStorage.getItem("user_id")
};
// anonymous user creation
if (user.uuid === null) {
  user.uuid = uuid4();
  localStorage.setItem("user_id", user.uuid);
}

/**
 * Primus methods on events
 */

/**
 * When receiving data from the server
 */
primus.on("data", function(d) {
  const action = d.a;
  const data = d.v;

  if (action === "error") {
    com.popup.type = "error";
    com.popup.message = data.message || "Veuillez réessayer";
    com.popup.new = !com.popup.new;
  }

  if (action === "create_question") {
    com.popup.type = data.type;
    com.popup.message = data.message;
    com.popup.new = !com.popup.new;
  }

  if (action === "delete_poll") {
    com.popup.type = data.type;
    com.popup.message = data.message;
    com.popup.new = !com.popup.new;
    com.server.data.polls.splice(
      com.server.data.polls.findIndex(x => x.id === data.pollId),
      1
    );
  }

  if (action === "polls") {
    com.server.data.polls = data.polls.reverse();
  }

  if (action === "rooms") {
    com.server.data.rooms = data.rooms;
  }

  if (action === "sessions") {
    com.server.data.sessions = data.sessions;
  }

  if (action === "launch_poll") {
    com.server.data.session = data.room.session;
    com.server.data.room = data.room;
    setTimeout(() => {
      com.popup.type = data.type;
      com.popup.message = data.message;
      com.popup.new = !com.popup.new;
      com.route.path = "session";
    }, 2000);
  }

  if (action === "room_joined") {
    com.popup.type = data.type;
    com.popup.message = data.message;
    com.popup.new = !com.popup.new;
    com.server.data.room = data.room;
  }

  if (action === "room_left") {
    com.popup.type = data.type;
    com.popup.message = data.message;
    com.popup.new = !com.popup.new;
    com.server.data.room = {};
    com.server.data.session = { currentQuestion: {} };
  }

  if (action === "load_question") {
    com.server.data.session.currentQuestion = data.currentQuestion;
  }

  if (action === "voted") {
    com.popup.type = data.type;
    com.popup.message = data.message;
    com.popup.new = !com.popup.new;
  }

  if (action === "vote_received") {
    com.server.data.session = data.session;
  }
});

/**
 * When the connection with the server is established
 */
primus.on("open", function() {
  com.online = true;
  primus.write({
    a: "init",
    v: {
      uuid: user.uuid,
      room: com.server.data.room,
      session: com.server.data.session
    }
  });
});

/**
 * When an error occurs in primus
 */
primus.on("error", function error() {
  com.popup.type = "error";
  com.popup.message = "Une erreur est survenue";
  com.popup.new = !com.popup.new;
});

/**
 * When a reconnection is scheduled but no yet executed
 */
primus.on("reconnect scheduled", function(opts) {
  com.online = false;
  if (opts.scheduled < 1500) {
    return;
  }
  com.popup.type = "info";
  com.popup.message = "Reconnexion dans "
    .concat(Math.round(opts.scheduled / 1000))
    .concat(" s");
  com.popup.time = 999999;
  com.popup.new = !com.popup.new;
  let time = Math.round(opts.scheduled / 1000);
  let intervalID = setInterval(() => {
    time--;
    com.popup.message = "Reconnexion dans ".concat(time).concat(" s");
    com.popup.same = !com.popup.same;
    if (time === 1) {
      clearInterval(intervalID);
    }
  }, 1000);
});

/**
 * When launching a reconnection
 */
primus.on("reconnect", function() {
  com.popup.message = "Tentative de reconnexion";
  com.popup.same = !com.popup.same;
});

/**
 * When the client is reconnected to the server
 */
primus.on("reconnected", function() {
  com.popup.type = "success";
  com.popup.message = "Vous êtes connecté";
  com.popup.time = 2000;
  com.popup.new = !com.popup.new;
});

/**
 * When primus stops trying to reconnect to the server
 */
primus.on("reconnect failed", function() {
  com.popup.type = "error";
  com.popup.message =
    "Impossible de se connecter au serveur, veuillez vérifier votre connexion internet et rafraichir la page";
  com.popup.time = 999999;
  com.popup.new = !com.popup.new;
});

/**
 * When server explicitly ends the connection
 */
primus.on("end", function() {
  com.online = false;
});

/**
 * User triggered methods from within components
 */
let com = {
  /**
   * Propertie used to trigger a popup in the app with SweetAlert2
   * Changing propertie 'new' triggers a popup in App.vue
   * Changing propertie 'same' triggers an update of the popup if already displayed
   */
  popup: {
    type: "",
    message: "",
    time: 2000,
    new: false,
    same: false,
    onOpen: () => {}
  },
  // Keeping track of connection status with the server
  online: false,
  // Data received from server async (primus), to update by ref
  server: {
    data: {
      polls: {},
      rooms: {},
      room: {},
      session: { currentQuestion: {} },
      sessions: {}
    }
  },
  // To trigger page redirections from server event
  route: { path: "" },
  /**
   * Creates a Question object and sends it to the server for save
   * @param data
   */
  createQuestion(data) {
    if (!this.popOnline()) {
      return;
    }
    try {
      let question = {
        index: 0,
        content: data.title,
        answers: data.answers,
        questionType: data.type
      };
      question.answers.forEach((answer, index) => {
        answer.index = index;
      });
      let poll = {
        name: data.title,
        user: localStorage.getItem("user_id"),
        question: question
      };
      primus.write({
        a: "create_question",
        v: { poll: poll, launch: data.launch || false }
      });
    } catch (err) {
      this.popup.type = "error";
      this.popup.message = "Un problème est survenu, veuillez reéssayer";
    }
  },
  // Triggers popup if user is not connected to the server
  popOnline() {
    if (!this.online) {
      com.popup.new = !com.popup.new;
    }
    return this.online;
  },
  getPolls() {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "getPolls" });
  },
  deletePoll(pollId) {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "delete_poll", v: { pollId: pollId } });
  },
  getRooms() {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "getRooms" });
  },
  joinRoom(roomName) {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "join_room", v: { roomName: roomName } });
  },
  leaveRoom() {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "leave_room", v: { room: this.server.data.room } });
  },
  sendResponse(answerIndex) {
    if (!this.popOnline()) {
      return;
    }
    primus.write({
      a: "voting",
      v: { roomName: this.server.data.room.accessCode, vote: answerIndex }
    });
  },
  getSessions() {
    if (!this.popOnline()) {
      return;
    }
    primus.write({ a: "getSessions" });
  },
  rejoinSession(session) {
    if (!this.popOnline()) {
      return;
    }
    primus.write({
      a: "rejoin_session",
      v: { session: session }
    });
  }
};

// This is your plugin object. It can be exported to be used anywhere.
const Com = {
  // The install method is all that needs to exist on the plugin object.
  // It takes the global Vue object as well as user-defined options.
  install(Vue) {
    Vue.prototype.$com = com;
  }
};

export default Com;
