import { createServer } from "http";
import {MultipleChoiceAnswer, SurveyQuestion} from "./ISurveyQuestion";

/**
 * @class Represents a survey runner for user.
 * Keeps track of user's position in survey
 * And all questions to be answered.
 */
export class Survey {
    
    // list of all questions in the survey
    private questions: SurveyQuestion[];

    // the question currently available to answer
    private currentQuestion: number;


    /**
     * Initializes a survey with no questions, starting at index 0.
     */
    constructor() {
        this.questions = [];
        this.currentQuestion = 0;
    }



    /**
     * Returns the current question.
     * If current question does not exit, throws an error.
     * 
     * @return {SurveyQuestion} The current question
     */
    public getQuestion(): SurveyQuestion {
        // return this.questions[this.currentQuestion];
        let val = this.questions[this.currentQuestion];
        if (val !== undefined) {
            return val;
        } else {
            throw new Error("No questions");
        }
    }



    /**
     * Returns the next Question and increments the currentQuestion counter.
     * If no more questions in the list, throws an error.
     * 
     * @return {SurveyQuestion} the next question
     */
    public getNextQuestion(): SurveyQuestion {
        let val = this.questions[++this.currentQuestion];
        if(val !== undefined) {
            return val;
        } else {
            throw new Error("No next question");
        }
    }



    /**
     * Returns a list of all questions stored in Survey.
     * This list may be empty.
     * 
     * @return {SurveyQuestion[]} Comprehensive list of questions
     */
    public getAllQuestions(): SurveyQuestion[] {
        return this.questions;
    }



    /**
     * Adds a question to the back of the question list.
     * 
     * @param {SurveyQuestion} The question to add
     */
    public addQuestion(sq: SurveyQuestion) {
        this.questions.push(sq);
    }



    /**
     * Add multiple Questions to back of questions list.
     * 
     * @param {SurveyQuestion[]} sq a list of valid questions to add
     */
    public addManyQuestions(sq: SurveyQuestion[]) {
        this.questions = this.questions.concat(sq);
    }

    /**
     * Sets the answer of the current question to ans param.
     * If question is MultipleChoiceQuestion but answer is not a MultipleChoiceAnswer
     * or question is null, throw an error and do not change answer.
     * 
     * @param {any} ans The answer given by user input
     */
    public answerQuestion(ans: any) {
        let curq: SurveyQuestion = this.questions[this.currentQuestion];

        if (curq) {
            if ("rightanswer" in curq && !(ans in MultipleChoiceAnswer)) {
                throw new Error("This is a multiple choice question");
            }
            curq.answer = ans;
        }
    }


    /**
     * Returns in string format the contents of a .txt. file at param fileName
     * If no such file found, reject the promise.
     * 
     * @param {string} fileName the path to the file 
     * @returns {Promise<string>} the contents of the file.
     */
    public getFileInformation(fileName: string): Promise<string> {
        let fs = require("fs");
        return new Promise((fullfill, reject) => {
            fs.readFile(fileName, 'utf8', (err: any, result: any) => {
                if (err) {
                    reject(err);
                } else {
                    fullfill(result);
                }
            });
        });
    }



    /**
     * Set the question list to one loaded from a file.
     * file must contain validly-formatted JSON.
     * 
     * @param {string} fileName the path to the file
     * @return {Promise<any>} The parsed JSON object.
     */
    public loadQuestionFromFile(fileName: string): Promise<any> {
        let that = this; // fat arrows do not create a new this context
        return new Promise((fullfill, reject) => {
            that.getFileInformation(fileName).then((data: string) => {
                let parsed = JSON.parse(data);
                that.questions = parsed;
                fullfill(parsed);
            }).catch((err: any) => {
                reject(err);
            });
        });
    }
}


