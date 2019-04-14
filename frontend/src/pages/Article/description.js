import React, { useReducer, useContext, useState, useEffect } from 'react';
// import AuthContext from '../../context/auth';
import WigEditor from './sections/wig-editor'
import IconButton from '@material-ui/core/IconButton';
import useEffectAsync from '../../helpers/useEffectAsync';
const Description = ({ articleId, editDescrition, editMode, setED, authD }) => {
    const preferredLanguage = localStorage.getItem("language");
    const [description, setDescription] = useState({ text: null });
    const [currentDescription, setCD] = useState('');
    const [edittedDescription, setEED] = useState('');
    const [loaded, setLoaded] = useState(false);
    useEffectAsync(async () => {
        await fetchDescription();
        setLoaded(true);
    }, []);
    const createDescription = async (e) => {
        e.preventDefault();
        setLoaded(false);
        const requestBody = {

            query: `
         mutation {
           createDescription(descriptionInput:{articleId:"${articleId}", text: """${currentDescription}""", language: "${preferredLanguage}"}){
             text
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
                console.log(resData.data.description);
                setDescription(resData.data.description);
                setEED(resData.data.description.text);
            }).catch(err => {
                throw (err);
            })

        setED(false);
        await fetchDescription();

        setLoaded(true);

    }
    const fetchDescription = async () => {
        let raw;

        let lpreferredLanguage = localStorage.getItem("language");

        console.log(lpreferredLanguage, articleId);
        const requestBody = {

            query: `
          query{
            description(articleID:"${articleId}", language:"${lpreferredLanguage}"){
              text
            }
          }
        `
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
                console.log(resData);
                if (resData.data.description) {
                    setDescription(resData.data.description);
                    setEED(resData.data.description.text);
                } else {
                    setDescription({ text: null });
                }
            }).catch(err => {
                throw (err);
            })
    }
    const updateDescription = async (e) => {
        e.preventDefault();
        setLoaded(false);
        const requestBody = {

            query: `
         mutation {
           updateDescription(descriptionInput:{articleId:"${articleId}", text: """${edittedDescription}""", language: "${preferredLanguage}"}){
             text
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
                console.log(resData.data.description);
                setDescription(resData.data.description);
            }).catch(err => {
                throw (err);
            })

        setED(false);
        await fetchDescription();
        setLoaded(true);

    }

    return (
        <>
            {loaded &&
                <>
                    {!description.text &&
                        <>
                            {!editDescrition &&
                                <>
                                    <p onClick={() => setED(true)}>
                                        Set a description for the article
                </p>
                                </>
                            }
                            {editDescrition &&
                                <>
                                    <WigEditor sectionContent={currentDescription} setSC={setCD} />
                                    {/* <form onSubmit={createDescription}>
                  <textarea onChange={(e) => setCD(e.target.value)} value={currentDescription}  />
                  <input type="submit" />
                  </form> */}
                                    <IconButton onClick={createDescription} aria-label="update">
                                        <i class="material-icons">
                                            save
                                     </i>
                                    </IconButton>
                                </>
                            }
                        </>
                    }
                    {!editMode &&
                        <>
                            {description.text &&
                                <div dangerouslySetInnerHTML={{ __html: description.text }}>
                                </div>
                            }
                        </>
                    }
                    {editMode &&
                        <>
                            {!editDescrition &&
                                <>
                                    {description.text &&
                                        <div onClick={()=> {setED(true)}}  style={{ "cursor": "pointer" }} dangerouslySetInnerHTML={{ __html: description.text }}>
                                        </div>
                                    }
                                </>
                            }
                            {editDescrition &&
                                <>
                                    <WigEditor sectionContent={edittedDescription} setSC={setEED} />
                                    <IconButton onClick={updateDescription} aria-label="update">
                                        <i class="material-icons">
                                            save
                                        </i>
                                    </IconButton>
                                </>
                            }
                        </>

                    }
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
export default Description;