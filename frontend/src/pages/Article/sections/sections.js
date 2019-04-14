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
import Section from './section';

const Sections = ({ classes, articleId, authD, editMode }) => {
    const [sections, retrieveSections] = useState([]);
    let lpreferredLanguage = localStorage.getItem("language");

    const [loaded, setLoaded] = useState(false);
    useEffectAsync(async () => {
        await fetchSections();
        setLoaded(true);
    }, []);
    const fetchSections = async () => {
        setLoaded(false);
        const requestBody = {

            query: `
    query {
      sections(articleID: "${articleId}", language: "${lpreferredLanguage}"){
        _id
        title
        content
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
                console.log(resData);
                if (resData.data.sections)
                    retrieveSections(resData.data.sections);
            }).catch(err => {
                throw (err);
            })

        setLoaded(true);
    }


       return (
        <>
            {loaded &&
                <>
                    {sections.map(section => {
                        return (
                            <Section classes={classes} authD={authD} fetchSections={fetchSections} editMode={editMode } section={section} />
                        )
                    })}
                </>
            }
            {!loaded &&
                <>
                    <div class="sk-folding-cube">
                        <div class="sk-cube1 sk-cube"></div>
                        <div class="sk-cube2 sk-cube"></div>
                        <div class="sk-cube4 sk-cube"></div>
                        <div class="sk-cube3 sk-cube"></div>
                    </div>
                </>
            }
        </>
    )
}
export default Sections;