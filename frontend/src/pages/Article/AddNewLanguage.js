import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import FilledInput from '@material-ui/core/FilledInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
const AddNewLanguage = ({ languages, lContext, articleId, newLanguageModal, setNLM }) => {
    const [selectedLang, setSL] = useState("en");
    const [loaded, setLoaded] = useState(false);
    const addLanguage = async () => {
        setLoaded(false);

        const requestBody = {

            query: `
        mutation {
            addLanguage(articleId: "${articleId}", language: "${selectedLang}"){
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
            }).then(async(resData) => {
                // console.log(resData.data.alanguages);
                if (resData.data) {
                    await lContext.changeLanguage(selectedLang);
                    window.location.reload();
                }
            }).catch(err => {
                throw (err);
            })

    }

    return (
        <>
            <Dialog open={newLanguageModal} onClose={() => { setNLM(false) }} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">New Language</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please choose one of the languages available below.
                    </DialogContentText>
                    <Select
                        native
                        value={selectedLang}
                        onChange={(e) => { setSL(e.target.value) }}
                        input={<FilledInput name="age" id="filled-age-native-simple" />}
                    >
                        <option value="" />
                        {languages.map(language => {
                            return (
                                <option value={language.shorthand}>
                                    {language.name}
                                </option>
                            )
                        })}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setNLM(false) }} color="primary">
                        Cancel
                    </Button>
                    <Button  onClick={addLanguage} color="primary">
                        Add language
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
export default AddNewLanguage;