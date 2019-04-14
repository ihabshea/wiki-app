import React, { useReducer, useContext, useState, useEffect } from 'react';
// import AuthContext from '../../context/auth';
import WigEditor from './sections/wig-editor'
import IconButton from '@material-ui/core/IconButton';
import useEffectAsync from '../../helpers/useEffectAsync';
const Description = ({ articleId, editDescrition, setED, authD, LangContext }) => {
    const preferredLanguage = localStorage.getItem("language");
    const [description, setDescription] = useState({ text: null }); 
    const [currentDescription, setCD] = useState('');
    const [loaded, setLoaded] = useState(false);
    useEffectAsync(async () => {
        await fetchDescription();
    },[]);
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
           updateDescription(descriptionInput:{articleId:"${articleId}", text: "${currentDescription}", language: "${preferredLanguage}"}){
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
                    {description.text &&
                        <div dangerouslySetInnerHTML={{ __html: description.text }}>
                        </div>
                    }
                </>
            }
        </>
    )
}
export default Description;