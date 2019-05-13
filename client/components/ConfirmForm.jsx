/* eslint react/forbid-prop-types: 0 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql, Query } from 'react-apollo';
import queryString from 'query-string';

// @material-ui
import {
  Grid,
  Paper,
  Typography,
  Avatar,
  Button,
  FormControl,
  InputLabel,
  Input
} from '@material-ui/core';

import { LockOutlined } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import StatusSnackbar from './StatusSnackbar';
import confirmFormQuery from '../queries/ConfirmEmail';
import mutation from '../mutations/ConfirmEmail';

// import component-specific styling
import styles from './login.css.js';

class ConfirmForm extends Component {
  constructor(props) {
    super(props);
    const { email, token } = queryString.parse(props.location.search);
    this.state = {
      errors: [],
      password: '',
      email,
      token,
      confirmPassword: '',
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarVariant: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit() {
    const { mutate, history } = this.props;
    const { password, email, token } = this.state;
    mutate({
      variables: { password, email, token }
    })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message); // array of all errors in response object
        this.setState({
          errors,
          snackbarMessage: `Sorry! Error confirming account. Please try again later.`,
          snackbarOpen: true,
          snackbarVariant: 'error'
        });
      })
      .then(() => {
        // TODO: popupmessage;
        history.replace('/login');
      }); // can catch/then because this is a promise
  }

  wrapErrorMsg(msg) {
    const { history } = this.props;
    return (
      <Fragment>
        <Grid
          style={{ marginTop: '2em' }}
          container
          justify="center"
          spacing={24}
        >
          <Grid item xs={12}>
            <Typography
              align="center"
              gutterBottom
              variant="subtitle1"
              color="error"
            >
              Sorry! {msg}.
            </Typography>
          </Grid>
          <Button
            variant="contained"
            onClick={() => {
              history.replace('/login');
            }}
          >
            Click here to return to login page.
          </Button>
        </Grid>
      </Fragment>
    );
  }

  render() {
    const { location } = this.props;
    const { email, token } = queryString.parse(location.search);
    console.log('HIT RENDER');
    console.log('email', email);
    return (
      <Query query={confirmFormQuery} variables={{ email }}>
        {({ loading, error, data }) => {
          const { classes } = this.props;
          if (loading || error) return null;
          if (!data.user)
            return this.wrapErrorMsg(
              `User with email address '${email}' does not exist`
            );
          if (data.user.confirmationDt)
            return this.wrapErrorMsg(
              `User with email address '${email}' has already been confirmed. You're all set so head back to the login screen.`
            );
          if (data.user.suspended)
            return this.wrapErrorMsg('User has been temporarily suspended');
          if (token !== data.user.registerToken)
            return this.wrapErrorMsg('Confirmation Token has been invalidated');
          if (
            !data.user.registerExpires ||
            data.user.registerExpires < new Date()
          )
            return this.wrapErrorMsg('Confirmation Token Expired');
          const {
            errors,
            password,
            confirmPassword,
            snackbarOpen,
            snackbarMessage,
            snackbarVariant
          } = this.state;
          return (
            <Fragment>
              <main className={classes.layout}>
                <Paper className={classes.paper}>
                  <Avatar className={classes.avatar} color="secondary">
                    <LockOutlined />
                  </Avatar>
                  <Typography gutterBottom variant="h3">
                    Confirm Account
                  </Typography>
                  <Typography variant="subtitle1">
                    Welcome! Set your password to get started.
                  </Typography>
                  <div className="row">
                    <form onSubmit={this.onSubmit} className={classes.form}>
                      <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">Password</InputLabel>
                        <Input
                          value={password}
                          type="password"
                          onChange={e =>
                            this.setState({ password: e.target.value })
                          }
                        />
                      </FormControl>
                      <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">
                          Confirm Password
                        </InputLabel>
                        <Input
                          value={confirmPassword}
                          type="password"
                          onChange={e =>
                            this.setState({ confirmPassword: e.target.value })
                          }
                        />
                      </FormControl>
                      {errors.map(e => (
                        <Typography gutterBottom color="error" key={e}>
                          {e}
                        </Typography>
                      ))}
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={
                          password.length < 6 || password !== confirmPassword
                        }
                        color="primary"
                      >
                        Save Password
                      </Button>
                    </form>
                  </div>
                </Paper>
              </main>
              <StatusSnackbar
                variant={snackbarVariant}
                message={snackbarMessage}
                open={snackbarOpen}
                parent={this}
              />
            </Fragment>
          );
        }}
      </Query>
    );
  }
}

ConfirmForm.propTypes = {
  classes: PropTypes.object.isRequired
};
export default graphql(mutation)(withStyles(styles)(ConfirmForm));
