import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';

const AddSectionButton = ({ classes, createSection }) => {
    return (
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
    )
}
export default AddSectionButton;