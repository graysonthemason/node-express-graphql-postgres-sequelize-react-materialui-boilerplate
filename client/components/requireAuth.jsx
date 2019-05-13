import React, { Component } from 'react';
import { graphql } from 'react-apollo';

import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Button,
  List
} from '@material-ui/core';

import currentUserQuery from '../queries/CurrentUser';
import UserContext from './userContext';

export default (WrappedComponent, options) => {
  class RequireAuth extends Component {
    constructor(props) {
      super(props);
      this.renderAccountList = this.renderAccountList.bind(this);
      this.handleAccountSelect = this.handleAccountSelect.bind(this);
    }

    handleAccountSelect(event) {
      const { data } = this.props;
      const account = JSON.parse(event.currentTarget.getAttribute('value'));
      data.account = account;
    }

    renderAccountList() {
      const {
        data: { me, loading }
      } = this.props;
      if (loading || !me || !me.user) return null;
      const jsx = [];
      return jsx;
    }

    render() {
      const {
        data: { me, loading },
        history
      } = this.props;
      if (!loading && me && !me.user) {
        history.replace('/login');
      }
      return (
        <React.Fragment>
          <UserContext.Provider value={me}>
            <WrappedComponent {...this.props} query={currentUserQuery} />
          </UserContext.Provider>
        </React.Fragment>
      );
    }
  }
  return graphql(currentUserQuery)(RequireAuth);
};
