import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import SectionContent from './sectionContent';
// import DialogActions from '@material-ui/core/DialogActions';
// import DialogContent from '@material-ui/core/DialogContent';
import Checkbox from '@material-ui/core/Checkbox';
// import DialogContentText from '@material-ui/core/DialogContentText';
// import DialogTitle from '@material-ui/core/DialogTitle';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import WigEditor from './wig-editor'
import Divider from '@material-ui/core/Divider';
import SectionTitle from './sectionTitle';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl'
// import Sections from './Article/sections/sections'
import DialogTitle from '@material-ui/core/DialogTitle';
import useEffectAsync from '../../../helpers/useEffectAsync';
const Section = ({ classes, authD, fetchSections, section, editMode }) => {



    const [currentSection, setCS] = useState(section);
    const [cSC, setCSC] = useState(null);
    const [loaded, setLoaded] = useState(true);

    let sectionid = section._id;
    useEffectAsync(async () => {
        setCSC(section.content);
        // setCS(section);
    }, []);

    const fetchSection = async () => {
        setLoaded(false);
        const requestBody = {
            query: `
                query{
                    section(sectionId: "${sectionid}"){
                        title
                        content
                    }
                }
            `
        }
        await fetch("http://localhost:9000/graphql",

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
                setCS(resData.data.section);
                setLoaded(true);
            });
    }


    
   

    return (
        <>
            {loaded?
                <>
                <SectionTitle classes={classes} fetchSection={fetchSection} fetchSections={fetchSections} setLoaded={setLoaded} sectionid={sectionid} authD={authD} editMode={editMode} section={section} />
                      <Divider style={{ width: "100%", marginLeft: 0, marginBottom: 5 }} variant="middle" />
                <SectionContent section={section} cSC={cSC} setCSC={setCSC} classes={classes} fetchSection={fetchSection} fetchSections={fetchSections} setLoaded={setLoaded} currentSection={currentSection} />    
                </>
            :
                <div class="sk-folding-cube">
                    <div class="sk-cube1 sk-cube"></div>
                    <div class="sk-cube2 sk-cube"></div>
                    <div class="sk-cube4 sk-cube"></div>
                    <div class="sk-cube3 sk-cube"></div>
                </div>
            }
        </>

    )
}
export default Section;