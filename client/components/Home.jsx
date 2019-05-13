import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  mainSubtitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '1rem'
    }
  }
});

const insideStyles = {
  padding: 20,
  position: 'absolute',
  width: '100%',
  top: '50%',
  left: '50%',
  textAlign: 'center',
  transform: 'translate(-50%,-50%)'
};

const subHeadStyles = {
  color: 'rgba(0, 0, 0, 0.54)',
  marginTop: '10px',
  fontWeight: '300',
  letterSpacing: '1px',
  textTransform: 'uppercase'
};

const btnStyles = {
  marginTop: '15px'
};

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = { contactFormOpen: false };
  }

  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <Typography>TESTING</Typography>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
