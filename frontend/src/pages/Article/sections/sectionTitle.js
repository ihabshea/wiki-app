import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import WigEditor from './wig-editor'
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl'
// import Sections from './Article/sections/sections'
import DialogTitle from '@material-ui/core/DialogTitle';
import useEffectAsync from '../../../helpers/useEffectAsync';

const SectionTitle = ({classes, fetchSections, fetchSection, setLoaded, authD,sectionid, editMode, section}) => {
    const [sectionDeleteDialog, setSDD] = useState(false);
    const [sectionedit, setSE] = useState(null);
    const [title, setTitle] = useState({ text: null });
    const [sectionTitle, setST] = useState('');
    let lpreferredLanguage = localStorage.getItem("language");
    const deleteSection = async (id) => {
        setLoaded(false);
        const requestBody = {
            query: `
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
                    'Authorization': 'Bearer ' + authD.token
                }
            }
        )
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('failed');
                }
                return res.json();
            }).then(() => {

            }).catch(err => {
                throw (err);
            })
        // await fetchTitle();
        await fetchSections();
        // await fetchFields();
        // await fetchALanguages(articleId);
        // setET(false);
        setLoaded(true);
    };
    const updateSectionTitle = async (id) => {
        setLoaded(false);
        const requestBody = {
            query: `
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

        await fetchSection();

        // setET(false);
        setLoaded(true);
    }
    return (
        <h4 style={{ marginBottom: 0 }}>
        {section.title ?
            <>

                {editMode &&
                    <>
                        {sectionid != sectionedit ?
                            <>

                                {editMode &&
                                    <span onClick={() => { setSE(sectionid); setST(section.title); }} style={{ cursor: "pointer" }}>
                                        {section.title}
                                    </span>

                                }
                            </>
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
                                    <IconButton onClick={() => { updateSectionTitle(section._id) }} aria-label="update">
                                        <i class="material-icons">
                                            save
                          </i>
                                    </IconButton>
                                </FormControl>
                            </>
                        }
                    </>
                }
                {!editMode &&
                    <span>
                        {section.title}
                    </span>
                }

                {editMode &&
                    <>
                        <IconButton onClick={() => setSDD(!sectionDeleteDialog)} aria-label="Delete">
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
                            <DialogTitle id="alert-dialog-title">{"Delete section"}</DialogTitle>
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
            </> :

            <>
                {sectionid != sectionedit ?
                    <>
                        <span onClick={() => setSE(sectionid)} style={{ cursor: "pointer" }}>
                            Untitled Section
</span>
                        {editMode &&
                            <>
                                <IconButton onClick={() => setSDD(!sectionDeleteDialog)} aria-label="Delete">
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
                                    <DialogTitle id="alert-dialog-title">{"Delete section"}</DialogTitle>
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
                    </>
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
                            <IconButton onClick={() => { updateSectionTitle(section._id) }} aria-label="update">
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
    )
}
export default SectionTitle;