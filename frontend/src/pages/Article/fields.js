import React, { useReducer, useContext, useState, useEffect } from 'react';
import useEffectAsync from '../../helpers/useEffectAsync';
import strings from '../../language/localization';
import Moment from 'react-moment';
import classNames from 'classnames';
import Dialog from '@material-ui/core/Dialog';
import FilledInput from '@material-ui/core/FilledInput';
// import {theme, useStyles} from '../theme/theme';
import Field from './field';
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

const Fields = ({fields, editMode, updateField, classes, deletetoggle, deleteField, nodeleteInput}) => {
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



  const [currentFieldType, setFT] = useState({value: null, key:null});

  const [institution, setIN] = useState(null);
  return (
    <>
    {fields.map((field) => {  
      return(
        <Field nodeleteInput={nodeleteInput} deletetoggle={deletetoggle} deleteField={deleteField} updateField={updateField} classes={classes} field={field} editMode={editMode} />
      )
    })}
    </>
  )
}
export default Fields;