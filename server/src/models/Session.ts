/**
 * Session models, creates historisation of poll sessions in a room
 */
import * as db from "../db";
import { IAnswer, IQuestion, Poll } from "../models/Poll";
import { Room } from "../models/Room";

export class Session {
  public id: number;
  public state: number;
  public created: Date;
  public start?: Date;
  public stop?: Date;
  public poll: Poll;
  public room: Room;

  constructor(
    poll: Poll,
    room: Room,
    state?: number,
    start?: Date,
    stop?: Date,
    created?: Date,
    id?: number
  ) {
    this.state = state || 0;
    this.created = created || new Date();
    this.start = start || undefined;
    this.stop = stop || undefined;
    this.poll = poll;
    this.room = room;
    this.id = id || -1;
  }

  /**
   * Returns current session question, without 'correct' answer attribute
   */
  public static GETFILTEREDCURRENTQUESTION(session: Session): IQuestion {
    const tempQuestion: any = JSON.parse(
      JSON.stringify(session.poll.questions[session.state])
    );
    tempQuestion.answers = tempQuestion.answers.map((answer: IAnswer) => {
      return {
        index: answer.index,
        content: answer.content
      };
    });

    return tempQuestion;
  }

  public save(): any {
    if (this.id !== -1) {
      return db.session.upsert({
        id: this.id,
        state: this.state,
        created: this.created,
        start: this.start,
        stop: this.stop,
        poll_id: this.poll.id,
        room_id: this.room.id
      });
    } else {
      return db.session
        .findOrCreate({
          where: { poll_id: this.poll.id, created: this.created.toISOString() },
          defaults: {
            created: this.created,
            poll_id: this.poll.id,
            room_id: this.room.id,
            state: this.state,
            start: this.start,
            stop: this.stop
          }
        })
        .spread((dbRoom: any, created: any) => {
          this.id = dbRoom.get("id");
        });
    }
  }

  public startSession(): Promise<any> {
    this.start = new Date();

    return this.save();
  }

  /**
   * Returns Session without room (Circular reference problem JSON)
   */
  public getData(): any {
    return {
      id: this.id,
      state: this.state,
      created: this.created,
      start: this.start,
      stop: this.stop,
      poll: this.poll
    };
  }
}
