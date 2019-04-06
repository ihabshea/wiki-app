import React, { useReducer, useContext, useState, useEffect } from 'react';
// import AuthContext from '../context/auth';
import useEffectAsync from '../../helpers/useEffectAsync';
import strings from '../../language/localization';
import Moment from 'react-moment';
import Fields from './fields.js';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import FilledInput from '@material-ui/core/FilledInput';
// import {theme, useStyles} from '../theme/theme';

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
// import InfoBox from 'Article/infoBox';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
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
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import {Alert} from 'reactstrap';
const InfoBox = ({classes, editMode, authD, title, setTitle, fetchTitle,
     articleId, preferredLanguage, lpreferredLanguage,
     components
    }) => {
  let nodeleteInput = false;

    const [fields, reloadFields] = useState([]);
    const [isDead, setDead] = useState(false);
    const [birthDate, setBD] = useState(null);
    const [fieldDeleteR, setDR] = useState("");
    const [refArticle, setRA] = useState({value: null});
    const [suggestedArticles, setSAs] = useState([]);
    const [specialField, setSpF] = useState(false);
    const [objectField, setObjF] = useState(false);
    const [dateField, setDF] = useState(false);
    const [sDateField, setSDF] = useState(2);
    const [addField, setAddField] =  useState(false);
    const [fieldObject, setfObj] = useState([]);

    const [EFV, setEFV] = useState('');
    const [degree, setDG] = useState(null);
    const [fieldForm, setFieldForm] = useState([{fieldname: "en",  fieldvalue:"English"}]);
    const [activeStep, setActiveStep] = useState(0);
    const [open, setOpen] = React.useState(false);
    const [wizardDialog, setWZD] = useState(false);
    const [fieldC,  setFieldC] = useState(null);
    const [editableField, setEF] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [endedDeath, setEndDead] = useState(false);

    const [deletemodal, setDeleteModal] = useState(false);
    const [currentFieldType, setFT] = useState({value: null, key:null});

    const [institution, setIN] = useState(null);

//   const classes = useStyles();
    

const fetchFields = async() => {
  
    let lpreferredLanguage = localStorage.getItem("language");
    // console.log(lpreferredLanguage,articleId);
    
     const requestBody = {
 
     query : `
       query{
         fields(articleID:"${articleId}", language:"${lpreferredLanguage}"){
           _id
           name
           value
           special
           objects{
             _id
             type
             value
             refArticle{
               _id
               title{
                 text
               }
             }
           }
           articleRef{
             _id
             title{
               text
             }
           }
           type
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
       resData.data.fields.map(
         (field) => {
           if(field.type === "death"){
             setDead(true);
           }
           if(field.type === "birth"){
             setBD(field.value);
           }
         }
       )
     }
   }).catch(err => {
     throw(err);
   })
   }
    const deletetoggle = () => {
        setDeleteModal(!deletemodal);
     }
     useEffectAsync(async () => {
        await fetchFields();
        
        await fetchSuggestedArticles();
        setLoaded(true);
     }, [preferredLanguage]);
     const fetchSuggestedArticles = async() => {
        let raw;
        
        const requestBody = {
    
        query : `
        query{
          findArticlesByLanguage(language: "${lpreferredLanguage}"){
            _id
            title{
              text
            }
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
        if(resData.data){
          setSAs(resData.data.findArticlesByLanguage);
        }
      }).catch(err => {
        throw(err);
      })
    }catch(e){
      // throw  new Error("t");
    }
      }
     const deleteField = async (id) => {
        setLoaded(false);
        const requestBody = {
    
        query : `
        mutation {
          deleteField(fieldID: "${id}", reason: "${fieldDeleteR}", language: "${lpreferredLanguage}"){
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
        // await fetchSections();
    
        await fetchFields();
        // await fetchALanguages(articleId);
        // setET(false);
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

  const handleChangeS = (value) => {
    setRA(value);
  }
  const createAField = async () => {
    setLoaded(false);
   let query;
   if(specialField){
     query = `
     mutation {
     createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${refArticle.value}", language: "${preferredLanguage}", special: ${specialField}, articleRef: "${refArticle.value}" type:"${currentFieldType.value}"} ){
      name
      value
    }
  }`;
   
 }else{
     query =  `
     mutation {
       createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}", special: ${specialField}, articleRef: "${refArticle.value}", type:"${currentFieldType.value}"}){
         name
         value
       }
     }`;
   }
    const requestBody = {
    query : query
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
    // await fetchTitle();
    // await fetchDescription();
    await fetchFields();
    // await fetchALanguages(articleId);
    // setET(false);
    setLoaded(true);
  }
  const createObjectField = async() => {
    const fieldQuery = `
    mutation{
      createBlankField(articleId: "${articleId}", language: "${lpreferredLanguage}", name: "${fieldForm.fieldname}", type:"${currentFieldType.value}"){
        _id
        name
      }
    }
    `;
    const requestBody = {

      query : fieldQuery
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
        Object.keys(fieldObject).map( async(key) => {
          let objectQuery;
          if(key === "partner"){
            objectQuery = `
            mutation {
              createObject(fieldId:"${resData.data.createBlankField._id}", refArticle: "${fieldObject[key].value}", value: "${fieldObject[key].value}",  type: "${key}"){
                type
                value
              }
           }
            `;
          }else{
           objectQuery = `
          mutation {
            createObject(fieldId:"${resData.data.createBlankField._id}", value: "${fieldObject[key]}", type: "${key}"){
              type
              value
            }
         }`;
        }
         const OrequestBody = {

          query : objectQuery
          };
          await fetch('http://localhost:9000/graphql',
          {
            method: 'POST',
            body: JSON.stringify(OrequestBody),
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

          });
        });
      }).catch(err => {
        throw(err);
      })
      await fetchTitle();
    //   await fetchDescription();
      await fetchFields();
    //   await fetchALanguages(articleId);
    //   setET(false);/
      setLoaded(true);
  
   
   }


       const changeFieldProp =  (e) => {
        const name = e.target.name;
        const value = e.target.value;
         setFieldForm(fieldForm => {  return {...fieldForm, [name]:value} })
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
        // await fetchDescription();
        await fetchFields();
        // await fetchALanguages(articleId);
        // setET(false);
        setEF(null);
        setLoaded(true);
      }
       const createField = async (e) => {
        e.preventDefault();
        setLoaded(false);
        const requestBody = {
    
        query : `
        mutation {
          createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}"}){
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
        // setET(false);
        setLoaded(true);
      }
      let suggestions;
  if(suggestedArticles){
    suggestions = suggestedArticles.map((article) => ({
        value: article._id,
        label: article.title.text
    }));
  }
  const fieldsuggestions = [
    {key: "birth", value: "Birthdate"},
    {key: "death", value: "Death date"},
    {key: "spouse", value: "Spouse/Partner"},
    {key: "education", value: "Education"},
    {key: "list", value: "Generic List"}
  ].map(suggestion => ({
    value: suggestion.key,
    label: suggestion.value,
  }));
  const degreesuggestions = [
    {key: "BA"},
    {key: "BSc"},
    {key: "MSc"},
    {key: "MBA"},
    {key: "PhD"},
  ].map(suggestion => ({
    value: suggestion.key,
    label: suggestion.key,
  }));
  const handleClose = () => {
    setOpen(false);
  }

  const handleOpen = () => {
    setOpen(true);
  }

  const WizardStep1 = () =>
  {
  return(
    <>
          Please choose one of the pre-built field types.
          <Select
          classes={classes}
          options={fieldsuggestions}
          components={components}
          value={currentFieldType}
          onChange={handleChangeL}
        /> 
    </>
  );
  }
  let isbirth = currentFieldType.value === "birth";
  let isdeath = currentFieldType.value === "death";
  let isspouse = currentFieldType.value === "spouse";
  let iseducation = currentFieldType.value === "education";
  let islist = currentFieldType.value === "list";
  
  const WizardStep2 = () => 
  {
  return(
    <>
        {isbirth && 
          <>
          Pick a birthdate. This is helpful because it dynamically changes the age of the person. Helpful with death date (if it exists).
          </>
        }
        {isdeath &&
          <>

          </>
        }
    </>
  );
  }
  const WizardStep3 = () =>
  { return(
    <>
        {isbirth && 
          <>
       <TextField
        id="date"
        label="Birthday"
        type="date"
        onChange={(e) => setFieldForm((fieldform) => { return{...fieldForm, ["fieldvalue"]: e.target.value}})}
        value={fieldForm.fieldvalue}
        InputLabelProps={{
          shrink: true,
        }}
      />
          </>
        }
        {isdeath && 
          <>
         <TextField
            id="date"
            label="Death date"
            type="date"
            onChange={(e) => setFieldForm((fieldform) => { return{...fieldForm, ["fieldvalue"]: e.target.value}})}
            value={fieldForm.fieldvalue}
            InputLabelProps={{
              shrink: true,
            }}
          />
          </>
        }
         {isspouse && 
         <>
        <Select
          classes={classes}
          options={suggestions}
          components={components}
          value={fieldObject.partner}
          onChange={handleChangeP}
          placeholder="Search for a person"
        />
        <TextField
        label="Started"
        type="year"
        onChange={(e) => setfObj((fieldObject) => { return{...fieldObject, ["started"]: e.target.value}})}
        value={fieldObject.started}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <TextField
        label="Ended"
        type="year"
        onChange={(e) => setfObj((fieldObject) => { return{...fieldObject, ["ended"]: e.target.value}})}
        value={fieldObject.ended}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={endedDeath}
            onChange={async() => { 
               await setEndDead(!endedDeath);
               setfObj((fieldObject) => 
               { 
                 return{...fieldObject, ["death"]: endedDeath}
               })
            } 
          }
            color="primary"
          />
        }
        label="Relationship ended because of death"
      />

        </>
         }
        {iseducation &&
          <>
              <Select
              classes={classes}
              options={degreesuggestions}
              components={components}
              value={fieldObject.partner}
              onChange={handleChangeDg}
              placeholder="What degree?"
            />
            <Select
              classes={classes}
              options={degreesuggestions}
              components={components}
              value={fieldObject.partner}
              onChange={handleChangeSc}
              placeholder="What degree?"
            />
          </>
        }
    </>
  ); }
  const ErrorStep = () =>
  { return(
    <>
        TBD
    </>
  ); }
  const GetStep = () => {
    switch(activeStep){
      case 0:
      return (
        <>
        <WizardStep1 />
        </>
      );
      case 1:
      return (
        <>
        <WizardStep2 />
        </>
      );
      case 2:
      return (
        <>
        <WizardStep3 />
        </>
      );
      default:
      return (
        <>
        <ErrorStep />
        </>
      );
    }
  }
  let notfinal = (activeStep === 0 | activeStep === 1);
  const handleChangeL = (value) => {
    setFT(value);
    if(value === "spouse"){
      setObjF(true);
    }
  }

  const handleChangeDg = (value) => {
    setDG(value);
  }
  const handleChangeSc = (value) => {
    setIN(value);
  }
  const handleChangeP = (value) => {
    setObjF(true);
    setfObj((fieldObject) => { return {...fieldObject, ["partner"]: value} })
  }
    return (
        <ExpansionPanelDetails className={classes.details}>
        {loaded && 
        <>
        <List style={{paddingTop:"1px"}}  className={classes.root}>
            <Fields classes={classes} deletetoggle={deletetoggle} nodeleteInput={nodeleteInput} deleteField={deleteField} updateField={updateField} editMode={editMode} fields={fields} />
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

      <>
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
      </>


      <>
      
      <Button variant="outlined" color="primary" onClick={() => setWZD(true)}>
        Launch Wizard
      </Button>
      <Dialog open={wizardDialog} onClose={() => setWZD(false)} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
          <Stepper activeStep={activeStep} alternativeLabel>
          <Step key="Starting Out">
            <StepLabel>
              Starting Out
            </StepLabel>
          </Step>
          <Step key="Help">
            <StepLabel>
              Help
            </StepLabel>
            </Step> 
            <Step key="Finish">
            <StepLabel>
              Finish
            </StepLabel>
           
          </Step> 
        
    
      </Stepper>
      <GetStep /> 

          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWZD(false)} color="primary">
            Cancel
          </Button>

          
          {notfinal &&
               <Button onClick={() => setActiveStep(activeStep +1)}color="primary">
                    Continue
               </Button>
          }
          {!notfinal && 
                   <Button onClick={() => {  if(isspouse){ createObjectField(); }else{ createAField(); } setWZD(false); }}color="primary">
                           Finish
                    </Button>
          }

        </DialogActions>
      </Dialog>
       {/* <Select
          classes={classes}
          options={suggestions}
          components={components}
          value={refArticle}
          onChange={handleChangeS}
          placeholder="Search a country (start with a)"
        /> */}
      </>            
      

       <FormControlLabel
          control={<Switch checked={specialField} onChange={(() => setSpF(!specialField))} />}
          label="Wizard"
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
    );
}
export default InfoBox;