import { useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
import plSession from '../prolog/prolog';

import classes from '../styles/HomePage.module.css';

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  useEffect(async () => {
    //Connect to server to get token, similar to starting a session:
    axios.post('http://localhost:8080/auth', {
      connectionID: uuid()
    })
      .then(async (response) => {
        let accessToken = response.data.accessToken;
        let modifiedToken = accessToken.replace(/\./g, "");
        setAccessToken(modifiedToken);

        await plSession.promiseConsult('kb.pl');
        await plSession.promiseQuery(`assertz(token(${modifiedToken})).`);
        await plSession.promiseAnswer();
        await plSession.promiseQuery('start.');
        await plSession.promiseAnswer();
      });
  }, []);

  //Define global function so it can be called from the kb.pl file using tau-prolog

  const fetchAnswer = async (question) => {
    if (question === 'unknown') {
      return;
    }
    console.log(question);
    //ask the server
    const response = await axios.get(`http://localhost:8080/ask?q=${question}`, {
      headers: {
        Authorization: `BEARER ${accessToken}`
      }
    });
    return response.data.answer;
  }

  global.ask = async function (question) {
    const answer = await fetchAnswer(question);
    console.log(answer);
    return answer;
  }

  global.printtt = function (value) {
    console.log(value);
  }

  global.getToken = function () {
    return accessToken;
  }

  return (
    <div>
      <div className={classes.PrologAgent}>
        <div className={classes.Question}>
          <h1>Answer the following question:</h1>
          <p>Some random question</p>
        </div>
      </div>
      <div className={classes.Answers}>
        <button>Next</button>
      </div>
    </div>
  );
}

export default HomePage;