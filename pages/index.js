import { useEffect, useState } from 'react'

import plSession from '../prolog/prolog';



import classes from '../styles/HomePage.module.css';

var ask = (question) => {
  console.log(`The question is ${question}`);
}

const HomePage = () => {

  const [question, setQuestion] = useState('Dummy question is it true?');
  const [userInput, setUserInput] = useState();

  useEffect(() => {
    plSession.consult('/de7k.pl', {
      success: () => {
        console.log("Consulted de7k.pl successfully");
        plSession.query('init.', {
          success: () => {
            getAnswer();
          },
          error: (error) => {
            console.log(error);
          }
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }, []);

  const getAnswer = () => {
    plSession.answer({
      success: (result) => {
        console.log(result); //add to list of answer
        getAnswer();
      },
      fail: () => {
        console.log('No more answers');
      },
      error: (error) => {
        console.log(error);
      },
      limit: () => {
        console.log('limit exceeded');
      }
    });
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
