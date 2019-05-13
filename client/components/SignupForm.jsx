/* eslint react/forbid-prop-types: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';

// @material-ui
import { Paper, Typography, Avatar } from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';

// import component-specific styling
import styles from './login.css.js';

import query from '../queries/CurrentUser';
import mutation from '../mutations/Signup';
import AuthForm from './AuthForm';

class SignupForm extends Component {
  constructor(props) {
    super(props);
    this.state = { errors: [] };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillUpdate(nextProps) {
    const { data, history } = this.props;
    if (nextProps.data.me.user && !data.me.user) {
      history.replace('/users/dashboard');
    }
  }

  onSubmit({ email, password }) {
    const { mutate } = this.props;
    mutate({
      variables: { email, password },
      refetchQueries: [{ query }]
    }).catch(res => {
      const errors = res.graphQLErrors.map(error => error.message);
      this.setState({ errors });
    });
  }

  render() {
    const { classes } = this.props;
    const { errors } = this.state;
    return (
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar} color="secondary">
            <LockOutlined />
          </Avatar>
          <Typography variant="h3">Sign Up</Typography>
          <AuthForm errors={errors} onSubmit={this.onSubmit} />
        </Paper>
      </main>
    );
  }
}

SignupForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default graphql(query)(
  graphql(mutation)(withStyles(styles)(SignupForm))
);
