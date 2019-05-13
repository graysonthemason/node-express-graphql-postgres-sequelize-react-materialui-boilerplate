import React, { Component, Fragment } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import { Grid } from '@material-ui/core';

import Dashboard from './Dashboard';

import withTracker from '../components/withTracker';
import ProfileForm from '../components/ProfileForm';

import StatusSnackbar from '../components/StatusSnackbar';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 440,
    zIndex: 1,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex'
  },
  pgTitle: {
    margin: '1em 0'
  },
  paper: {
    padding: theme.spacing.unit * 2
  }
});
class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarVariant: ''
    };
  }

  // '/users/*' will refuse access to subroutes without curUser and equip with curUser

  render() {
    const {
      classes,
      data: { loading, me }
    } = this.props;
    if (loading) return null;
    const { snackbarOpen, snackbarMessage, snackbarVariant } = this.state;
    return (
      <Fragment>
        <Grid justify="center" container>
          <Switch>
            <Route exact path="/users">
              <Redirect to="/users/dashboard" />
            </Route>
            <Route
              path="/users/edit*"
              render={props => <ProfileForm me={me} parent={this} {...props} />}
            />
            <Route
              path="/users/dashboard*"
              render={props => <Dashboard me={me} parent={this} {...props} />}
            />
          </Switch>
        </Grid>
        <StatusSnackbar
          variant={snackbarVariant}
          message={snackbarMessage}
          open={snackbarOpen}
          parent={this}
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(Users);
