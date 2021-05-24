import { useEffect, useState } from 'react';
import plSession from '../prolog/prolog';

import classes from '../styles/HomePage.module.css';

const HomePage = () => {

  const [question, setQuestion] = useState('Dummy Question?');
  const [userInput, setUserInput] = useState();

  useEffect(async () => {

    await plSession.promiseConsult('kb.pl');
    await plSession.promiseQuery(`start.`);
    for await (let answer of plSession.promiseAnswers()) {
      console.log(plSession.format_answer(answer));yes
    }

    // plSession.consult('kb.pl', {
    //   success: () => {
    //     console.log("Consulted de7k.pl successfully");
    //     plSession.query(`start.`, {
    //       success: () => {
    //        getAnswer();
    //       },
    //       error: (error) => {
    //         console.log(error);
    //       }
    //     });
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
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

  // const getAnswer = () => {
  //   plSession.answer({
  //     success: (result) => {
  //       console.log(result); //add to list of answer
  //       getAnswer();
  //     },
  //     fail: () => {
  //       console.log('No more answers');
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     },
  //     limit: () => {
  //       console.log('limit exceeded');
  //     }
  //   });
  // }

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
