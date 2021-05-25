import { useEffect, useState } from 'react';
import plSession from '../prolog/prolog';

import classes from '../styles/HomePage.module.css';

const HomePage = () => {

  const [question, setQuestion] = useState('Dummy Question?');
  const [userInput, setUserInput] = useState();

  useEffect(async () => {

    await plSession.promiseConsult('kb.pl');
    await plSession.promiseQuery(`start.`);
    await plSession.promiseAnswer();
  }, []);

  global.ask = (question) => {
    setQuestion(question);
    //ask the server
    //get reply from the server
    let answer;
    answer = prompt(question);
    setUserInput(answer);
    return answer;
  }

  const inputChangeHandler = (e) => {
    setUserInput(e.target.value);
  }

  const nextButtonClickHandler = () => {
    //tell prolog the answer stored in userInput
  }

  return (
    <div>
      <div className={classes.PrologAgent}>
        <div className={classes.Question}>
          <h1>Answer the following question:</h1>
          <p>{question}</p>
        </div>
      </div>
      <div className={classes.Answers}>
        <input type="text" value={userInput} onChange={inputChangeHandler} />
        <button onClick={nextButtonClickHandler}>Next</button>
      </div>
    </div>
  )
}

export default HomePage;
