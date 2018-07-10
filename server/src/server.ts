/**
 * Server nodejs application
 */

// npm packages
import * as cors from "cors";
import * as dotenv from "dotenv";
import * as express from "express";
import * as http from "http";
import * as Primus from "primus";

// Needs to be before sequelize imports
dotenv.config();

// local imports
import * as db from "./db";
import { logger } from "./logger";
import { Poll } from "./models/Poll";
import { Room } from "./models/Room";
import { Session } from "./models/Session";
import { User } from "./models/User";
import { Vote } from "./models/Vote";

/**
 * 'require' used for now,
 * since it's a plugin for primus,
 * typings are in typings/primus.d.ts
 */
const primusRooms: any = require("primus-rooms");

const app: express.Application = express();

app.use(cors);

const server: http.Server = http.createServer(app);

const primus: Primus.Primus = new Primus(server, { transformer: "engine.io" });

// add rooms extension to Primus
primus.plugin("rooms", primusRooms);

const rooms: { [key: string]: Room } = {};

primus.on("connection", (spark: Primus.ISpark) => {
  let user: User;

  spark.on("data", (d: any) => {
    if (!d) {
      spark.write({ a: "error" });
    } else {
      const action: string = String(d.a);
      const data: any = d.v;

      if (action === "init") {
        user = new User(data.uuid);
        user.save();
        if (
          data.room &&
          data.room.hasOwnProperty("accessCode") &&
          rooms[data.room.accessCode]
        ) {
          spark.join(data.room.accessCode);
        }
      }

      if (!user) {
        spark.write({ a: "error" });

        return;
      }

      switch (action) {
        case "getPolls": {
          user.getPolls().then((dbPolls: any) => {
            spark.write({ a: "polls", v: { polls: dbPolls } });
          });
          break;
        }

        case "getRooms": {
          user.getRooms().then((dbRooms: any) => {
            spark.write({ a: "rooms", v: { rooms: dbRooms } });
          });
          break;
        }

        case "getSessions": {
          user.getSessions().then((dbSessions: any) => {
            spark.write({ a: "sessions", v: { sessions: dbSessions } });
          });
          break;
        }

        case "create_question": {
          const poll: any = new Poll(
            data.poll.name,
            user,
            undefined,
            undefined,
            [data.poll.question]
          );
          poll
            .save()
            .then(() => {
              spark.write({
                a: action,
                v: {
                  type: "success",
                  message: "Question enregistrée"
                }
              });
              // if user launches the question immediately
              if (data.launch) {
                const room: Room = new Room(user);
                room.save().then(() => {
                  const session: Session = new Session(poll, room);
                  session.startSession().then(() => {
                    room.session = session.getData();
                    rooms[room.accessCode] = room;
                    spark.write({
                      a: "launch_poll",
                      v: {
                        type: "info",
                        message: "Session démarrée",
                        room: room
                      }
                    });
                    room.adminSpark = spark.id;
                  });
                });
              }
            })
            .catch((err: any) => {
              spark.write({ a: "error", v: { message: err.message } });
            });
          break;
        }

        case "delete_poll": {
          const poll: Poll = new Poll("", user, data.pollId);
          poll
            .deletePoll()
            .then(() => {
              spark.write({
                a: action,
                v: {
                  type: "success",
                  message: "Sondage supprimé",
                  pollId: poll.id
                }
              });
            })
            .catch((err: any) => {
              spark.write({ a: "error", v: { message: err.message } });
            });
          break;
        }

        case "join_room": {
          if (rooms.hasOwnProperty(data.roomName)) {
            spark.join(rooms[data.roomName].accessCode);
          } else {
            spark.write({
              a: "room_joined",
              v: {
                type: "error",
                message: "Cette salle n'existe pas",
                room: {}
              }
            });
          }
          break;
        }

        case "leave_room": {
          spark.leave(data.room.accessCode, () => {
            spark.write({
              a: "room_left",
              v: {
                type: "info",
                message: "Vous avez quitté la salle",
                room: {}
              }
            });
          });
          break;
        }

        case "voting": {
          if (rooms.hasOwnProperty(data.roomName)) {
            const tempRoom: any = rooms[data.roomName];
            if (tempRoom.session !== undefined) {
              const question: any =
                tempRoom.session.poll.questions[tempRoom.session.state];
              const answer: any = question.answers[data.vote];
              new Vote(user.id, data.vote, tempRoom.session.id, question.id)
                .save()
                .then(() => {
                  if (answer.votesCount === undefined) {
                    answer.votesCount = 1;
                  } else {
                    answer.votesCount++;
                  }
                  if (
                    tempRoom.session.poll.questions[tempRoom.session.state]
                      .votersCount === undefined
                  ) {
                    tempRoom.session.poll.questions[
                      tempRoom.session.state
                    ].votersCount = 1;
                  } else {
                    tempRoom.session.poll.questions[tempRoom.session.state]
                      .votersCount++;
                  }
                  spark.write({
                    a: "voted",
                    v: { type: "success", message: "Vote enregistré" }
                  });
                  const tempSparkId: any = rooms[data.roomName].adminSpark;
                  if (tempSparkId !== undefined) {
                    const adminSpark: Primus.ISpark = primus.spark(tempSparkId);
                    adminSpark.write({
                      a: "vote_received",
                      v: { session: tempRoom.session }
                    });
                  }
                })
                .catch((err: any) => {
                  spark.write({
                    a: "error",
                    v: { message: "Vous avez déjà voté" }
                  });
                });
            } else {
              spark.write({
                a: "error",
                v: { message: "La session n'est pas démarrée" }
              });
            }
          }
          break;
        }

        case "rejoin_session": {
          if (rooms[data.session.room.access_code] !== undefined) {
            const room: Room = rooms[data.session.room.access_code];
            if (room.user.uuid !== user.uuid) {
              spark.write({
                a: "error",
                v: {
                  type: "error",
                  message: "La session n'a pas été trouvée",
                  room: {}
                }
              });
              break;
            }
            room.adminSpark = spark.id;
            spark.write({
              a: "launch_poll",
              v: {
                type: "info",
                message: "Session démarrée",
                room: room
              }
            });
          }
          break;
        }
        default:
      }
    }
  });
});

primus.on("joinroom", (roomName: string, spark: Primus.ISpark) => {
  spark.write({
    a: "room_joined",
    v: {
      type: "success",
      message: "Vous avez rejoint la salle",
      room: rooms[roomName].getFilteredRoom()
    }
  });
  const room: Room = rooms[roomName];
  const tempSession: any = room.session;
  if (tempSession !== undefined) {
    spark.write({
      a: "load_question",
      v: { currentQuestion: Session.GETFILTEREDCURRENTQUESTION(tempSession) }
    });
  }
});

primus.on("disconnection", (spark: Primus.ISpark) => {
  spark.leaveAll();
});

// creates primus.js file for client side
primus.save("./dist/lib/primus.js");

// Reloads open sessions and rooms at server start
db.ready
  .then(() => {
    db.session
      .findAll({
        where: {
          stop: null
        },
        include: [
          { model: db.room, as: "room" },
          {
            model: db.poll,
            as: "poll",
            include: [
              {
                model: db.question,
                as: "questions",
                include: [
                  { model: db.answer, as: "answers" },
                  { model: db.vote, as: "votes" }
                ]
              },
              { model: db.user, as: "user" }
            ]
          }
        ]
      })
      .then((dbSessions: any) => {
        dbSessions.forEach((dbSession: any) => {
          if (dbSession.poll === null) {
            return;
          }
          const user: User = new User(
            dbSession.poll.user.uuid,
            dbSession.poll.user.id,
            dbSession.poll.user.email,
            dbSession.poll.user.firstname,
            dbSession.poll.user.lastname
          );
          const room: Room = new Room(
            user,
            dbSession.room.access_code,
            dbSession.room.id,
            dbSession.room.open
          );
          const session: Session = new Session(
            new Poll(
              dbSession.poll.name,
              user,
              dbSession.poll.id,
              dbSession.poll.created,
              dbSession.poll.questions.map((question: any) => {
                return {
                  index: question.index,
                  content: question.content,
                  answers: question.answers.map((answer: any) => {
                    return {
                      index: answer.index,
                      content: answer.content,
                      correct: answer.correct,
                      id: answer.id,
                      votesCount: 0
                    };
                  }),
                  questionType: question.question_type,
                  id: question.id,
                  deleted: question.deleted,
                  votes: question.votes,
                  votersCount: 0
                };
              })
            ),
            room,
            dbSession.state,
            dbSession.start,
            dbSession.stop,
            dbSession.created,
            dbSession.id
          );
          session.poll.calcAnswersVotesCount();
          room.session = session.getData();
          rooms[room.accessCode] = room;
        });
      })
      .then(() => {
        server.listen(process.env.SERVERAPP_PORT);
      });
  })
  .catch((error: any) => {
    logger.error(error.message);
  });
