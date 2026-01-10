import React, { useState, useEffect, useCallback } from 'react';
import { QuizData } from '../Data/QuizData';
import QuizResult from './QuizResult';

function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [clickedOption, setClickedOption] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // Initial time for each question

  const updateScore = useCallback(() => {
    if (clickedOption === QuizData[currentQuestion].answer) {
      setScore(score + 1);
    }
  }, [clickedOption, currentQuestion, score]); // Include all dependencies used in the function

  // Memoize changeQuestion to avoid re-creating the function on every render
  const changeQuestion = useCallback(() => {
    updateScore();
    if (currentQuestion < QuizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setClickedOption(0);
      setTimeLeft(30); // Reset timer for the next question
    } else {
      setShowResult(true);
    }
  }, [currentQuestion, updateScore]); // Include currentQuestion and updateScore in dependencies

  const resetAll = () => {
    setShowResult(false);
    setCurrentQuestion(0);
    setClickedOption(0);
    setScore(0);
    setTimeLeft(30); // Reset the timer when starting over
  };

  useEffect(() => {
    // Set up the timer
    if (timeLeft === 0) {
      // Move to the next question automatically when time is up
      changeQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [timeLeft, changeQuestion]); // Include timeLeft and changeQuestion as dependencies

  return (
    <div>
      <p className="heading-txt">Quiz APP</p>
      <div className="container">
        {showResult ? (
          <QuizResult score={score} totalScore={QuizData.length} tryAgain={resetAll} />
        ) : (
          <>
            <div className="question">
              <span id="question-number">{currentQuestion + 1}. </span>
              <span id="question-txt">{QuizData[currentQuestion].question}</span>
            </div>
            <div className="option-container">
              {QuizData[currentQuestion].options.map((option, i) => {
                return (
                  <button
                    className={`option-btn ${
                      clickedOption === i + 1 ? 'checked' : null
                    }`}
                    key={i}
                    onClick={() => setClickedOption(i + 1)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
            <div className="timer">
              <p>Time left: {timeLeft} seconds</p>
            </div>
            <input type="button" value="Next" id="next-button" onClick={changeQuestion} />
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;
