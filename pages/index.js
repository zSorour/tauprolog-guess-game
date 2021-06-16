import { useEffect, useState } from 'react';
import Router from 'next/router';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import plSession from '../prolog/prolog';


import classes from '../styles/HomePage.module.css';

const HomePage = () => {
  const [questionsAnswersState, setQA] = useState([]);
  const [questionsCount, setQuestionsCount] = useState(0);
  const [accessToken, setAccessToken] = useState('');

  useEffect(async () => {
    //Connect to server to get token, similar to starting a session:
    axios.post('http://localhost:8080/auth', {
      connectionID: uuid()
    })
      .then(async (response) => {
        setAccessToken(response.data.accessToken);
        await plSession.promiseConsult('kb.pl');
        await plSession.promiseQuery('start.');
        await plSession.promiseAnswer();
      });
  }, []);

  //Define global functions so it can be called from the kb.pl file using tau-prolog
  global.getToken = function () {
    return accessToken;
  }

  global.setQuestionAnswer = function (question, answer) {
    question = question.split('_').join(' ');
    setQuestionsCount(questionsCount => questionsCount + 1);
    setQA(questionsAnswersState => [...questionsAnswersState, { question: question, answer: answer }]);
  }

  return (
    <div>
      <div className={classes.Conversation}>
        <h1>Interaction between Client and Server</h1>
        <h2>Number of questions asked: {questionsCount}</h2>
        <div className={classes.Container}>
          <div className={classes.Conversation_Body}>
            {questionsAnswersState.map((item, index) => (
              <div key={item.question + item.answer} className={classes.Message}>
                <p className={classes.Question}>
                  Client: {questionsAnswersState[index + 1] ? `does the character have the following feature: "${item.question}"?` : `Is the character "${item.question}"?`}
                </p>
                <p className={classes.Answer}>
                  Server: {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button className={classes.AgainButton} onClick={() => Router.reload()}>
          Guess Again
        </button>
      </div>
      <div className={classes.SoftwareTools}>
        <a href="https://reactjs.org/"><img src="/reactLogo.png" width={70} height={70} /></a>
        <a href="https://nextjs.org/"><img src="/nextjsLogo.png" width={70} height={70} /></a>
        <a href="http://tau-prolog.org/"><img src="/tauprologLogo.png" width={70} height={70} /></a>
        <a href="https://nodejs.org/en/"><img src="/nodejsLogo.png" width={70} height={70} /></a>
      </div>
    </div>
  );
}

export default HomePage;