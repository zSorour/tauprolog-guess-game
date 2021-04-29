import { useEffect, useState } from 'react'

import plSession from '../prolog/prolog';



import classes from '../styles/HomePage.module.css';

const HomePage = () => {

  const [question, setQuestion] = useState('Dummy question is it true?');
  const [userInput, setUserInput] = useState();

  useEffect(() => {
    plSession.consult('/kb.pl', {
      success: () => {
        console.log("Consulted kb.pl successfully");
      },
      error: (err) => {
        console.log(err);
      }
    });
  }, []);

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
