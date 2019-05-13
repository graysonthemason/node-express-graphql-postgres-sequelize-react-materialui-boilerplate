import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

import { ApolloProvider } from 'react-apollo';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';

import withTracker from './components/withTracker';

import App from './components/App';
import NoMatch from './components/NoMatch';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import ResetForm from './components/ResetForm';
import ConfirmForm from './components/ConfirmForm';
import Users from './components/Users';
import requireAuth from './components/requireAuth';
import Home from './components/Home';

// import './assets/css/global.css';

/* eslint-disable no-extend-native */
Date.prototype.addDays = function(days) {
  const date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
};
/* eslint-enable no-extend-native */
const client = new ApolloClient({
  link: createHttpLink({ uri: '/graphql', credentials: 'same-origin' }),
  cache: new InMemoryCache(),
  dataIdFromObject: o => o.id // every object runs through this and determines the id as the id attribute
});

const Root = () => (
  <ApolloProvider client={client}>
    <Router>
      <App>
        <Switch>
          <Route
            exact
            path="/"
            component={withTracker(Home, {
              /* additional GA attributes */
            })}
          />
          <Route
            exact
            path="/login*"
            component={withTracker(LoginForm, {
              /* additional GA attributes */
            })}
          />
          <Route
            exact
            path="/signup"
            component={withTracker(SignupForm, {
              /* additional GA attributes */
            })}
          />
          <Route
            exact
            path="/reset"
            component={withTracker(ResetForm, {
              /* additional GA attributes */
            })}
          />
          <Route
            exact
            path="/confirm*"
            component={withTracker(ConfirmForm, {
              /* additional GA attributes */
            })}
          />
          <Route path="/users" component={withTracker(requireAuth(Users))} />
          <Route
            exact
            path="/*"
            component={withTracker(NoMatch, {
              /* additional GA attributes */
            })}
          />
        </Switch>
      </App>
    </Router>
  </ApolloProvider>
);

ReactDOM.render(<Root />, document.querySelector('#root'));
