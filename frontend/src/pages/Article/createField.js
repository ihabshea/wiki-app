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
// import InfoBox from 'Article/infoBox';
import Switch from '@material-ui/core/Switch';
import FormControl from '@material-ui/core/FormControl'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions';
import Select from 'react-select';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const CreateField = ({ authD, setTitle, fetchTitle, fetchFields, components, preferredLanguage, lpreferredLanguage, setLoaded, setAddField, articleId, classes }) => {
    const [refArticle, setRA] = useState({ value: null });
    const [suggestedArticles, setSAs] = useState([]);
    const [specialField, setSpF] = useState(false);
    const [, setObjF] = useState(false);
    const [endedDeath, setEndDead] = useState(false);

    const [currentFieldType, setFT] = useState({ value: null, key: null });

    const [institution, setIN] = useState(null);

    const [fieldObject, setfObj] = useState([]);
    const [, setDG] = useState(null);
    const [fieldForm, setFieldForm] = useState([{ fieldname: "en", fieldvalue: "English" }]);
    const [activeStep, setActiveStep] = useState(0);
    const [wizardDialog, setWZD] = useState(false);


    useEffectAsync(async () => {


        await fetchSuggestedArticles();
        setLoaded(true);
    }, [preferredLanguage]);
    let notfinal = (activeStep === 0 | activeStep === 1);
    const fetchSuggestedArticles = async () => {

        const requestBody = {

            query: `
        query{
          findArticlesByLanguage(language: "${lpreferredLanguage}"){
            _id
            title{
              text
            }
          }
        }`
        };
        try {
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
                    if (resData.data) {
                        setSAs(resData.data.findArticlesByLanguage);
                    }
                }).catch(err => {
                    throw (err);
                })
        } catch (e) {
            // throw  new Error("t");
        }
    }

    const enterSubmit = (event) => {
        event.preventDefault();

        // if (event.keyCode === 13) {
        //   event.preventDefault();

        // }
        createAField();
        setAddField(false);
        setFieldForm(["", ""]);
    }


    const WizardStep1 = () => {
        return (
            <>
                Please choose one of the pre-built field types.
          <Select
                    classes={classes}
                    options={fieldsuggestions}
                    components={components}
                    value={currentFieldType}
                    onChange={handleChangeL}
                />
            </>
        );
    }
    let isbirth = currentFieldType.value === "birth";
    let isdeath = currentFieldType.value === "death";
    let isspouse = currentFieldType.value === "spouse";
    let iseducation = currentFieldType.value === "education";

    const WizardStep2 = () => {
        return (
            <>
                {isbirth &&
                    <>
                        Pick a birthdate. This is helpful because it dynamically changes the age of the person. Helpful with death date (if it exists).
          </>
                }
                {isdeath &&
                    <>

                    </>
                }
            </>
        );
    }
    const WizardStep3 = () => {
        return (
            <>
                {isbirth &&
                    <>
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            onChange={(e) => setFieldForm(() => { return { ...fieldForm, ["fieldvalue"]: e.target.value } })}
                            value={fieldForm.fieldvalue}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                }
                {isdeath &&
                    <>
                        <TextField
                            id="date"
                            label="Death date"
                            type="date"
                            onChange={(e) => setFieldForm(() => { return { ...fieldForm, ["fieldvalue"]: e.target.value } })}
                            value={fieldForm.fieldvalue}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                }
                {isspouse &&
                    <>
                        <Select
                            classes={classes}
                            options={suggestions}
                            components={components}
                            value={fieldObject.partner}
                            onChange={handleChangeP}
                            placeholder="Search for a person"
                        />
                        <TextField
                            label="Started"
                            type="year"
                            onChange={(e) => setfObj((fieldObject) => { return { ...fieldObject, ["started"]: e.target.value } })}
                            value={fieldObject.started}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <TextField
                            label="Ended"
                            type="year"
                            onChange={(e) => setfObj((fieldObject) => { return { ...fieldObject, ["ended"]: e.target.value } })}
                            value={fieldObject.ended}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={endedDeath}
                                    onChange={async () => {
                                        await setEndDead(!endedDeath);
                                        setfObj((fieldObject) => {
                                            return { ...fieldObject, ["death"]: endedDeath }
                                        })
                                    }
                                    }
                                    color="primary"
                                />
                            }
                            label="Relationship ended because of death"
                        />

                    </>
                }
                {iseducation &&
                    <>
                        <Select
                            classes={classes}
                            options={degreesuggestions}
                            components={components}
                            value={fieldObject.partner}
                            onChange={handleChangeDg}
                            placeholder="What degree?"
                        />
                        <Select
                            classes={classes}
                            options={degreesuggestions}
                            components={components}
                            value={fieldObject.partner}
                            onChange={handleChangeSc}
                            placeholder="What degree?"
                        />
                    </>
                }
            </>
        );
    }
    const ErrorStep = () => {
        return (
            <>
                TBD
    </>
        );
    }
    const GetStep = () => {
        switch (activeStep) {
            case 0:
                return (
                    <>
                        <WizardStep1 />
                    </>
                );
            case 1:
                return (
                    <>
                        <WizardStep2 />
                    </>
                );
            case 2:
                return (
                    <>
                        <WizardStep3 />
                    </>
                );
            default:
                return (
                    <>
                        <ErrorStep />
                    </>
                );
        }
    }

    let suggestions;
    if (suggestedArticles) {
        suggestions = suggestedArticles.map((article) => ({
            value: article._id,
            label: article.title.text
        }));
    }
    const fieldsuggestions = [
        { key: "birth", value: "Birthdate" },
        { key: "death", value: "Death date" },
        { key: "spouse", value: "Spouse/Partner" },
        { key: "education", value: "Education" },
        { key: "list", value: "Generic List" }
    ].map(suggestion => ({
        value: suggestion.key,
        label: suggestion.value,
    }));
    const degreesuggestions = [
        { key: "BA" },
        { key: "BSc" },
        { key: "MSc" },
        { key: "MBA" },
        { key: "PhD" },
    ].map(suggestion => ({
        value: suggestion.key,
        label: suggestion.key,
    }));


    const handleChangeL = (value) => {
        setFT(value);
        if (value === "spouse") {
            setObjF(true);
        }
    }

    const handleChangeDg = (value) => {
        setDG(value);
    }
    const handleChangeSc = (value) => {
        setIN(value);
    }
    const handleChangeP = (value) => {
        setObjF(true);
        setfObj((fieldObject) => { return { ...fieldObject, ["partner"]: value } })
    }

    const createAField = async () => {
        setLoaded(false);
        let query;
        if (specialField) {
            query = `
     mutation {
     createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${refArticle.value}", language: "${preferredLanguage}", special: ${specialField}, articleRef: "${refArticle.value}" type:"${currentFieldType.value}"} ){
      name
      value
    }
  }`;

        } else {
            query = `
     mutation {
       createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}", special: ${specialField}, articleRef: "${refArticle.value}", type:"${currentFieldType.value}"}){
         name
         value
       }
     }`;
        }
        const requestBody = {
            query: query
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
        // await fetchTitle();
        // await fetchDescription();
        await fetchFields();
        // await fetchALanguages(articleId);
        // setET(false);
        setLoaded(true);
    }
    const createObjectField = async () => {
        const fieldQuery = `
    mutation{
      createBlankField(articleId: "${articleId}", language: "${lpreferredLanguage}", name: "${fieldForm.fieldname}", type:"${currentFieldType.value}"){
        _id
        name
      }
    }
    `;
        const requestBody = {

            query: fieldQuery
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
                Object.keys(fieldObject).map(async (key) => {
                    let objectQuery;
                    if (key === "partner") {
                        objectQuery = `
            mutation {
              createObject(fieldId:"${resData.data.createBlankField._id}", refArticle: "${fieldObject[key].value}", value: "${fieldObject[key].value}",  type: "${key}"){
                type
                value
              }
           }
            `;
                    } else {
                        objectQuery = `
          mutation {
            createObject(fieldId:"${resData.data.createBlankField._id}", value: "${fieldObject[key]}", type: "${key}"){
              type
              value
            }
         }`;
                    }
                    const OrequestBody = {

                        query: objectQuery
                    };
                    await fetch('http://localhost:9000/graphql',
                        {
                            method: 'POST',
                            body: JSON.stringify(OrequestBody),
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

                        });
                });
            }).catch(err => {
                throw (err);
            })
        await fetchTitle();
        //   await fetchDescription();
        await fetchFields();
        //   await fetchALanguages(articleId);
        //   setET(false);/
        setLoaded(true);


    }


    const changeFieldProp = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFieldForm(fieldForm => { return { ...fieldForm, [name]: value } })
    }
    const createField = async (e) => {

        e.preventDefault();
        setLoaded(false);
        const requestBody = {

            query: `
        mutation {
          createField(fieldInput:{articleId:"${articleId}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}"}){
            name
            value
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
        await fetchFields();
        // setET(false);
        setLoaded(true);
    }
    return (
        <form onSubmit={createField}>
            <FormControl className={classes.margin}>
                <InputLabel
                    htmlFor="custom-css-standard-input"
                    classes={{
                        root: classes.cssLabel,
                        focused: classes.cssFocused,
                    }}
                >
                    {strings.name}
                </InputLabel>
                <Input name="fieldname"
                    onChange={changeFieldProp} value={fieldForm.fieldname}
                    id="custom-css-standard-input"
                    classes={{
                        underline: classes.cssUnderline,
                    }}
                />
            </FormControl>
            <FormControl className={classes.margin}>

                <>
                    <InputLabel
                        htmlFor="custom-css-standard-input"
                        classes={{
                            root: classes.cssLabel,
                            focused: classes.cssFocused,
                        }}
                    >
                        Field Value
   </InputLabel>
                    <Input name="fieldvalue"
                        onChange={changeFieldProp} value={fieldForm.fieldvalue}
                        id="custom-css-standard-input"
                        classes={{
                            underline: classes.cssUnderline,
                        }}
                    />
                </>


                <>

                    <Button variant="outlined" color="primary" onClick={() => setWZD(true)}>
                        Launch Wizard
 </Button>
                    <Dialog open={wizardDialog} onClose={() => setWZD(false)} aria-labelledby="form-dialog-title">
                        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
                        <DialogContent>
                            <DialogContentText>
                                <Stepper activeStep={activeStep} alternativeLabel>
                                    <Step key="Starting Out">
                                        <StepLabel>
                                            Starting Out
       </StepLabel>
                                    </Step>
                                    <Step key="Help">
                                        <StepLabel>
                                            Help
       </StepLabel>
                                    </Step>
                                    <Step key="Finish">
                                        <StepLabel>
                                            Finish
       </StepLabel>

                                    </Step>


                                </Stepper>
                                <GetStep />

                            </DialogContentText>

                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setWZD(false)} color="primary">
                                Cancel
     </Button>


                            {notfinal &&
                                <Button onClick={() => setActiveStep(activeStep + 1)} color="primary">
                                    Continue
          </Button>
                            }
                            {!notfinal &&
                                <Button onClick={() => { if (isspouse) { createObjectField(); } else { createAField(); } setWZD(false); }} color="primary">
                                    Finish
               </Button>
                            }

                        </DialogActions>
                    </Dialog>
                    {/* <Select
     classes={classes}
     options={suggestions}
     components={components}
     value={refArticle}
     onChange={handleChangeS}
     placeholder="Search a country (start with a)"
   /> */}
                </>


                <FormControlLabel
                    control={<Switch checked={specialField} onChange={(() => setSpF(!specialField))} />}
                    label="Wizard"
                />
            </FormControl>
            {/* <table>
         <tr>
          
               <td style={{width:"30%"}}><input style={{width:"100%"}} name="fieldname" onChange={changeFieldProp} value={fieldForm.fieldname} placeholder={strings.name} /></td>
               <td style={{width:"70%"}}><input onKeyUp={enterSubmit} style={{width:"100%"}} name="fieldvalue" onChange={changeFieldProp} value={fieldForm.fieldvalue}  placeholder={strings.value}/></td>
 
         </tr>
       </table> */}
            <Divider />
            <ExpansionPanelActions>
                <Button size="small">Cancel</Button>
                <Button onClick={enterSubmit} size="small" color="primary">
                    Save
     </Button>
            </ExpansionPanelActions>
        </form>
    )
}
export default CreateField;