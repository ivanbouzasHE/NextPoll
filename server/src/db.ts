/**
 * Database models definition
 */

import * as Sequelize from "sequelize";

// Sequelize init with parameters
export const sequelize: Sequelize.Sequelize = new Sequelize(
  process.env.POSTGRES_DB || "public",
  process.env.POSTGRES_USER || "postgres",
  process.env.POSTGRES_PASSWORD || "1234",
  {
    dialect: process.env.DATABASE_DIALECT,
    host: process.env.SERVER_ADDRESS,
    port: Number(process.env.POSTGRES_PORT)
  }
);

/**
 * Tables definition
 */

export const user: Sequelize.Model<{}, {}> = sequelize.define(
  "User",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    uuid: {
      type: Sequelize.UUID,
      unique: true,
      validate: {
        isUUID: 4
      },
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    firstname: Sequelize.STRING,
    lastname: Sequelize.STRING
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export const room: Sequelize.Model<{}, {}> = sequelize.define(
  "Room",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    access_code: { type: Sequelize.STRING, unique: true },
    open: { type: Sequelize.BOOLEAN, defaultValue: true },
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: user,
        key: "id"
      },
      allowNull: false
    }
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export const poll: Sequelize.Model<{}, {}> = sequelize.define(
  "Poll",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: Sequelize.STRING, unique: "u_poll", allowNull: false },
    created: Sequelize.DATE,
    user_id: {
      type: Sequelize.INTEGER,
      references: {
        model: user,
        key: "id"
      },
      allowNull: false,
      unique: "u_poll"
    }
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export const session: Sequelize.Model<{}, {}> = sequelize.define(
  "Session",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    state: { type: Sequelize.INTEGER, defaultValue: 0 },
    created: { type: Sequelize.DATE, unique: "u_session" },
    start: Sequelize.DATE,
    stop: Sequelize.DATE,
    poll_id: {
      type: Sequelize.INTEGER,
      references: {
        model: poll,
        key: "id"
      },
      allowNull: false,
      unique: "u_session"
    },
    room_id: {
      type: Sequelize.INTEGER,
      references: {
        model: room,
        key: "id"
      },
      allowNull: false
    }
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

/**
 * index and poll_id should be composite unique key
 * but needs to be deffered during update transaction
 * not supported yet by Sequelize v4.37.10
 */
export const question: Sequelize.Model<{}, {}> = sequelize.define(
  "Question",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    index: { type: Sequelize.INTEGER },
    content: { type: Sequelize.STRING },
    question_type: {
      type: Sequelize.ENUM,
      values: ["ON", "QCM", "QRM"]
    },
    poll_id: {
      type: Sequelize.INTEGER,
      references: {
        model: poll,
        key: "id"
      }
    }
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

/**
 * index and question_id should be composite unique key
 * but needs to be deffered during update transaction
 * not supported yet by Sequelize v4.37.10
 */
export const answer: Sequelize.Model<{}, {}> = sequelize.define(
  "Answer",
  {
    id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
    index: { type: Sequelize.INTEGER },
    question_id: {
      type: Sequelize.INTEGER,
      references: {
        model: question,
        key: "id"
      },
      allowNull: false
    },
    content: { type: Sequelize.STRING },
    correct: Sequelize.BOOLEAN
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

export const vote: Sequelize.Model<{}, {}> = sequelize.define(
  "Vote",
  {
    user_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: user,
        key: "id"
      }
    },
    question_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: question,
        key: "id"
      }
    },
    session_id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      references: {
        model: session,
        key: "id"
      }
    },
    answer_index: Sequelize.INTEGER
  },
  {
    timestamps: true,
    underscored: true,
    paranoid: true
  }
);

/**
 * Sequelize object models relations
 */
session.belongsTo(poll, { as: "poll", foreignKey: "poll_id" });
poll.hasMany(session, { as: "sessions", foreignKey: "poll_id" });
session.belongsTo(room, { as: "room", foreignKey: "room_id" });
poll.hasMany(question, { as: "questions", foreignKey: "poll_id" });
question.hasMany(answer, { as: "answers", foreignKey: "question_id" });
question.hasMany(vote, { as: "votes", foreignKey: "question_id" });
user.hasMany(room, { as: "rooms", foreignKey: "user_id" });
room.belongsTo(user, { as: "user", foreignKey: "user_id" });
user.hasMany(poll, { as: "polls", foreignKey: "user_id" });
poll.belongsTo(user, { as: "user", foreignKey: "user_id" });

export const ready: any = sequelize.sync();
