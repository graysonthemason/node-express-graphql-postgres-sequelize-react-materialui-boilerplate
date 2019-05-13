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
import withStyles from '@material-ui/core/styles/withStyles';
import StatusSnackbar from './StatusSnackbar';
import resetFormQuery from '../queries/UpdatePassword';
import mutation from '../mutations/ResetPassword';

// import component-specific styling
import styles from './login.css.js';

class ResetForm extends Component {
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
    this.wrapErrorMsg = this.wrapErrorMsg.bind(this);
  }

  async onSubmit() {
    const { mutate, history } = this.props;
    const { password, email, token } = this.state;
    await mutate({
      variables: { password, email, token }
    })
      .catch(res => {
        const errors = res.graphQLErrors.map(error => error.message); // array of all errors in response object
        this.setState({
          errors,
          snackbarMessage: `Sorry! Error resetting password. Please try again later.`,
          snackbarOpen: true,
          snackbarVariant: 'error'
        });
      })
      .then(() => {
        history.replace(`/login?email=${email}&updatepasswordsuccess=true`);
      });
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
    return (
      <Query query={resetFormQuery} variables={{ email }}>
        {({ loading, error, data }) => {
          const { classes } = this.props;
          if (loading || error) return null;
          if (!data.user)
            return this.wrapErrorMsg(
              `User with email address '${email}' does not exist`
            );
          if (data.user.suspended)
            return this.wrapErrorMsg('User has been temporarily suspended');
          if (token !== data.user.resetToken) {
            return this.wrapErrorMsg('Reset Token has been invalidated');
          }
          if (!data.user.resetExpires || data.user.resetExpires < new Date())
            return this.wrapErrorMsg('Reset Token Expired');
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
                  <Typography variant="h3">Update Password</Typography>
                  <div className="row">
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
                      <InputLabel htmlFor="email">Confirm Password</InputLabel>
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
                      onClick={this.onSubmit}
                      color="primary"
                    >
                      Update Password
                    </Button>
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

ResetForm.propTypes = {
  classes: PropTypes.object.isRequired
};
export default graphql(mutation)(withStyles(styles)(ResetForm));
