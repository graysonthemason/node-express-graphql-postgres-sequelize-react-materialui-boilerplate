/* eslint react/forbid-prop-types: 0 */
import React, { Component, Fragment } from 'react';
import { graphql } from 'react-apollo';
import { Link } from 'react-router-dom';

import classnames from 'classnames';

// @material-ui
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Menu,
  Icon
} from '@material-ui/core';
import { AccountCircle, MoreVert } from '@material-ui/icons';
import styles from './header.css.js';
import query from '../queries/CurrentUser';
import mutation from '../mutations/Logout';

const logo = ''; // Put your cloudinary link to a logo here
const menuItems = [
  // PUBLIC LINKS
  {
    label: 'Home',
    path: '/'
  },
  // AUTH PROTECTED LINKS
  {
    label: 'My Dashboard',
    path: '/users/dashboard',
    auth: true
  },
  // HIDDEN WHEN LOGGED IN LINKS
  {
    label: 'Login',
    path: '/login',
    auth: false // determines if logged in it will not show
  }
];

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
      open: false,
      isMenuOpen: false,
      isMobileMenuOpen: false,
      mobileMoreAnchorEl: null
    };
    // Bind functions
    this.handleUserMenu = this.handleUserMenu.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.handleMobileMenuOpen = this.handleMobileMenuOpen.bind(this);
    this.handleMobileMenuClose = this.handleMobileMenuClose.bind(this);
    this.renderLinks = this.renderLinks.bind(this);
    this.handleToggleAdmin = this.handleToggleAdmin.bind(this);
  }

  onLogoutClick() {
    const { mutate } = this.props;
    this.handleClose();
    mutate({
      refetchQueries: [
        {
          query
        }
      ]
    });
  }

  handleMobileMenuOpen(event) {
    this.setState({
      mobileMoreAnchorEl: event.currentTarget,
      isMobileMenuOpen: true
    });
  }

  handleMobileMenuClose() {
    this.setState({ mobileMoreAnchorEl: null, isMobileMenuOpen: false });
  }

  handleUserMenu(event) {
    this.setState({
      open: true,
      anchorEl: event.currentTarget
    });
  }

  handleClose() {
    this.setState({
      open: false,
      anchorEl: null
    });
  }

  handleToggleAdmin() {
    const {
      data: { me }
    } = this.props;

    const userId = me.user.id;
  }

  renderLinks() {
    const {
      classes,
      data: { me }
    } = this.props;
    const jsx = [];
    jsx.push();
    menuItems
      .filter(elem => {
        const { auth } = elem;
        if (auth === false) return me && !me.user;
        if (auth) return me && me.user;
        return true;
      })
      .forEach((elem, index) => {
        jsx.push(
          <Button
            key={`menuItem-${index}-${elem.path}`}
            className={classnames([
              classes.navButton,
              window.location.hash.split('?')[0] === `#${elem.path}`
                ? classes.selected
                : null
            ])}
            component={Link}
            to={elem.path}
          >
            {elem.label}
          </Button>
        );
        return null;
      });
    return jsx;
  }

  renderNavLinks() {
    const {
      data: { loading, me },
      classes
    } = this.props;
    const { anchorEl, open } = this.state;
    if (loading) {
      return <div />;
    }
    const mobileMenuBtn = (
      <IconButton
        aria-haspopup="true"
        onClick={this.handleMobileMenuOpen}
        color="inherit"
        size="large"
        className={classes.navButton}
      >
        <MoreVert />
      </IconButton>
    );
    if (me && me.user) {
      return (
        <Fragment>
          <div className={classes.sectionMobile}>{mobileMenuBtn}</div>
          <div className={classes.sectionDesktop}>
            {this.renderLinks()}
            <IconButton
              aria-owns={anchorEl ? 'menu-appbar' : null}
              aria-haspopup="true"
              className={classes.menuAvatarBtn}
              onClick={this.handleUserMenu}
              color="primary"
            >
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
              open={!!open}
              onClose={this.handleClose}
            >
              <MenuItem
                component={Link}
                to="/users/edit"
                onClick={this.handleClose}
              >
                <ListItemIcon>
                  <AccountCircle />
                </ListItemIcon>
                <ListItemText inset primary="Profile" />
              </MenuItem>
              {/* <MenuItem onClick={this.handleClose}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText inset primary="My account" />
              </MenuItem> */}
              <MenuItem onClick={this.onLogoutClick}>
                <ListItemIcon>
                  <Icon className="fas fa-sign-out-alt" />
                </ListItemIcon>
                <ListItemText inset primary="Logout" />
              </MenuItem>
            </Menu>
          </div>
        </Fragment>
      );
    }
    return (
      <div>
        <div className={classes.sectionMobile}>{mobileMenuBtn}</div>
        <div className={classes.sectionDesktop}>
          {this.renderLinks()} {/* render public links only */}
        </div>
      </div>
    );
  }

  renderMobileNavLinks() {
    const {
      classes,
      data: { loading, me }
    } = this.props;
    const jsx = [];
    if (loading) return null;
    menuItems
      .filter(elem => {
        const { auth } = elem;
        if (auth === false) return me && !me.user;
        if (auth) return me && me.user;
        return true;
      })
      .forEach(elem => {
        jsx.push(
          <MenuItem
            className={classnames([
              classes.navButton,
              window.location.hash.split('?')[0] === `#${elem.path}`
                ? classes.mobileSelected
                : null
            ])}
            key={`mobile-menuItem-${elem.path}`}
            component={Link}
            to={elem.path}
          >
            <ListItemText>{elem.label}</ListItemText>
          </MenuItem>
        );
      });
    if (me && me.user) {
      jsx.push(
        <MenuItem key="mobile-menu-logout" onClick={this.onLogoutClick}>
          <ListItemText primary="Logout" />
        </MenuItem>
      );
    }
    return jsx;
  }

  render() {
    const { classes } = this.props;
    const {
      anchorEl,
      mobileMoreAnchorEl,
      isMenuOpen,
      isMobileMenuOpen
    } = this.state;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>Profile</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>My account</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {this.renderMobileNavLinks()}
      </Menu>
    );

    return (
      <Fragment>
        <AppBar position="sticky" color="default">
          <Toolbar>
            <Typography color="inherit" className={classes.grow}>
              <Link to="/" className="no-select">
                <img width="170px" src={logo} alt="Logo" />
              </Link>
            </Typography>
            <ul
              className="navContainer right hide-on-med-and-down"
              className={classes.navContainer} /* eslint-disable-line */
            >
              {this.renderNavLinks()}
              {renderMenu}
              {renderMobileMenu}
            </ul>
          </Toolbar>
        </AppBar>
      </Fragment>
    );
  }
}

Header.propTypes = {
  classes: PropTypes.object.isRequired
};

export default graphql(mutation)(
  graphql(query)(
    withStyles(styles, {
      withTheme: true
    })(Header)
  )
);
