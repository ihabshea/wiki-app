import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ListItemText from '@material-ui/core/ListItemText';
import Button from '@material-ui/core/Button';
import useEffectAsync from '../../helpers/useEffectAsync';

const ALanguages = ({ articleId, lContext, editMode, strings, classes, setLang }) => {
    const [loaded, setLoaded] = useState(false);
  const [alanguages, setALanguages] = useState([{ shorthand: "en", name: "English" }]);

    useEffectAsync(async () => {
        await fetchALanguages();
        setLoaded(true);
    }, []);
    const fetchALanguages = async () => {
        let raw;
        setLoaded(false);
        const requestBody = {

            query: `
        query {
          alanguages(aid: "${articleId}"){
            shorthand
            name
          }
        }`
        };
        await fetch('http://localhost:9000/graphql',

            {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        )
            .then(res => {
                if (res.status !== 200 && res.status !== 201) {
                    throw new Error('failed');
                }
                return res.json();
            }).then(resData => {
                console.log(resData.data.alanguages);
                if (resData.data) {
                    setALanguages(resData.data.alanguages);
                    setLoaded(true);
                }
            }).catch(err => {
                throw (err);
            })
    }
    return (
        <>
            {loaded ?
                <ExpansionPanel defaultExpanded>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        {strings.languages}
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails className={classes.details}>
                        {alanguages.map(language => {
                            return (
                                <ListItemText primary={language.name} style={{ "margin": "0px !important", "padding:": "0px  !important" }} onClick={async () => { setLang(language.shorthand); await lContext.changeLanguage(language.shorthand); }} />
                            )
                        })}
                        {editMode &&
                            <Button
                                outline
                                variant="extended"
                                size="small"
                                color="primary"
                                aria-label="Add"
                                className={classes.margin}
                                style={{ marginTop: 5 }}
                                outline color="secondary">Add a new language</Button>
                        }
                    </ExpansionPanelDetails>
                </ExpansionPanel>

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
export default ALanguages;