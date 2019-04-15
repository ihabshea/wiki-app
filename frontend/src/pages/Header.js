import { ThemeProvider } from "@material-ui/styles";
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Icon from '@material-ui/core/Icon';
import strings from '../language/localization';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import LangContext from '../language/languageContext';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import Button from '@material-ui/core/Button';
import NotificationsIcon from '@material-ui/icons/Notifications';
import blueGrey from '@material-ui/core/colors/blueGrey';

import FormControl from '@material-ui/core/FormControl';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputLabel from '@material-ui/core/InputLabel';  
import FormHelperText from '@material-ui/core/FormHelperText';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MoreIcon from '@material-ui/icons/MoreVert';
import {theme, useStyles} from '../theme/theme';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter,
Col, Row, Form, Container, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';

function Header() {
  const [modal, setModal] = useState(false);
  const context = useContext(AuthContext);
  const lContext = useContext(LangContext);
  const [loginForm, setLoginForm] = useState([{
    username: '',
    password : '',
    showPassword: false
  }]);
  const classes = useStyles();
const [anchorEl, setAnchorEl] = React.useState(null);
const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);
const loginTo = async (username, password) => {
  console.log(username, password);

  const loginRequest = {
    query: `
    query{
      login(username: "${username}", password: "${password}"){
        userId
        token
        tokenExpiration
      }
    }
    `
  }
  await fetch('http://localhost:9000/graphql',
  {
    method: 'POST',
    body: JSON.stringify(loginRequest),
    headers: {
      'Content-Type': 'application/json'
    }
  }
)
.then( res => {
    if(res.status !== 200 && res.status !== 201){
      throw new Error('failed');
    }
    return res.json();
  }).then(resData => {
    if(resData.data.login.token){
      context.login(resData.data.login.token, resData.data.login.userId,resData.data.login.userId.tokenExpiration);
    }
      // if(resData.data.login.token){
      // }
  }).catch(err => {
    throw(err);
  });
}
useEffectAsync(async() => {
  if(localStorage.getItem("language")){
    await strings.setLanguage(localStorage.getItem("language"));
  }else{
    await strings.setLanguage("en"); 
  }

});
const toggle = () => { setModal(!modal); }
const changeInput = (e) => {
  const name = e.target.name;
  const value = e.target.value;
  setLoginForm(loginForm => { return {...loginForm, [name]: value}})
}

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  function handleProfileMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleMobileMenuClose() {
    setMobileMoreAnchorEl(null);
  }

  function handleMenuClose() {
    setAnchorEl(null);
    handleMobileMenuClose();
  }

  function handleMobileMenuOpen(event) {
    setMobileMoreAnchorEl(event.currentTarget);
  }

  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>
        <p>Messages</p>
      </MenuItem>
      <MenuItem>
        <IconButton color="inherit">
          <Badge badgeContent={11} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notifications</p>
      </MenuItem>
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton color="inherit">
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>
    </Menu>
  );
  const handleClickShowPassword = () => {
    setLoginForm(clf => {
      return {...clf, showPassword: !loginForm.showPassword}
    });
  };
  return (
          <AuthContext.Consumer>
      {context => {
        return (
          <LangContext.Consumer>
          {lContext => {
            return (
    <ThemeProvider theme={theme}>
     <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
            <MenuIcon />
          </IconButton>
          <Typography className={classes.title} variant="h6" color="inherit" noWrap>
            WikiMVC
          </Typography>
          <div className={classes.search} 
             style={{
              paddingLeft: 10 
            }}
          > 
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              style={{
                paddingLeft: 40
              }}
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
            />
          </div>
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
          {!context.token &&
              <>
            <IconButton onClick={toggle} >
              <Icon style={{color:"white"}} className="material-icons">
              exit_to_app
              </Icon>
            </IconButton>
            <Dialog
        open={modal}
        onClose={toggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Login"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <FormControl>
          <TextField
        id="filled-adornment-password"
        name="username"
        variant="filled"

        label="Username"
        value={loginForm.password}
        onChange={changeInput}

      />
          <TextField
        id="filled-adornment-password"
        name="password"
        variant="filled"
        type={loginForm.showPassword ? 'text' : 'password'}
        label="Password"
        value={loginForm.password}
        onChange={changeInput}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton aria-label="Toggle password visibility" onClick={handleClickShowPassword}>
                {loginForm.showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
  <FormHelperText id="my-helper-text">Forgot login credentials? <a href="">Click here</a></FormHelperText>
</FormControl>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={toggle} color="primary">
            Signup
          </Button>
          <Button onClick={() => loginTo(loginForm.username, loginForm.password)} color="primary" autoFocus>
            Login
          </Button>
        </DialogActions>
      </Dialog>
            {/* <Modal isOpen={modal} toggle={toggle}>
                 <ModalHeader toggle={toggle}>Login</ModalHeader>
                 <ModalBody>
                  <Form >
                    <FormGroup>
                      <Label for="exampleEmail" hidden>Username</Label>
                      <Input type="text" name="username" value={loginForm.username} onChange={changeInput} id="exampleEmail" placeholder="Username" />
                      </FormGroup>
                      {' '}
                      <FormGroup>
                      <Label for="examplePassword" hidden>Password</Label>
                      <Input type="password" name="password" value={loginForm.password} onChange={changeInput} id="examplePassword" placeholder="Password" />
                    </FormGroup>
                  </Form>
                  </ModalBody>
                 <ModalFooter>
                   <button onClick={() => loginTo(loginForm.username, loginForm.password)} color="primary" >Login</button>{' '}
                   <Button color="secondary" onClick={toggle}>Cancel</Button>
                 </ModalFooter>
               </Modal> */}
            </>
          }
          </div>
          <div className={classes.sectionMobile}>
            <IconButton aria-haspopup="true" onClick={handleMobileMenuOpen} color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMenu}
      {renderMobileMenu}
    </div>
    </ThemeProvider>
      );
       }}
       
    </LangContext.Consumer>
 
 );
}}
  </AuthContext.Consumer>
  )

}
          

export default Header;