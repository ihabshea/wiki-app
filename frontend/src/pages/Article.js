import React, { useReducer, useContext, useState, useEffect } from 'react';

import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import strings from '../language/localization';
import LangContext from '../language/languageContext';
import { theme, useStyles } from '../theme/theme';
import Description from "./Article/description"
import { ThemeProvider } from "@material-ui/styles";
import WigEditor from './Article/sections/wig-editor'
import classNames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Dialog from '@material-ui/core/Dialog';

import FilledInput from '@material-ui/core/FilledInput';
import Slide from '@material-ui/core/Slide';
import OutlinedInput from '@material-ui/core/OutlinedInput'
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import InfoBox from './Article/infoBox';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
import Sections from './Article/sections/sections'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MenuItem from '@material-ui/core/MenuItem';
import NoSsr from '@material-ui/core/NoSsr';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Select from 'react-select';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  Alert,
  DropdownMenu, Table,
  DropdownItem,
  Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, InputGroupAddon,
  Col, Row, Form, Container, FormGroup, Label, FormText, ListGroup, ListGroupItem, Jumbotron
} from 'reactstrap';
import languageContext from '../language/languageContext';

const Article = ({ match }) => {
  const classes = useStyles();
  let languageexists = localStorage.getItem("language") !== "null";
  const lContext = useContext(LangContext);
  const authD = useContext(AuthContext);
  const [fields, reloadFields] = useState([]);
  const [isDead, setDead] = useState(false);
  const [birthDate, setBD] = useState(null);
  const [fieldForm, setFieldForm] = useState([{ fieldname: "en", fieldvalue: "English" }]);
  const [preferredLanguage, setLang] = useState(null);
  const [addField, setAddField] = useState(false);
  const [editMode, setEM] = useState(false);
  const [modal, setModal] = useState(true);
  const [EFV, setEFV] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState({ text: null });
  const [degree, setDG] = useState(null);
  const [institution, setIN] = useState(null);
  const [editTitle, setET] = useState(false);
  const [currentTitle, setCT] = useState('');
  const [editDescrition, setED] = useState(false);
  const [sections, retrieveSections] = useState([]);
  const [PLanguage, setPLanguage] = useState("en");
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);

  const [wizardDialog, setWZD] = useState(false);


  const [languages, setLanguages] = useState([{ shorthand: "en", name: "English" }]);
  const [alanguages, setALanguages] = useState([{ shorthand: "en", name: "English" }]);

  let lpreferredLanguage = localStorage.getItem("language");
  const Transition = (props) => {
    return <Slide direction="up" {...props} />;
  }

  function NoOptionsMessage(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.noOptionsMessage}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  function inputComponent({ inputRef, ...props }) {
    return <div ref={inputRef} {...props} />;
  }

  function Control(props) {
    return (
      <TextField
        fullWidth
        InputProps={{
          inputComponent,
          inputProps: {
            className: props.selectProps.classes.input,
            inputRef: props.innerRef,
            children: props.children,
            ...props.innerProps,
          },
        }}
        {...props.selectProps.textFieldProps}
      />
    );
  }

  function Option(props) {
    return (
      <MenuItem
        buttonRef={props.innerRef}
        selected={props.isFocused}
        component="div"
        style={{
          fontWeight: props.isSelected ? 500 : 400,
        }}
        {...props.innerProps}
      >
        {props.children}
      </MenuItem>
    );
  }

  function Placeholder(props) {
    return (
      <Typography
        color="textSecondary"
        className={props.selectProps.classes.placeholder}
        {...props.innerProps}
      >
        {props.children}
      </Typography>
    );
  }

  function SingleValue(props) {
    return (
      <Typography className={props.selectProps.classes.singleValue} {...props.innerProps}>
        {props.children}
      </Typography>
    );
  }
  function Menu(props) {
    return (
      <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
        {props.children}
      </Paper>
    );
  }

  function ValueContainer(props) {
    return <div className={props.selectProps.classes.valueContainer}>{props.children}</div>;
  }
  const components = {
    Control,
    Menu,
    NoOptionsMessage,
    Option,
    Placeholder,
    SingleValue,
    ValueContainer,
  };

  //

  const fetchLanguages = async () => {
    let raw;
    const requestBody = {

      query: `
    query {
      languages{
        shorthand
        name
      }
    }`
    };
    try {
      await fetch('http://localhost:9000/graphql',

        {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('failed');
          }
          return res.json();
        }).then(resData => {
          console.log(resData.data.languages);
          setLanguages(resData.data.languages);
        }).catch(err => {
          throw (err);
        })
    } catch (e) {
      // throw  new Error("t");
    }
  }
  const fetchALanguages = async ({ articleId }) => {
    let raw;
    const requestBody = {

      query: `
    query {
      alanguages(aid: "${match.params.id}"){
        shorthand
        name
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }
        return res.json();
      }).then(resData => {
        console.log(resData.data.alanguages);
        if (resData.data) {
          setALanguages(resData.data.alanguages);
        }
      }).catch(err => {
        throw (err);
      })
  }


  const fetchTitle = async () => {
    let raw;


    console.log(lpreferredLanguage, match.params.id);
    const requestBody = {

      query: `
      query{
        title(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
          text
        }
      }
    `
    };
    await fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }
        return res.json();
      }).then(resData => {
        console.log(resData);
        if (resData.data.title) {
          setTitle(resData.data.title);
        } else {
          setTitle({ text: null });
        }
      }).catch(err => {
        throw (err);
      })
  }

  
  useEffectAsync(async () => {
    if (!preferredLanguage && localStorage.getItem("language")) {
      await setLang(localStorage.getItem("language"));
      await lContext.changeLanguage(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
    if (localStorage.getItem("language")) {
      await lContext.changeLanguage(localStorage.getItem("language"));
      await setLang(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
  }, [])
  useEffectAsync(async () => {
    await fetchLanguages();
    await fetchALanguages(match.params.id);
    await fetchTitle();
    //  await fetchSuggestedArticles();
    // await fetchSections();
    //  await fetchFields();
    setLoaded(true);
  }, []);
  useEffectAsync(async () => {
    setLoaded(false);
    await lContext.changeLanguage(localStorage.getItem("language"));
    await fetchTitle();
    //  await fetchFields();
    // await fetchSections();
    //  await fetchSuggestedArticles();
    // await fetchDescription();
    setLoaded(true);
  }, [preferredLanguage]);

  const toggle = async () => {
    setLang("en");
    // localStorage.setItem("language","en");
    await lContext.changeLanguage("en");
    setModal(!modal);
  }

  
  
  const createTitle = async (e) => {
    e.preventDefault();
    setLoaded(false);
    const requestBody = {

      query: `
     mutation {
       createTitle(titleInpt:{articleId:"${match.params.id}", title: "${currentTitle}", language: "${preferredLanguage}"}){
         text
       }
     }`
    };
    await fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authD.token
        }
      }
    )
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }
        return res.json();
      }).then(resData => {
        console.log(resData.data.title);
        if (resData.data.title) {
          setTitle(resData.data.title);
        } else {
          setTitle({ text: null });
        }
      }).catch(err => {
        throw (err);
      })
    await fetchTitle();

    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  }
  const createSection = async (e) => {
    e.preventDefault();
    setLoaded(false);
    const requestBody = {

      query: `
    mutation {
      createSection(articleID:"${match.params.id}", language: "${lpreferredLanguage}"){
        _id
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authD.token
        }
      }
    )
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('failed');
        }
        return res.json();
      }).then(resData => {
        console.log("");
      }).catch(err => {
        throw (err);
      })
    await fetchTitle();
    // await fetchSections();
    setET(false);
    setLoaded(true);
  }
  const changeSValue = async (value) => {
    // setModal(true);
    //  setLang(e.target.value);
    setPLanguage(value);
    await lContext.changeLanguage(value.value);

    /*  setPLanguage(value.value);
      setOpen(true);
       await lContext.changeLanguage(value.value); */
  }

  const rtlLanguage = (lpreferredLanguage === "ar" || lpreferredLanguage === "he");


  


  //  const deleteField = async (id) =>{
  //   if(fieldDeleteR === ""){
  //     nodeleteInput = true;
  //   }else{
  //     setLoaded(false);
  //     const requestBody = {

  //     query : `
  //     mutation {
  //       deleteField(fieldID: "${id}", reason: "${fieldDeleteR}"){
  //         explanation
  //       }
  //     }`
  //     };
  //     await fetch('http://localhost:9000/graphql',

  //     {
  //       method: 'POST',
  //       body: JSON.stringify(requestBody),
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer '+ authD.token
  //       }
  //     }
  //     )
  //     .then( res => {
  //       if(res.status !== 200 && res.status !== 201){
  //         throw new Error('failed');
  //       }
  //     return res.json();
  //     }).then(resData => {
  //       console.log(resData);
  //     }).catch(err => {
  //     throw(err);
  //     })
  //     await fetchFields();
  //     await fetchALanguages(match.params.id);
  //     setET(false);
  //     setLoaded(true);
  //     deletetoggle();
  //   }

  //   console.log(id);
  //  }


  let supportedLanguages = languages.map(language => ({
    value: language.shorthand,
    label: language.name
  }))
  return (
    <LangContext.Consumer>
      {lContext => {
        return (
          <div style={{ marginTop: 30 }}>
            <Grid container spacing={18}>

              <Grid item xs={4}>
                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <div className={classes.column}>
                      <Typography className={classes.heading}>
                        {title.text &&
                          <>{title.text}</>
                        }
                        {!title.text &&
                          <>{strings.untitledarticle}</>
                        }
                      </Typography>
                    </div>
                  </ExpansionPanelSummary>
                  <InfoBox
                    classes={classes} editMode={editMode}
                    authD={authD} title={title} setTitle={setTitle}
                    fetchTitle={fetchTitle}
                    articleId={match.params.id} preferredLanguage={preferredLanguage}
                    lpreferredLanguage={lpreferredLanguage} components={components}
                  />

                </ExpansionPanel>

                <ExpansionPanel defaultExpanded>
                  <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    {strings.languages}
                  </ExpansionPanelSummary>
                  <ExpansionPanelDetails className={classes.details}>
                    {alanguages.map(language => {
                      return (
                        <ListItemText primary={language.name} style={{ "margin": "0px !important", "padding:": "0px  !important" }} onClick={async () => { setLang(language.shorthand); await lContext.changeLanguage(language.shorthand); }} />
                      )
                    })}
                    {editMode &&
                      <Button
                        outline
                        variant="extended"
                        size="small"
                        color="primary"
                        aria-label="Add"
                        className={classes.margin}
                        onClick={() => setAddField(true)} style={{ marginTop: 5 }}
                        outline color="secondary">Add a new language</Button>
                    }
                  </ExpansionPanelDetails>
                </ExpansionPanel>


              </Grid>
              <Col xs="8">
                {!languageexists &&
                  <>
                    <Dialog
                      open="true"
                      TransitionComponent={Transition}
                      keepMounted
                      onClose={toggle}
                      aria-labelledby="alert-dialog-slide-title"
                      aria-describedby="alert-dialog-slide-description"
                    >
                      <DialogTitle id="alert-dialog-slide-title">{"Use Google's location service?"}</DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                          <Form >
                            <p>Select a language. Cancelling sets the language to English by default.</p>
                            <span>WikiMVC allows articles to be written in multiple languages; pick the language you want to write your articles in. P.S: you can change the settings later.</span> <br />
                            {loaded &&
                              <>
                                <Select
                                  classes={classes}
                                  options={supportedLanguages}
                                  components={components}
                                  value={PLanguage}
                                  onChange={changeSValue}
                                />
                              </>
                            }
                          </Form>

                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={toggle} color="primary">
                          Disagree
          </Button>
                        <Button onClick={toggle} color="primary">
                          Agree
          </Button>
                      </DialogActions>
                    </Dialog>
                  </>
                }
                <div className="card">
                  <div className="card-body">
                    {loaded &&
                      <>
                        {!editMode &&
                          <Button onClick={() => setEM(true)} style={{ float: "right" }} outline color="primary">{strings.editmode}</Button>
                        }
                        {editMode &&
                          <Button onClick={() => setEM(false)} style={{ float: "right" }} outline color="primary">{strings.done}</Button>
                        }
                        <Button style={{ float: "right" }} outline color="primary">Edit History</Button>

                        {!title.text &&
                          <>
                            {!editTitle &&
                              <>
                                <h3 onClick={() => setET(true)}>
                                  {strings.setTitle}
                                </h3>
                              </>
                            }
                            {editTitle &&
                              <form onSubmit={createTitle}>
                                <input type="text" onChange={(e) => setCT(e.target.value)} value={currentTitle} placeholder="Set a title for the article" />
                              </form>
                            }
                          </>
                        }
                        {title.text &&
                          <h3>{title.text}</h3>
                        }

                        <div className="jb-info">


                          <div style={{ "clear": "left" }}></div>
                        </div>
                        <div id="jb-finfo">
                          <div style={{ "clear": "right" }}></div>
                          <div>
                            <Description editMode={editMode} authD={authD} articleId={match.params.id} editDescrition={editDescrition} setED={setED} />

                            <List style={{width:"35%"}} component="nav" className={classes.root}>
                              {sections.map(section => {
                                return (

                                  <ListItem button>

                                    <ListItemText inset primary={
                                      section.title ? section.title : "Untitled section"
                                    } />
                                  </ListItem>



                                )
                              
                              })}
                            </List>
                            <Sections classes={classes} articleId={match.params.id} authD={authD} sections={sections} />



                              {editMode &&
                                <>
                                  <Button
                                    outline
                                    variant="extended"
                                    size="small"
                                    color="primary"
                                    aria-label="Add"
                                    className={classes.margin}
                                    onClick={createSection}
                                  >
                                    <AddIcon className={classes.extendedIcon} />
                                    New section
        </Button>
                                </>
                              }
                          </div>
                          </div>
                      </>}
  
                    {!loaded && <>
                          <div class="sk-folding-cube">
                            <div class="sk-cube1 sk-cube"></div>
                            <div class="sk-cube2 sk-cube"></div>
                            <div class="sk-cube4 sk-cube"></div>
                            <div class="sk-cube3 sk-cube"></div>
                          </div>
                        </>}
                      </div>
                </div>
    
              </Col>
            </Grid>
          </div>
              )
            }}
    </LangContext.Consumer>
            )
          }
          export default Article;
