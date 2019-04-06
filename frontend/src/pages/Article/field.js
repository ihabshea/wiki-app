import React, { useReducer, useContext, useState, useEffect } from 'react';
import useEffectAsync from '../../helpers/useEffectAsync';
import strings from '../../language/localization';
import Moment from 'react-moment';
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
const Field = ({field, editMode, classes, updateField,deleteField,deletetoggle,nodeleteInput}) => {
    const [isDead, setDead] = useState(false);
    const [birthDate, setBD] = useState(null);
    const [fieldDeleteR, setDR] = useState("");

    const [deletemodal, setDeleteModal] = useState(false);
  const [EFV, setEFV] = useState('');
  const [degree, setDG] = useState(null);
  const [fieldForm, setFieldForm] = useState([{fieldname: "en",  fieldvalue:"English"}]);
  const [activeStep, setActiveStep] = useState(0);
  const [open, setOpen] = React.useState(false);
  const [wizardDialog, setWZD] = useState(false);
  const [fieldC,  setFieldC] = useState(null);

  const [loaded, setLoaded] = useState(false);
  const [endedDeath, setEndDead] = useState(false);
    const [editableField, setEF] = useState(null);
    let fieldid = field._id;
    let value = field.special ? <a href={`/article/${field.articleRef._id}`}>{field.articleRef.title.text}</a> : field.value
    let isbirth = field.type === "birth";
    let isdeath = field.type === "death";
    let isspouse = field.type === "spouse";
    let isnormal = field.type === "" || field.type === null;
    let age;
    let ageAtDeath;
    if(isbirth){
      age = <Moment fromNow ago>{field.value}</Moment>
    }
    if(isdeath){
      ageAtDeath = <Moment from={field.value} ago>{birthDate}</Moment>
    }
    return(
        

              fieldid != editableField ?
              
              <ListItem style={{padding:"5px"}}>
                <ListItemText primary={field.name} secondary={
                  <>
                  {isbirth &&
                    <>
                    {field.value} {!isDead && <> ({age}) </>}
                    </>
                  }
                  {isdeath &&
                    <>
                    {field.value} ({ageAtDeath})
                    </>
                  }
                  {isspouse &&
                    <>
                      {
                        field.objects.map(object => {
                          let ispartner = object.type === "partner";
                          let isstarted = object.type === "started";
                          let isfinished = object.type === "ended";
                          let isenddead = object.type === "death";
  
                          return (
                            <>
                              {ispartner && 
                                <>
                                <a href={`/article/${object.refArticle._id}`}>{object.refArticle.title.text}</a>
                                </>
                              }
                              {' '}
                              {isstarted &&
                                <>
                                
                                  {object.value} -
                                
                                </>
                          
                              }
                              {' '}
                              {isenddead &&
                                <>
                                  died
                                </>
                              }
                              {' '}
                              {isfinished &&
                                <>
                                  {object.value}
                                </>
                              }
                        
                              
                            </>
                          )
                        })
                      
                      }
                      
                    </>
                  }
                  {isnormal &&
                    <>
                    {value}
                    </>
                  }
                  </>
                } />
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
              
    );
}
export default Field;