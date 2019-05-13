import React, { Component } from 'react';
import { green, amber } from '@material-ui/core/colors';
import { withStyles } from '@material-ui/core/styles';
import { CheckCircle, Error, Info, Close, Warning } from '@material-ui/icons';
import PropTypes from 'prop-types';

import classNames from 'classnames';

import { IconButton, Snackbar, SnackbarContent } from '@material-ui/core';

const styles = theme => ({
  success: {
    backgroundColor: green[600]
  },
  error: {
    backgroundColor: theme.palette.error.dark
  },
  info: {
    backgroundColor: theme.palette.primary.dark
  },
  warning: {
    backgroundColor: amber[700]
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit
  },
  margin: {
    margin: theme.spacing.unit
  },
  message: {
    display: 'flex',
    alignItems: 'center'
  }
});

function getVariantIcon(variant, classes) {
  const variantIcon = {
    success: (
      <CheckCircle className={classNames(classes.icon, classes.iconVariant)} />
    ),
    warning: (
      <Warning className={classNames(classes.icon, classes.iconVariant)} />
    ),
    error: <Error className={classNames(classes.icon, classes.iconVariant)} />,
    info: <Info className={classNames(classes.icon, classes.iconVariant)} />
  };
  return variantIcon[variant];
}

class StatusSnackbar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
      variant: props.variant,
      open: props.open
    };
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps);
  }

  handleSnackbarClose() {
    const { parent } = this.props;
    parent.setState({ snackbarOpen: false });
  }

  render() {
    const { variant, message, open } = this.state;
    const { classes } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        onClose={this.handleSnackbarClose}
        open={open}
        autoHideDuration={variant === 'success' ? 2500 : 6000}
      >
        <SnackbarContent
          className={classNames(classes[variant])}
          aria-describedby="client-snackbar"
          message={
            <span id="client-snackbar" className={classes.message}>
              {getVariantIcon(variant, classes)}
              {message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleSnackbarClose}
            >
              <Close className={classes.icon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}

StatusSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  parent: PropTypes.object.isRequired,
  variant: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired
};

export default withStyles(styles)(StatusSnackbar);
