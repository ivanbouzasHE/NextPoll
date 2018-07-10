/**
 * User model
 */
import * as db from "../db";

export class User {
  public id: number;
  public uuid: string;
  public email: string;
  public firstname: string;
  public lastname: string;

  constructor(
    uuid?: string,
    id?: number,
    email?: string,
    firstname?: string,
    lastname?: string
  ) {
    this.id = id || -1;
    this.uuid = uuid || "";
    this.email = email || "";
    this.firstname = firstname || "";
    this.lastname = lastname || "";
  }

  public save(): any {
    if (this.id !== -1) {
      return db.user.upsert({
        id: this.id,
        uuid: this.uuid,
        email: this.email,
        firstname: this.firstname,
        lastname: this.lastname
      });
    } else {
      return this.findOrCreateUserByUuid();
    }
  }

  public getPolls(): any {
    return db.poll.findAll({
      where: {
        user_id: this.id
      }
    });
  }

  public getRooms(): any {
    return db.room.findAll({
      where: {
        user_id: this.id
      }
    });
  }

  public getSessions(): any {
    return db.session.findAll({
      include: [
        { model: db.poll, as: "poll", where: { user_id: this.id } },
        { model: db.room, as: "room" }
      ]
    });
  }

  /**
   * Looks if a uuid already exists in the database and saves the user
   */
  private findOrCreateUserByUuid(): any {
    return db.user
      .findOrCreate({ where: { uuid: this.uuid } })
      .spread((dbUser: any, created: any) => {
        if (!created && dbUser.get("email")) {
          /**
           * todo l'utilisateur doit avoir un token valide (Google SignIn)
           * si l'uuid ramène un utilisateur qui a un email
           * cela veut dire que l'utilisateur c'est déjà authentifié une fois
           * et que les données ne doivent pas être accessible avec simplement l'uuid
           */

          throw new Error("L'utilisateur doit être loguer");
        }
        this.id = dbUser.get("id");
        this.email = dbUser.get("email");
        this.firstname = dbUser.get("fistname");
        this.lastname = dbUser.get("lastname");
      });
  }
}
