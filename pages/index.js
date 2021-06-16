/*React and Next.JS related imports*/
import { useEffect, useState } from 'react';
import Router from 'next/router';

import { v4 as uuid } from 'uuid'; //For generating universal unique IDs.
import axios from 'axios'; //For easier HTTP requests handling.

//Import the Tau-Prolog session setup in prolog.js file.
import plSession from '../prolog/prolog';

//Import CSS styles for the webpage.
import classes from '../styles/HomePage.module.css';


//Create a React Functional Component that renders JSX (HTML in JavaScript).
const HomePage = () => {
  //Setting up some state variables to be used for rendering later
  const [questionsAnswersState, setQA] = useState([]); //Array of objects to hold questions and answers from Prolog Agent contacting the server.
  const [questionsCount, setQuestionsCount] = useState(0); //Integer counter to hold the number of questions asked.
  const [accessToken, setAccessToken] = useState(''); //String variable to hold the authorization JWT retrieved from the server. 
  const [error, setError] = useState();

  //useEffect hook, with the following definition, is a React special function 'hook' that is executed once this component is created and rendered.
  useEffect(async () => {
    //On first time rendering the component, connect to the server, get a JWT and store it in the accessToken state variable.
    axios.post('https://pure-mountain-31553.herokuapp.com/auth', {
      connectionID: uuid()
    })
      .then(async (response) => {
        //After the request is sent and a response is received, the response should be containing the access token, JWT.
        //We call the setAccessToken function to store it in the accessToken state variable.
        setAccessToken(response.data.accessToken);

        //Having loaded the token, we use TauProlog plSession imported from prolog.js file to consult the knowledge base. 
        await plSession.promiseConsult('kb.pl');
        //After the KB is consulted successfully, we query 'start.' to start the guessing process.
        await plSession.promiseQuery('start.');
        await plSession.promiseAnswer();
      })
      .catch(err => {
        setError('Error connecting to server. Please make sure that the server is up and running');
      });
  }, []);

  /*DEFINE SOME HELPER FUNCTIONS IN THE GLOBAL VARIABLE SO THAT IT CAN BE CALLED FROM TAUPROLOG*/
  //A funcion that returns the access token from accessToken state variable.
  global.getToken = function () {
    return accessToken;
  }
  //A function that calls setQuestionsCount and setQA methods that update the state variables of the questions and answers, and the questions count
  global.setQuestionAnswer = function (question, answer) {
    //Since we write text-data in prolog with underscores instead of spaces between the words,
    //we replace all the underscores with whitespace.
    question = question.replace(/_/g, ' ');
    setQuestionsCount(questionsCount => questionsCount + 1);
    setQA(questionsAnswersState => [...questionsAnswersState, { question: question, answer: answer }]);
  }

  /*
  The React functional component returns JSX elements that represent HTML elements to be rendered, where JavaScript can be used for added dynamicality
  */

  if (error) {
    return (<p>{error}</p>);
  }
  else {
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
}

export default HomePage;