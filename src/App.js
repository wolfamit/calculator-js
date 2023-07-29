import React, { useState, useEffect } from 'react';
import Header from './Components/Header/Header.js';
import Keypad from './Components/Keypad/Keypad.js';

import './App.css';

const usedKeyCodes = [
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 96, 97, 98, 99, 100, 101, 102, 103,
  104, 105, 8, 13, 190, 187, 189, 191, 56, 111, 106, 107, 109,
];

const numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const operators = ["-", "+", "*", "/"];



function App() {

  // Using UseState to Create state of dark mode , expression , result
  const [isdarkMode, setIsDarkMode] = useState(false)
  const [expression, setExpression] = useState("")
  const [result, setResult] = useState("")
  const [history, setHistory] = useState(
    JSON.parse(localStorage.getItem("calculator-app-history")) || []
  );

  // function to handle Key presses both in Keyboard and on screen
  const handleKeyPress = (KeyCode, key) => {
    if (!KeyCode) return;
    // checks the user dont press any other keys 
    if (!usedKeyCodes.includes(KeyCode)) return;
    // if user presses significant key


    if (numbers.includes(key)) {
      //checks user dont press 0 in beginning
      if (key === "0") {
        if (expression.length === 0) return;
      }
      // set the state to expression 
      setExpression(expression + key)
    }

    else if (operators.includes(key)) {
      if (!expression) return;
      const lastChar = expression.slice(-1)
      if (operators.includes(lastChar)) return;
      if (lastChar === ".") return;

      else
        return setExpression(expression + key)
      // console.log("Operator");
    }
    // SLice last expression
    else if (KeyCode === 8) {
      setExpression(expression.slice(0, -1))
      // console.log("backspace");
    }
    else if (key === ".") {
      if (!expression) return;
      const lastChar = expression.slice(-1)
      if (!numbers.includes(lastChar)) return;
      // if(expression.includes(".")) return;
      setExpression(expression + key)

    }

    //Enter Function
    else if (KeyCode === 13) {

      if (!expression) return;
      calculateResult(expression);

      let tempHistory = [...history];
      if (tempHistory.length > 20) tempHistory = tempHistory.splice(0, 1);
      tempHistory.push(expression);
      setHistory(tempHistory);
    }
  };



  const calculateResult = (exp) => {
    if (!exp) {
      setResult("");
      return;
    }

    const lastChar = exp.slice(-1);
    if (!numbers.includes(lastChar)) exp = exp.slice(0, -1);

    const answer = eval(exp).toFixed(2) + "";
    setResult(answer);
  };

  useEffect(() => {
    localStorage.setItem("calculator-app-mode", JSON.stringify(isdarkMode));
  }, [isdarkMode]);

  useEffect(() => {
    localStorage.setItem("calculator-app-history", JSON.stringify(history));
  }, [history]);

  return (

    <div
      className='app'
      tabIndex="0"
      //React KeyboardEvent handler function
      onKeyDown={(event) => handleKeyPress(event.keyCode, event.key)}
      data-theme={isdarkMode ? "dark" : ""}>
      <div className='app_calculator'>
        <div className='app_calculator_navbar'>
          < div className='app_calculator_navbar_toggle' onClick={() => setIsDarkMode(!isdarkMode)} >

            <button className={`app_calculator_navbar_toggle_circle ${isdarkMode ? "app_calculator_navbar_toggle_circle_active" : ""}`}></button>
          </div>
        </div>
        <Header expression={expression} result={result} history={history} />
        <Keypad handleKeyPress={handleKeyPress} />
      </div>
    </div>


  );
}

export default App;
