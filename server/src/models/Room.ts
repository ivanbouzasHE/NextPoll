/**
 * Room model, represents a room where session are launch
 * with a poll and where user can join to respond
 */
import * as db from "../db";
import { Session } from "../models/Session";
import { User } from "../models/User";

export class Room {
  public id: number;
  public accessCode: string;
  public open: boolean;
  public user: User;
  // transient
  public session?: Session;
  public adminSpark?: string;

  constructor(user: User, accessCode?: string, id?: number, open?: boolean) {
    this.accessCode = accessCode || "";
    this.user = user;
    this.open = open || true;
    this.id = id || -1;
  }

  /**
   * Generates an access code for the room, check if it already exists in the database
   */
  public async genAccessCode(): Promise<any> {
    this.accessCode = Math.floor(Math.random() * 1000000).toString();
    let cond: boolean = true;

    while (cond) {
      await db.room
        .findOne({
          where: {
            access_code: this.accessCode
          }
        })
        .then((dbRoom: any) => {
          if (dbRoom !== null) {
            this.accessCode = Math.floor(Math.random() * 1000000).toString();

            cond = true;
          } else {
            cond = false;
          }
        });
    }
  }

  // Filters room informations to be sent to the public responding
  public getFilteredRoom(): any {
    return {
      accessCode: this.accessCode,
      id: this.id
    };
  }

  public save(): any {
    if (this.id !== -1) {
      return db.room.upsert({
        id: this.id,
        accessCode: this.accessCode,
        open: this.open,
        user_id: this.user.id
      });
    } else {
      if (this.accessCode === "") {
        return this.genAccessCode().then(() => {
          return this.saveNew();
        });
      } else {
        return this.saveNew();
      }
    }
  }

  private saveNew(): any {
    return db.room
      .findOrCreate({
        where: { access_code: this.accessCode },
        defaults: {
          user_id: this.user.id,
          open: this.open,
          access_code: this.accessCode
        }
      })
      .spread((dbRoom: any, created: any) => {
        this.id = dbRoom.get("id");
      });
  }
}
