/* eslint react/forbid-prop-types: 0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// @material-ui
import {
  Typography,
  FormControl,
  InputLabel,
  Button,
  Input
} from '@material-ui/core';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 3
  }
});

class AuthForm extends Component {
  constructor(props) {
    super(props);
    this.state = { email: props.email || '', password: '' };
  }

  onSubmit(event) {
    const { props } = this;
    event.preventDefault();
    props.onSubmit(this.state);
  }

  render() {
    const { classes } = this.props;
    const { email, password } = this.state;
    const { errors } = this.props;
    return (
      <div className="row">
        <form onSubmit={this.onSubmit.bind(this)} className={classes.form}>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Email Address</InputLabel>
            <Input
              value={email}
              autoFocus
              autoComplete="email"
              onChange={e => this.setState({ email: e.target.value })}
            />
          </FormControl>
          <FormControl margin="normal" required fullWidth>
            <InputLabel htmlFor="email">Password</InputLabel>
            <Input
              value={password}
              type="password"
              autoComplete="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </FormControl>

          {errors.map(error => (
            <Typography gutterBottom color="error" key={error}>
              {error}
            </Typography>
          ))}
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign in
          </Button>
        </form>
      </div>
    );
  }
}

AuthForm.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(AuthForm);
