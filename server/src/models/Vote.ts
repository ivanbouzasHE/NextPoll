/**
 * Vote Class, represents a vote to a question in a session
 */
import * as db from "../db";

export class Vote {
  public userId: number;
  public answerIndex: number;
  public sessionId: number;
  public questionId: number;

  constructor(
    userId: number,
    answerIndex: number,
    sessionId: number,
    questionId: number
  ) {
    this.userId = userId;
    this.answerIndex = answerIndex;
    this.sessionId = sessionId;
    this.questionId = questionId;
  }

  public save(): any {
    return db.vote.create({
      user_id: this.userId,
      answer_index: this.answerIndex,
      session_id: this.sessionId,
      question_id: this.questionId
    });
  }
}
