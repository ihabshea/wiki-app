import React, { useState } from 'react';
// import {theme, useStyles} from '../theme/theme';
import Field from './field';

const Fields = ({fields, isDead, fetchTitle, editMode, birthDate, updateField, classes, deleteField, nodeleteInput}) => {
  return (
    <>
    {fields.map((field) => {  
      return(
        <Field isDead={isDead} fetchTitle={fetchTitle} birthDate={birthDate} nodeleteInput={nodeleteInput}  deleteField={deleteField} updateField={updateField} classes={classes} field={field} editMode={editMode} />
      )
    })}
    </>
  )
}
export default Fields;