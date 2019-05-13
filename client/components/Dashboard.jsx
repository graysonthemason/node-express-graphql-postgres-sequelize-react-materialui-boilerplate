import React, { Component, Fragment } from 'react';
import { withStyles } from '@material-ui/core/styles';
import { Grid, Typography } from '@material-ui/core';

const styles = theme => ({});
class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  // '/users/*' will refuse access to subroutes without curUser and equip with curUser
  render() {
    const { classes, me } = this.props;
    console.log(me);
    return (
      <Fragment>
        <Typography>Hit Dashboard</Typography>
      </Fragment>
    );
  }
}

export default withStyles(styles)(Dashboard);
