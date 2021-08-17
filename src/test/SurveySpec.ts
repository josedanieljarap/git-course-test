
import {expect} from "chai";
import "mocha";

import { Survey } from "../model/Survey";
import { MultipleChoiceAnswer, SurveyQuestion } from "../model/ISurveyQuestion";

describe("Basic test for survey", function() {

    let s: Survey;
    let members: any[];
    let members2: any[];

    beforeEach(function() {
        members = [
            {
                num: 0,
                question: "What is your favourite operating system?",
                answer: null
            },
            {
                num: 1,
                question: "Please select 'C' to preserve your answers",
                answer: null,
                rightanswer: MultipleChoiceAnswer.C
            },
            {
                num: 2,
                question: "On a scale of 1 to 5, how much do you enjoy Computer Science?",
                answer: null
            },
            {
                num: 3,
                question: "What is pi to at least 3 decimal places?",
                answer: null
            }
        ];

        s = new Survey();
        s.addManyQuestions(members);

        members2 = [
            {
                num: 4,
                question: "What is your favourite sport to play?",
                answer: null
            },
            {
                num: 5,
                question: "How many years have you spent in school?",
                answer: null
            },
            {
                num: 6,
                question: "What year did the French Revolution begin? A. 1492 B. 1779 C.1792 B.1812",
                answer: null,
                rightanswer: MultipleChoiceAnswer.B
            }
        ];

    });

    it("Should return the next question", function() {
        const actual = s.getQuestion();
        const expected = members[0];
        expect(actual).to.equal(expected);

        const noProp = "rightanswer";
        expect(actual).not.to.have.property(noProp);

        const allKeys = ["num", "answer", "question"];
        expect(actual).to.have.all.keys(allKeys);
    });

    it("Should throw an error if a questions does not exist", function() {
        const test = new Survey();
        const getActual = () => {
            test.getQuestion();
        };
        expect(getActual).to.throw("No questions"); 
    });

    it("Should be able to iterate to the next question", function() {
        const actual = s.getNextQuestion();
        const expected = members[1];
        expect(actual).to.equal(expected);
    });

    it("Should throw an error if the next question does not exist", function() {
        const test = new Survey();
        const getActual = () => {
            test.getNextQuestion();
        };
        expect(getActual).to.throw("No next question"); 
    });

    it("Should be able to test numerical answers", function() {
        const q = s.getQuestion();
        s.answerQuestion(22/7);
        expect(q.answer).to.be.within(3.141, 3.143);
    });

    it("Should be able to load questions from file", function() {
        let test = new Survey();
        return test.loadQuestionFromFile("sample.txt").then((data) => {
            const actual = test.getAllQuestions().length;
            const expected = 3;
            expect(actual).to.equal(expected);
        });
    });
});