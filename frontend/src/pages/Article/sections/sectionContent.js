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
const SectionContent = ({cSC, setCSC, sectionid, authD, section, classes, fetchSections, fetchSection, setLoaded, currentSection}) => {
    const [sectionContent, setSC] = useState('');
    const [sectionCID, setSCID] = useState(null);
    const [SCEdit, setSCE] = useState(false);

    const updateSectionContent = async () => {
        setLoaded(false);
        const requestBody = {

            query: `
    mutation {
      updateSectionContent(sectionID: "${sectionid}", content: """${cSC}"""){
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

            }).catch(err => {
                throw (err);
            })
        // await fetchTitle();
        // await fetchSections();

        // await fetchFields();
        // await fetchALanguages(articleId);
        // setET(false);
        await fetchSection();
        setSCE(false);
        setLoaded(true);
    }
    return (
        <>
        {
            currentSection.content ?
                <>
                    {!SCEdit &&
                        <div style={{ cursor: "pointer" }} onClick={() => { setSCE(true); }} dangerouslySetInnerHTML={{ __html: currentSection.content }}>
                        </div>
                    }
                    {SCEdit &&
                        <>
                            <WigEditor sectionContent={cSC} setSC={setCSC} />
                            <IconButton onClick={updateSectionContent} aria-label="update">
                                <i class="material-icons">
                                    save
</i>
                            </IconButton>
                        </>
                    }
                </> :
                sectionid != sectionCID ?
                    <>


                        <span onClick={() => setSCID(section._id)} style={{ cursor: "pointer" }}>
                            Write in this section.
</span>
                    </>
                    :
                    <>
                        <WigEditor sectionContent={sectionContent} setSC={setSC} />
                        {/* <TextField
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
/> */}
                        <IconButton onClick={() => { updateSectionContent(section._id) }} aria-label="update">
                            <i class="material-icons">
                                save
</i>
                        </IconButton>
                    </>
        }
        </>
    )
}
export default SectionContent;