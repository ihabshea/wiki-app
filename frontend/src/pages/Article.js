
import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import strings from '../language/localization';
import LangContext from '../language/languageContext';
import {theme, useStyles} from '../theme/theme';
import { ThemeProvider } from "@material-ui/styles";
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import InputBase from '@material-ui/core/InputBase';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import Chip from '@material-ui/core/Chip';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
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
  Alert,
  DropdownMenu,Table,
  DropdownItem,
Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, InputGroupAddon,
Col, Row, Form, Container, FormGroup, Label, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';

const Article = ({match}) => {
  let nodeleteInput = false;
  const classes = useStyles();
  const lContext = useContext(LangContext);
  const authD =  useContext(AuthContext);
  const [fields, reloadFields] = useState([]);
  const [fieldDeleteR, setDR] = useState("");
  const [fieldForm, setFieldForm] = useState([{fieldname: "en",  fieldvalue:"English"}]);
  const [preferredLanguage,setLang] = useState(null);
  const [addField, setAddField] =  useState(false);
  const [editMode, setEM] = useState(false);
  const [modal, setModal] = useState(true);
  const [sectionedit, setSE] = useState(null);
  const [EFV, setEFV] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState({text: null});
  const [editTitle, setET] = useState(false);
  const [currentTitle, setCT] = useState('');
  const [description, setDescription] = useState({text: null});
  const [editDescrition, setED] = useState(false);
  const [deletemodal, setDeleteModal] = useState(false);
  const [sections, retrieveSections] = useState([]);
  const [currentDescription, setCD] = useState('');
  const [sectionTitle,  setST] =  useState('');
  const [sectionDeleteDialog, setSDD] = useState(false); 
  const [sectionContent, setSC] = useState('');
  const [sectionCID, setSCID] = useState(null);
  const [languages, setLanguages] = useState([{shorthand: "en",  name:"English"}]);
  const [alanguages, setALanguages] = useState([{shorthand: "en",  name:"English"}]);
  const [editableField, setEF] = useState(null);
  const fetchLanguages = async() => {
    let raw;
    const requestBody = {

    query : `
    query {
      languages{
        shorthand
        name
      }
    }`
  };
  try{
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
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
    console.log(resData.data.languages);
    setLanguages(resData.data.languages);
  }).catch(err => {
    throw(err);
  })
}catch(e){
  // throw  new Error("t");
}
  }
  const fetchALanguages = async({articleId}) => {
    let raw;
    const requestBody = {

    query : `
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData.data.alanguages);
    setALanguages(resData.data.alanguages);
  }).catch(err => {
    throw(err);
  })
  }
  const fetchTitle = async() => {
    let raw;

   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
  }).catch(err => {
    throw(err);
  })
  }
  const fetchFields = async() => {
  
   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
      query{
        fields(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
          _id
          name
          value
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData);
    if(resData.data.fields){
      reloadFields(resData.data.fields);
    }
  }).catch(err => {
    throw(err);
  })
  }
  const fetchDescription = async() => {
    let raw;

   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
      query{
        description(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData);
    if(resData.data.description){
      setDescription(resData.data.description);
    }else{
      setDescription({text: null});
    }
  }).catch(err => {
    throw(err);
  })
  }
  useEffectAsync(async ()=> {
    if(!preferredLanguage && localStorage.getItem("language")){
      await setLang(localStorage.getItem("language"));
      await lContext.changeLanguage(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
    if(localStorage.getItem("language")){
      await lContext.changeLanguage(localStorage.getItem("language"));
      await setLang(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
  },[])
  useEffectAsync(async () => {

     await  fetchLanguages();
     await fetchALanguages(match.params.id);
     await fetchTitle();
     await fetchSections();
     await fetchFields();
     await fetchDescription();
    setLoaded(true);
  },[]);
  useEffectAsync(async() => {
    setLoaded(false);
     await lContext.changeLanguage(localStorage.getItem("language"));
     await fetchTitle();
     await fetchFields();
     await fetchSections();
     await fetchDescription();
    setLoaded(true);

  },[preferredLanguage]);

  const toggle = async () => {
    setLang("en");
    // localStorage.setItem("language","en");
    await lContext.changeLanguage("en");
     setModal(!modal);
   }
   const changeFieldProp =  (e) => {
    const name = e.target.name;
    const value = e.target.value;
     setFieldForm(fieldForm => {  return {...fieldForm, [name]:value} })
   }
   const createDescription = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       createDescription(descriptionInput:{articleId:"${match.params.id}", text: "${currentDescription}", language: "${preferredLanguage}"}){
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.description);
     setDescription(resData.data.description);
     }).catch(err => {
     throw(err);
     })

     setED(false);
     await fetchDescription();
     await fetchALanguages(match.params.id);
     setLoaded(true);

   }
   const updateDescription = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       updateDescription(descriptionInput:{articleId:"${match.params.id}", text: "${currentDescription}", language: "${preferredLanguage}"}){
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.description);
     setDescription(resData.data.description);
     }).catch(err => {
     throw(err);
     })

     setED(false);
     await fetchDescription();
     setLoaded(true);

   }
   const createTitle = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.title);
     if(resData.data.title){
       setTitle(resData.data.title);
     }else{
       setTitle({text: null});
     }
     }).catch(err => {
     throw(err);
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

    query : `
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
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
      console.log("");
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchSections();
    setET(false);
    setLoaded(true);
  }
   const changeSValue = async (e) => {
     e.preventDefault();
     setModal(true);
    //  setLang(e.target.value);
     await LangContext.changeLanguage(e.target.value);
   }
   const lpreferredLanguage = localStorage.getItem("language");
   const rtlLanguage =( lpreferredLanguage === "ar" ||lpreferredLanguage === "he");
   const createAField = async () => {
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       createField(fieldInput:{articleId:"${match.params.id}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}"}){
         name
         value
       }
     }`
     };
     await fetch('http://localhost:9000/graphql',

     {
       method: 'POST',
       body: JSON.stringify(requestBody),
       headers: {
         'Content-Type': 'application/json',
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.title);
     if(resData.data.title){
       setTitle(resData.data.title);
     }else{
       setTitle({text: null});
     }
     }).catch(err => {
     throw(err);
     })
     await fetchTitle();
     await fetchDescription();
     await fetchFields();
     await fetchALanguages(match.params.id);
     setET(false);
     setLoaded(true);
   }
   const updateField = async (id) => {
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      updateField(fieldID: "${id}",  newvalue: "${EFV}"){
        name
        value
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
    console.log(resData.data.title);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchDescription();
    await fetchFields();
    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  }
   const createField = async (e) => {
    e.preventDefault();
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      createField(fieldInput:{articleId:"${match.params.id}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}"}){
        name
        value
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
    console.log(resData.data.title);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
    }).catch(err => {
    throw(err);
    })
    await fetchFields();
    setET(false);
    setLoaded(true);
  }
  const fetchSections = async() => {
    setLoaded(false);
    const requestBody = {

    query : `
    query {
      sections(articleID: "${match.params.id}", language: "${lpreferredLanguage}"){
        _id
        title
        content
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
      console.log(resData);
      retrieveSections(resData.data.sections);
    }).catch(err => {
    throw(err);
    })

    setLoaded(true);
  }
  const updateSectionTitle =  async(id) => {
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      updateSectionTitle(sectionID: "${id}", title: "${sectionTitle}"){
        title
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
    console.log(resData.data.title);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchSections();

    await fetchFields();
    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  }
  const deleteSection = async(id) => {
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      deleteSection(sectionID: "${id}"){
        section{
          _id
        }
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
      
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchSections();
    await fetchFields();
    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  };
  const updateSectionContent =  async(id) => {
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      updateSectionContent(sectionID: "${id}", content: """${sectionContent}"""){
        title
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
    console.log(resData.data.title);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchSections();

    await fetchFields();
    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  }
  const deleteField = async (id) => {
    setLoaded(false);
    const requestBody = {

    query : `
    mutation {
      deleteField(fieldID: "${id}", reason: "${fieldDeleteR}"){
        explanation
      }
    }`
    };
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer '+ authD.token
      }
    }
    )
    .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
    return res.json();
    }).then(resData => {
    console.log(resData.data.title);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
    }).catch(err => {
    throw(err);
    })
    await fetchTitle();
    await fetchSections();

    await fetchFields();
    await fetchALanguages(match.params.id);
    setET(false);
    setLoaded(true);
  }
   const enterSubmit = (event) =>{
     event.preventDefault();
     
    // if (event.keyCode === 13) {
    //   event.preventDefault();
     
    // }
     createAField();
     setAddField(false);
     setFieldForm(["",""]);
   }

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
   const deletetoggle = () => {
      setDeleteModal(!deletemodal);
   }
  return (
    <LangContext.Consumer>
      {lContext => {
        return (
        <div style={{marginTop:30}}>
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
        <ExpansionPanelDetails className={classes.details}>
        {loaded && 
        <>
        <List style={{paddingTop:"1px"}}  className={classes.root}>
        {fields.map((field) => {  
          let fieldid = field._id;
              return (
                fieldid != editableField ?

                <ListItem style={{padding:"5px"}}>
                  <ListItemText primary={field.name} secondary={field.value} />
                  {editMode && 
                      <>
                      <i onClick={() => { setEF(field._id); setEFV(field.value);   } } style={{cursor:"pointer"}} class="material-icons">
                      edit
                      </i>

                      </>
                  }
                </ListItem>
                :
                <>
                <ListItem style={{padding:"5px"}}>
                {editMode && 
                <FormControl className={classes.margin}>
   
        <TextField
          label={field.name}
          value={EFV}
          onChange={(e) => setEFV(e.target.value)}
          classes={{
            underline: classes.cssUnderline,
          }}
          
        />
      </FormControl>
                }
      <ListItemSecondaryAction>
        <IconButton onClick={() => { updateField(field._id) }}  aria-label="Delete">
          <i class="material-icons">
                save
          </i>
        </IconButton>
         <IconButton onClick={deletetoggle}  aria-label="Delete">
          <i class="material-icons">
                delete
          </i>
        </IconButton>

        <Dialog
        open={deletemodal}
        onClose={deletetoggle}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{strings.deleteField}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          {strings.providedeletereason}
                  
                  <Input type="textarea" value={fieldDeleteR} onChange={(e)=>setDR(e.target.value)} />
                  {nodeleteInput && 
                     <Alert color="danger">
                     {strings.youhavetodeletereason}
                    </Alert>
                  }
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={deletetoggle} color="primary">
            {strings.cancel}
          </Button>
          <Button onClick={() => deleteField(field._id)}  color="primary" autoFocus>
            {strings.delete}
          </Button>
        </DialogActions>
      </Dialog>
       </ListItemSecondaryAction>
               
                </ListItem>
                </>
                
              )
        })}
                  {editMode && 
          <>
          {addField && 
           <form onSubmit={createField}>
             <FormControl className={classes.margin}>
        <InputLabel
          htmlFor="custom-css-standard-input"
          classes={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
        >
          {strings.name}
        </InputLabel>
        <Input name="fieldname"
        onChange={changeFieldProp} value={fieldForm.fieldname}
          id="custom-css-standard-input"
          classes={{
            underline: classes.cssUnderline,
          }}
        />
      </FormControl>
      <FormControl className={classes.margin}>
        <InputLabel
          htmlFor="custom-css-standard-input"
          classes={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
        >
         Field Value
        </InputLabel>
        <Input name="fieldvalue"
        onChange={changeFieldProp} value={fieldForm.fieldvalue}
          id="custom-css-standard-input"
          classes={{
            underline: classes.cssUnderline,
          }}
        />
      </FormControl>
            {/* <table>
              <tr>
               
                    <td style={{width:"30%"}}><input style={{width:"100%"}} name="fieldname" onChange={changeFieldProp} value={fieldForm.fieldname} placeholder={strings.name} /></td>
                    <td style={{width:"70%"}}><input onKeyUp={enterSubmit} style={{width:"100%"}} name="fieldvalue" onChange={changeFieldProp} value={fieldForm.fieldvalue}  placeholder={strings.value}/></td>
      
              </tr>
            </table> */}
                   <Divider />
        <ExpansionPanelActions>
          <Button size="small">Cancel</Button>
          <Button onClick={enterSubmit} size="small" color="primary">
            Save
          </Button>
        </ExpansionPanelActions>
            </form> 
          }
          {!addField &&
                 <Button
                 outline
     variant="extended"
     size="small"
     color="primary"
     aria-label="Add"
     className={classes.margin}
   onClick={() => setAddField(true)} style={{marginTop:5}} outline color="secondary">{strings.addfield}</Button>
          }
          </>
          }
              </List>
            </>
            }
            {!loaded && 
                  <div class="sk-folding-cube">
                  <div class="sk-cube1 sk-cube"></div>
                  <div class="sk-cube2 sk-cube"></div>
                  <div class="sk-cube4 sk-cube"></div>
                  <div class="sk-cube3 sk-cube"></div>
                </div>  
            }
        </ExpansionPanelDetails>
     
              </ExpansionPanel>
        {/* <div class="card">
          <div class="card-header">
      
            {title.text &&
              <>{title.text}</>
            }
            {!title.text &&
              <>{strings.untitledarticle}</>
            }
          </div>
          <div className="card-body" style={{padding:0}}>
          <Table>
            {fields.map((field) => {  
              return (
                <tr style={{padding:15}}>
                  <td style={{width:"30%"}}>{field.name}</td>
                  <td style={{width:"70%"}}>{field.value}  
            {editMode &&  
              <>
              <Button  onClick={deletetoggle} close aria-label="Cancel">
                <span aria-hidden>&ndash;</span>
              </Button>
        
              <Modal isOpen={deletemodal} toggle={deletetoggle}>
                <ModalHeader toggle={deletetoggle}>{strings.whatup}</ModalHeader>
                <ModalBody>
                  {strings.providedeletereason}
                  
                  <Input type="textarea" value={fieldDeleteR} onChange={(e)=>setDR(e.target.value)} />
                  {nodeleteInput && 
                     <Alert color="danger">
                     {strings.youhavetodeletereason}
                    </Alert>
                  }
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" onClick={deleteField(field._id)}>{strings.confirm}</Button>{' '}
                  <Button color="secondary" onClick={deletetoggle}>{strings.cancel}</Button>
                </ModalFooter>
              </Modal>
              </>
            }
            </td>
                </tr>

              )
            })}
          </Table>
          {editMode && 
          <>
          {addField && 
           <form onSubmit={createField}>
            <table>
              <tr>
               
                    <td style={{width:"30%"}}><input style={{width:"100%"}} name="fieldname" onChange={changeFieldProp} value={fieldForm.fieldname} placeholder={strings.name} /></td>
                    <td style={{width:"70%"}}><input onKeyUp={enterSubmit} style={{width:"100%"}} name="fieldvalue" onChange={changeFieldProp} value={fieldForm.fieldvalue}  placeholder={strings.value}/></td>
      
              </tr>
            </table>
            </form>
          }
          {!addField &&
            <Button onClick={() => setAddField(true)} style={{marginTop:5}} outline color="secondary">{strings.addfield}</Button>
          }
          </>
          }
          </div>
        </div> */}
        <ExpansionPanel defaultExpanded>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            {strings.languages}
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          {alanguages.map(language => {
            return(

              <ListItemText primary={language.name} style={{"margin":"0px !important", "padding:": "0px  !important"}} onClick={async () => {setLang(language.shorthand); await lContext.changeLanguage(language.shorthand);  }} />

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
 onClick={() => setAddField(true)} style={{marginTop:5}}
  outline color="secondary">Add a new language</Button>

         }
        </ExpansionPanelDetails>
          </ExpansionPanel>
        

        </Grid>
        <Col xs="8">
        {!lpreferredLanguage && <>
          <Modal isOpen="true" >
          <ModalHeader >Select a Preferred Language</ModalHeader>
          <ModalBody>
          <Form >
          <p>Select a language. Cancelling sets the language to English by default.</p>
          <span>WikiMVC allows articles to be written in multiple languages; pick the language you want to write your articles in. P.S: you can change the settings later.</span> <br/>
          {!loaded && <>
            <div class="sk-folding-cube">
              <div class="sk-cube1 sk-cube"></div>
              <div class="sk-cube2 sk-cube"></div>
              <div class="sk-cube4 sk-cube"></div>
              <div class="sk-cube3 sk-cube"></div>
            </div>

          </>}
          {loaded && <>
            <select onChange={changeSValue} name="slanguage">
            {languages.map(language => {
                return(<option value={language.shorthand}>{language.name}</option>)
            })}

            </select>
            </>
          }
          </Form>

          </ModalBody>
          <ModalFooter>
            <button onClick={async (e) => { if (!preferredLanguage){
                // setLang("en");
                // localStorage.setItem("language","en");
                await lContext.changeLanguage("en");
                setModal(false);
              }else{
                // localStorage.setItem("language",preferredLanguage);
                await lContext.changeLanguage(localStorage.getItem("language"));
                setModal(false);
              }
              }
            } color="primary" >Done</button>{' '}
            <Button color="secondary" onClick={toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
          </>
        }
        <div className="card">
          <div className="card-body">
          {loaded && <>
            {!editMode && 
              <Button onClick={() => setEM(true)} style={{float:"right"}} outline color="primary">{strings.editmode}</Button>
            }
            {editMode && 
              <Button onClick={() => setEM(false)} style={{float:"right"}} outline color="primary">{strings.done}</Button>
            }
              <Button style={{float:"right"}} outline color="primary">Edit History</Button>

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


                          <div style={{"clear":"left"}}></div>
            </div>
            <div id="jb-finfo">
              <div style={{"clear":"right"}}></div>
              <div>
              {!description.text &&
                <>
                {!editDescrition &&
                <>
                <p onClick={() => setED(true)}>
                Set a description for the article
                </p>
                </>
                }
                {editDescrition &&
                  <form onSubmit={createDescription}>
                  <textarea onChange={(e) => setCD(e.target.value)} value={currentDescription}  />
                  <input type="submit" />
                  </form>
                }
                </>
              }
              {description.text &&
                <p>{description.text}</p>
              }
              {/* <h4 style={{marginBottom:0}}>Test</h4>
              <Divider style={{width:"100%", marginLeft:0, marginBottom:5}} variant="middle" />
              <p>What up?</p> */}
              {sections.map(section => {
                let sectionid = section._id;
                return(
                <>
                  <h4 style={{marginBottom:0}}>
                  {section.title? 
                  <>
                  {section.title}
                  
                  {editMode &&
                    <>
                          <IconButton onClick={() => setSDD(!sectionDeleteDialog)}  aria-label="Delete">
          <i class="material-icons">
                delete
          </i>
        </IconButton>
                          <Dialog
        open={sectionDeleteDialog}
        onClose={() => setSDD(!sectionDeleteDialog)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete sectoin"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSDD(!sectionDeleteDialog)} color="primary">
            No
          </Button>
          <Button onClick={() => deleteSection(section._id)} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
                    </>
                  }
                  </>: 
                
                  <>
                  {sectionid != sectionedit ?
                    <span onClick={() => setSE(sectionid)} style={{cursor:"pointer"}}>
                    Untitled Section
                    </span>
                  :
                  <>
                    <FormControl className={classes.margin}>
        <InputLabel
          htmlFor="custom-css-standard-input"
          classes={{
            root: classes.cssLabel,
            focused: classes.cssFocused,
          }}
        >
          Section  Title
        </InputLabel>
        
        <Input
          id="custom-css-standard-input"
          value={sectionTitle}  
          onChange={(e) => setST(e.target.value)}
          classes={{
            underline: classes.cssUnderline,
          }}
        />
        <IconButton onClick={() => { updateSectionTitle(section._id) }}  aria-label="update">
          <i class="material-icons">
                save
          </i>
        </IconButton>
      </FormControl>
                  </>
                  }
                  
                  </>
                  
                  }
                  </h4>
              <Divider style={{width:"100%", marginLeft:0, marginBottom:5}} variant="middle" />
              <p>{section.content? <>{section.content}</>:
              sectionid != sectionCID ?
              <>
              
              <span onClick={() => setSCID(section._id)} style={{cursor:"pointer"}}>
                Write in this section.
              </span>
              </>
              :
              <>
                      <TextField
                        style={{width:"100%"}}
                        id="filled-multiline-flexible"
                        label="Section content"
                        multiline
                        rowsMax="4"
                        value={sectionContent}
                        onChange={(e) => setSC(e.target.value)}
                        className={classes.textField}
                        margin="normal"
                        helperText="hello"
                        variant="filled"
                      />
                         <IconButton onClick={() => { updateSectionContent(section._id) }}  aria-label="update">
          <i class="material-icons">
                save
          </i>
        </IconButton>
              </> 
            }</p>
                </>
                )
              })}



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
