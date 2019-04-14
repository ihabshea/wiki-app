import React, { useState } from 'react';
// import {theme, useStyles} from '../theme/theme';
import Field from './field';

const Fields = ({authD, fields, fetchFields, setTitle, isDead, fetchTitle, editMode, birthDate, updateField, classes, deleteField, nodeleteInput}) => {
  return (
    <>
    {fields.map((field) => {  
      return(
        <Field fetchFields={fetchFields} setTitle={setTitle} authD={authD} isDead={isDead} fetchTitle={fetchTitle} birthDate={birthDate} nodeleteInput={nodeleteInput}  deleteField={deleteField}  classes={classes} field={field} editMode={editMode} />
      )
    })}
    </>
  )
}
export default Fields;