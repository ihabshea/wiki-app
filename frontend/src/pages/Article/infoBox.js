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
import CreateField from './createField';
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

    const [addField, setAddField] =  useState(false);


    const [EFV, setEFV] = useState('');

    const [editableField, setEF] = useState(null);
    const [loaded, setLoaded] = useState(false);


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
  
     useEffectAsync(async () => {
        await fetchFields();

        setLoaded(true);
     }, [preferredLanguage]);
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
  
    return (
        <ExpansionPanelDetails className={classes.details}>
        {loaded && 
        <>
        <List style={{paddingTop:"1px"}}  className={classes.root}>
            <Fields isDead={isDead} birthDate={birthDate} classes={classes}  nodeleteInput={nodeleteInput} deleteField={deleteField} updateField={updateField} editMode={editMode} fields={fields} fetchTitle={fetchTitle} />
         {editMode && 
          <>
          {addField && 
          <CreateField 
          authD={authD} setTitle={setTitle} fetchTitle={fetchTitle} 
          fetchFields={fetchFields}  components={components} 
          setLoaded={setLoaded}
          preferredLanguage={preferredLanguage} lpreferredLanguage={lpreferredLanguage}
           classes={classes} setAddField={setAddField} articleId={articleId} />
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