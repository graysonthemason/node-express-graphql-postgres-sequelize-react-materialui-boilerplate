/* eslint react/forbid-prop-types: 0 */

import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import validator from 'validator';
import queryString from 'query-string';

// @material-ui
import {
  Paper,
  Typography,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
  FormControl,
  InputLabel,
  Input,
  DialogActions,
  Grid
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';

import StatusSnackbar from './StatusSnackbar';

import query from '../queries/CurrentUser';
import loginMutation from '../mutations/Login';
import sendForgotPasswordEmailMutation from '../mutations/SendForgotPasswordEmail';
import sendRegisterEmailMutation from '../mutations/SendRegisterEmail';
import AuthForm from './AuthForm';

// import component-specific styling
import styles from './login.css.js';

class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: [],
      forgotPasswordErrors: [],
      registerErrors: [],
      forgotPasswordEmail: '',
      forgotPasswordOpen: false,
      registerOpen: false,
      registerEmail: '',
      snackbarOpen: false,
      snackbarMessage: '',
      snackbarVariant: ''
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.sendResetLink = this.sendResetLink.bind(this);
    this.sendRegisterLink = this.sendRegisterLink.bind(this);
  }

  componentWillMount() {
    const { data, history } = this.props;
    if (data.loading || !data.me) return;
    if (data.me.user) history.replace('/users/dashboard');
  }

  componentWillUpdate(nextProps) {
    const { data, history } = this.props;
    // this.props //the old, current set of props
    // nextProps // the next set of props that will be in place
    // when the component re-renders
    if (data.loading || !data.me) return;
    if (data.me.user || (!data.me.user && nextProps.data.me.user)) {
      // redirect to dashboard
      history.replace('/users/dashboard');
    }
  }

  onSubmit({ email, password }) {
    const { mutate } = this.props;
    mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message); // array of all errors in response object
      this.setState({ errors });
    }); // can catch/then because this is a promise
  }

  sendRegisterLink() {
    const { registerEmail } = this.state;
    const { sendRegisterEmail } = this.props;
    let errorCheck = false;
    sendRegisterEmail({
      variables: { email: registerEmail }
    })
      .catch(res => {
        errorCheck = true;
        const registerErrors = res.graphQLErrors.map(error => error.message);
        this.setState({
          registerErrors,
          snackbarMessage: `Error sending email.`,
          snackbarOpen: true,
          snackbarVariant: 'error'
        });
      })
      .then(user => {
        if (errorCheck || !user) return;
        this.setState({
          registerErrors: [],
          forgotPasswordOpen: false,
          snackbarMessage: `Email successfully sent to ${
            user.data.sendRegisterEmail.email
          }.`,
          snackbarOpen: true,
          snackbarVariant: 'success'
        });
      });
  }

  sendResetLink() {
    const { forgotPasswordEmail } = this.state;
    const { sendForgotPasswordEmail } = this.props;
    let errorCheck = false;
    sendForgotPasswordEmail({
      variables: { email: forgotPasswordEmail }
    })
      .catch(res => {
        errorCheck = true;
        const forgotPasswordErrors = res.graphQLErrors.map(
          error => error.message
        );
        this.setState({
          forgotPasswordErrors,
          snackbarMessage: `Error sending email.`,
          snackbarOpen: true,
          snackbarVariant: 'error'
        });
      })
      .then(user => {
        if (errorCheck || !user) return;
        this.setState({
          forgotPasswordErrors: [],
          forgotPasswordOpen: false,
          snackbarMessage: `Email successfully sent to ${
            user.data.sendForgotPasswordEmail.email
          }.`,
          snackbarOpen: true,
          snackbarVariant: 'success'
        });
      });
  }

  render() {
    const { classes, location } = this.props;
    const {
      errors,
      forgotPasswordErrors,
      forgotPasswordOpen,
      forgotPasswordEmail,
      registerOpen,
      registerEmail,
      registerErrors,
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
            <Typography variant="h3">Log In</Typography>
            <AuthForm
              email={queryString.parse(location.search).email}
              errors={errors}
              onSubmit={this.onSubmit}
            />
            <Grid container justify="space-between">
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ registerOpen: true });
                }}
              >
                Register
              </Button>
              <Button
                color="primary"
                onClick={() => {
                  this.setState({ forgotPasswordOpen: true });
                }}
              >
                Forgot Password
              </Button>
            </Grid>
          </Paper>
          {/* FORGOT PASSWORD DIALOG */}
          <Dialog
            open={forgotPasswordOpen}
            onClose={() => {
              this.setState({
                forgotPasswordEmail: '',
                forgotPasswordErrors: [],
                forgotPasswordOpen: false
              });
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle>Reset password</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Enter the email address associated with your account, and we’ll
                email you a link to reset your password.
              </DialogContentText>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  value={forgotPasswordEmail}
                  autoFocus
                  onChange={e =>
                    this.setState({
                      forgotPasswordEmail: e.target.value
                    })
                  }
                />
              </FormControl>
              {forgotPasswordErrors.map(error => (
                <Typography gutterBottom color="error" key={error}>
                  {error}
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  this.setState({
                    forgotPasswordOpen: false
                  })
                }
                color="primary"
              >
                Back to Login
              </Button>
              <Button
                onClick={this.sendResetLink}
                color="primary"
                disabled={
                  !forgotPasswordEmail ||
                  !validator.isEmail(forgotPasswordEmail)
                }
              >
                Send reset link
              </Button>
            </DialogActions>
          </Dialog>
          {/* REGISTER DIALOG */}
          <Dialog
            open={registerOpen}
            onClose={() => {
              this.setState({
                registerEmail: '',
                registerErrors: [],
                registerOpen: false
              });
            }}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle>Register</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Please enter your company email address to log in so we can send
                you an email confirmation.
              </DialogContentText>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email</InputLabel>
                <Input
                  value={registerEmail}
                  autoFocus
                  onChange={e =>
                    this.setState({
                      registerEmail: e.target.value
                    })
                  }
                />
              </FormControl>
              {registerErrors.map(error => (
                <Typography gutterBottom color="error" key={error}>
                  {error}
                </Typography>
              ))}
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() =>
                  this.setState({
                    registerOpen: false
                  })
                }
                color="primary"
              >
                Back to Login
              </Button>
              <Button
                onClick={this.sendRegisterLink}
                color="primary"
                disabled={!registerEmail || !validator.isEmail(registerEmail)}
              >
                Send Confirmation email
              </Button>
            </DialogActions>
          </Dialog>
        </main>
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

LoginForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default graphql(query)(
  graphql(loginMutation)(
    graphql(sendRegisterEmailMutation, {
      name: 'sendRegisterEmail'
    })(
      graphql(sendForgotPasswordEmailMutation, {
        name: 'sendForgotPasswordEmail'
      })(withStyles(styles)(LoginForm))
    )
  )
);
