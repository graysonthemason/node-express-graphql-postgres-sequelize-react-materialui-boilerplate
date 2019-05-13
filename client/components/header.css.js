// import cssVariables from './cssVariables';

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  demoTxt: {
    margin: 'auto',
    padding: '0 1em',
    fontWeight: 'bold'
  },
  demoContent: {
    backgroundColor: 'aliceblue',
    display: 'flex',
    borderRight: 'solid 2px grey',
    borderLeft: 'solid 2px grey',
    marginRight: '2rem'
  },
  navButton: {
    borderRadius: 0,
    height: "100%",
    fontWeight: 400
  },
  navContainer: {
    margin: 0,
    height: "64px"
  },
  selected: {
    borderBottom: "solid 3px",
    paddingBottom: "3px", // 6 - [borderBottom]
    borderColor: `${theme.palette.primary.main} !important`
  },
  mobileSelected: {
    borderLeft: "solid 3px",
    paddingLeft: "13px", // 16 - [borderLeft]
    borderColor: `${theme.palette.primary.main} !important`
  },
  sectionDesktop: {
    display: 'none',
    height: '100%',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    height: '100%',
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuAvatarBtn: {
    height: '3rem',
    margin: 'auto',
  }
});
export default styles;
