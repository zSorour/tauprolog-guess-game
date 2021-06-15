import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import plSession from '../prolog/prolog';

import classes from '../styles/HomePage.module.css';

const HomePage = () => {
  const [qa, setQA] = useState([]);
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
    setQA(qa => [...qa, { question: question, answer: answer }]);
  }

  return (
    <div>
      <div className={classes.Conversation}>
        <h1>Interaction between Client and Server</h1>
        <div className={classes.Conversation_Body}>
          {qa.map((item, index) => (
            <div key={item.question + item.answer} className={classes.Message}>
              <p className={classes.Question}>
                Client: {qa[index + 1] ? `does the character have the following feature: "${item.question}"?` : `Is the character "${item.question}"?`}
              </p>
              <p className={classes.Answer}>
                Server: {item.answer}
              </p>
            </div>
          ))}</div>
      </div>
    </div>
  );
}

export default HomePage;