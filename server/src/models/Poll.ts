/**
 * Poll + Question + Answer definition
 */
import * as db from "../db";
import { User } from "../models/User";
import { Vote } from "../models/Vote";

export class Poll {
  public id: number;
  public name: string;
  public created: Date;
  public questions: IQuestion[];
  public user: User;

  constructor(
    name: string,
    user: User,
    id?: number,
    created?: Date,
    questions?: IQuestion[]
  ) {
    this.name = name;
    this.user = user;
    this.id = id || -1;
    this.created = created || new Date();
    this.questions = questions || [];
  }

  public save(): any {
    if (this.id !== -1) {
      return db.session
        .findOne({
          where: { poll_id: this.id }
        })
        .then((dbSession: any) => {
          if (dbSession === null) {
            return db.sequelize.transaction((t: any) => {
              return db.poll
                .update(
                  {
                    name: this.name,
                    created: this.created
                  },
                  {
                    where: {
                      id: this.id,
                      user_id: this.user.id
                    },
                    transaction: t
                  }
                )
                .spread((rowCount: number) => {
                  if (!rowCount) {
                    throw new Error(
                      "(id forgery) Poll does not belong to this user: "
                        .concat(this.user.id.toString())
                        .concat(" poll: ")
                        .concat(this.id.toString())
                    );
                  }
                  const qPromises: any = this.questions.map((q: IQuestion) => {
                    if (q.deleted) {
                      return db.question.destroy({
                        where: {
                          index: q.index,
                          poll_id: this.id
                        }
                      });
                    } else {
                      return db.question
                        .upsert(
                          {
                            id: q.id,
                            index: q.index,
                            content: q.content,
                            question_type: q.questionType
                          },
                          { transaction: t, returning: true }
                        )
                        .spread((dbQuestion: any) => {
                          const aPromises: any = q.answers.map((a: IAnswer) => {
                            return db.answer.upsert(
                              {
                                id: a.id,
                                index: a.index,
                                content: a.content,
                                correct: a.correct,
                                question_id: dbQuestion.id
                              },
                              { transaction: t }
                            );
                          });

                          return Promise.all(aPromises);
                        });
                    }
                  });

                  return Promise.all(qPromises);
                });
            });
          } else {
            this.name = this.name
              .concat(" ")
              .concat(new Date().toLocaleDateString());

            return this.createPoll();
          }
        });
    } else {
      return this.createPoll();
    }
  }

  public deletePoll(): any {
    return db.poll
      .findOne({
        where: {
          id: this.id,
          user_id: this.user.id
        }
      })
      .then((poll: any) => {
        return poll.destroy();
      });
  }

  /**
   * Calculate number of votes per answer and puts it in IAnswer
   */
  public calcAnswersVotesCount(): void {
    this.questions.forEach((e: IQuestion) => {
      const votes: any = e.votes;
      e.votersCount = votes.length;
      const counts: any = Array(e.answers.length).fill(0);
      votes.forEach((v: any) => {
        counts[v.answer_index]++;
      });
      counts.forEach((c: number, i: number) => {
        e.answers[i].votesCount = c;
      });
    });
  }

  private createPoll(): any {
    return db.sequelize.transaction((t: any) => {
      return db.poll
        .findOrCreate({
          where: {
            name: this.name,
            user_id: this.user.id
          },
          defaults: {
            name: this.name,
            user_id: this.user.id,
            created: this.created
          },
          transaction: t
        })
        .spread((dbPoll: any, created: boolean) => {
          if (created) {
            this.id = dbPoll.id;

            return db.question
              .bulkCreate(
                this.questions.map((question: IQuestion) => {
                  return {
                    index: question.index,
                    content: question.content,
                    poll_id: dbPoll.id,
                    question_type: question.questionType
                  };
                }),
                { transaction: t, returning: true }
              )
              .then((dbQuestions: any) => {
                const promises: any = dbQuestions.map(
                  (question: any, index: number) => {
                    this.questions[index].id = question.id;

                    return db.answer
                      .bulkCreate(
                        this.questions[question.index].answers.map(
                          (answer: IAnswer) => {
                            return {
                              index: answer.index,
                              content: answer.content,
                              correct: answer.correct,
                              question_id: question.id
                            };
                          }
                        ),
                        { transaction: t, returning: true }
                      )
                      .then((dbAnswers: any) => {
                        dbAnswers.forEach((answer: any, indexA: number) => {
                          this.questions[index].answers[indexA].id = answer.id;
                        });
                      });
                  }
                );

                return Promise.all(promises);
              });
          } else {
            throw new Error("Un sondage avec ce nom existe déjà");
          }
        });
    });
  }
}

export interface IQuestion {
  index: number;
  content: string;
  answers: IAnswer[];
  questionType: EQuestionType;
  id?: number;
  deleted?: boolean;
  votersCount?: number;
  votes?: Vote[];
}

export interface IAnswer {
  index: number;
  content: string;
  correct: boolean | number;
  id?: number;
  votesCount?: number;
}

/**
 * Question types, same is used in client app
 */
export enum EQuestionType {
  ON = "ON",
  QCM = "QCM",
  CAC = "QRM"
}
