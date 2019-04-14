import React, { useState } from 'react';
import useEffectAsync from '../../helpers/useEffectAsync';
import strings from '../../language/localization';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';

import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
const UpdateField =  ({ authD, setTitle, fetchTitle, fetchFields, components, preferredLanguage, lpreferredLanguage, setLoaded, setAddField, articleId, classes }) => {


}
export default UpdateField;