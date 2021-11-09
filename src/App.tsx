import React, { useEffect, useState } from 'react';
import { Counter } from './features/counter/Counter';
import './App.scss';
import { Auth, Hub } from 'aws-amplify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Home } from './app/screens/Home/Home';
import { Topic } from './app/screens/Topic/Topic';
import { PageNotFound } from './app/screens/PageNotFound/PageNotFound';
import { SuggestATopic } from './app/screens/SuggestATopic/SuggestATopic';
import { TopicSubmitted } from './app/screens/TopicSubmitted/TopicSubmitted';
import ReactGA from 'react-ga4';

function App() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    ReactGA.initialize('G-B0YF8CLRBE');
    ReactGA.send('pageview');
  }, []);

  useEffect(() => {
    Hub.listen('auth', ({ payload: { event, data } }) => {
      switch (event) {
        case 'signIn':
        case 'cognitoHostedUI':
          getUser().then((userData) => {
            setUser(userData);
            console.log(userData.attributes);
          });
          break;
        case 'signOut':
          setUser('');
          break;
        case 'signIn_failure':
        case 'cognitoHostedUI_failure':
          console.log('Sign in failure', data);
          break;
        default:
          break;
      }
    });

    getUser().then((userData) => setUser(userData));
  }, []);
  function getUser() {
    return Auth.currentAuthenticatedUser()
      .then((userData) => userData)
      .catch(() => console.log('Not signed in'));
  }
  return (
    <>
      <Router basename={process.env.PUBLIC_URL}>
        <div>
          <Switch>
            <Route
              path="/404/:topicText"
              component={(props: any) => (
                <PageNotFound
                  {...props}
                  user={user}
                  key={window.location.pathname}
                />
              )}
            ></Route>
            <Route
              path="/suggest-a-topic"
              component={(props: any) =>
                user ? (
                  <SuggestATopic
                    {...props}
                    user={user}
                    key={window.location.pathname}
                  />
                ) : (
                  <Redirect to="/" />
                )
              }
            ></Route>
            <Route
              path="/topic-submitted"
              component={(props: any) =>
                user ? (
                  <TopicSubmitted
                    {...props}
                    user={user}
                    key={window.location.pathname}
                  />
                ) : (
                  <Redirect to="/" />
                )
              }
            ></Route>
            <Route
              path="/:topicId"
              component={(props: any) => (
                <Topic {...props} user={user} key={window.location.pathname} />
              )}
            ></Route>

            <Route path="/">
              <Home user={user} />
            </Route>
          </Switch>
        </div>
      </Router>
    </>
  );
}

export default App;
