import React, { useState, useEffect } from "react";

const App = () => {
  const [lessonCount, setLessonCount] = useState(2);
  const [completedLessons, setCompletedLessons] = useState(0);
  const [typingText, setTypingText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isTextComplete, setIsTextComplete] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    generateText();
  }, [lessonCount]);

  useEffect(() => {
    if (completedLessons === lessonCount) {
      setIsTextComplete(true);
    }
  }, [completedLessons, lessonCount]);

  const handleCheckboxChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setLessonCount(count);
    setCompletedLessons(0);
    setIsTextComplete(false);
    setInputValue("");
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);

    if (!startTime) {
      setStartTime(new Date().getTime());
    }
  };

  const generateText = () => {
    const letters = "asdfjkl;";
    let text = "";

    for (let i = 0; i < 10; i++) {
      const letter1 = letters[Math.floor(Math.random() * letters.length)];
      const letter2 = letters[Math.floor(Math.random() * letters.length)];
      const word = letter1 + letter2;
      text += word + " ";
    }

    setTypingText(text.trim());
  };

  const renderStyledText = () => {
    const letters = typingText.split(" ");
    const typedLetters = inputValue.split(" ");

    return letters.map((letter, index) => {
      let style = {};

      if (inputValue === "") {
        style.color = "white";
      } else if (index < typedLetters.length) {
        if (letter === typedLetters[index]) {
          style.color = "green";
        } else {
          style.color = "red";
        }
      }

      return (
        <span key={index} style={style}>
          {letter}
        </span>
      );
    });
  };

  const handleTextComplete = () => {
    if (inputValue === typingText) {
      setInputValue("");
      setCompletedLessons((prevCompletedLessons) => prevCompletedLessons + 1);
      generateText();

      const currentTime = new Date().getTime();
      if (startTime) {
        const elapsedTime = (currentTime - startTime) / 1000;
        const wpm = Math.floor((inputValue.length / 5) / (elapsedTime / 60));
        setWpm(wpm);
        setStartTime(null);
      } else {
        setStartTime(currentTime);
      }
    }
  };

  const handleReset = () => {
    setInputValue("");
    setWpm(0);
    setAccuracy(0);
    setStartTime(null);
  };

  useEffect(() => {
    if (inputValue !== "") {
      const timer = setInterval(() => {
        const currentTime = new Date().getTime();
        const elapsedTime = (currentTime - startTime) / 1000;
        const wpm = Math.floor((inputValue.length / 5) / (elapsedTime / 60));
        setWpm(wpm);
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [inputValue, startTime]);

  useEffect(() => {
    const typedLetters = inputValue.split(" ");
    const correctLetters = typingText.split(" ");
    const correctCount = typedLetters.reduce((count, letter, index) => {
      return count + (letter === correctLetters[index] ? 1 : 0);
    }, 0);
    const accuracy = (correctCount / correctLetters.length) * 100;
    setAccuracy(accuracy.toFixed(2));
  }, [inputValue, typingText]);

  return (
    <div className="App">
      <h2 className="heading">Type Tutor</h2>
      <div className="main-container">
        <div className="lessons-container">
          <h1 className="lessons-heading">No of Lessons</h1>
          <div className="lessons-checkbox">
            <input
              type="checkbox"
              name="2"
              value="2"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="2">2</label>
          </div>
          <div className="lessons-checkbox">
            <input
              type="checkbox"
              name="25"
              value="25"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="25">25</label>
          </div>
          <div className="lessons-checkbox">
            <input
              type="checkbox"
              name="50"
              value="50"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="50">50</label>
          </div>
          <div className="lessons-checkbox">
            <input
              type="checkbox"
              name="75"
              value="75"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="75">75</label>
          </div>
          <div className="lessons-checkbox">
            <input
              type="checkbox"
              name="100"
              value="100"
              onChange={handleCheckboxChange}
            />
            <label htmlFor="100">100</label>
          </div>
        </div>
        <h1 className="lessons-count">
          Lessons <span>{completedLessons}</span>/
          <span>{lessonCount}</span>
        </h1>
        <div className="typing-container">
          <div className="text-display">{renderStyledText()}</div>
          <div className="typing-field">
            <input
              className="input-box"
              type="text"
              tabIndex="1"
              value={inputValue}
              onChange={handleInputChange}
              onKeyUp={handleTextComplete}
              disabled={isTextComplete}
            />
          </div>
          <div className="button" onClick={handleReset}>
            <button className="btn">Reset</button>
          </div>
        </div>
      </div>
      <div className="speed-container">
        <h1>WPM: <span>{wpm}</span></h1>
        <h1>Accuracy: <span>{accuracy}%</span></h1>
      </div>
    </div>
  );
};

export default App;
