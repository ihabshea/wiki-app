
import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
 Button, Modal, ModalHeader, ModalBody, ModalFooter,
Col, Row, Form, Container, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';
const Article = ({match}) => {
  const authD =  useContext(AuthContext);
  const [preferredLanguage,setLang] = useState(null);
  const [modal, setModal] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [title, setTitle] = useState({text: null});
  const [editTitle, setET] = useState(false);
  const [currentTitle, setCT] = useState('');
  const [description, setDescription] = useState({text: null});
  const [editDescrition, setED] = useState(false);
  const [currentDescription, setCD] = useState('');
  const [languages, setLanguages] = useState([{shorthand: "en",  name:"English"}]);
  const [alanguages, setALanguages] = useState([{shorthand: "en",  name:"English"}]);
  const fetchLanguages = async() => {
    let raw;
    const requestBody = {

    query : `
    query {
      languages{
        shorthand
        name
      }
    }`
  };
  try{
    await fetch('http://localhost:9000/graphql',

    {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData.data.languages);
    setLanguages(resData.data.languages);
  }).catch(err => {
    throw(err);
  })
}catch(e){
  // throw  new Error("t");
}
  }
  const fetchALanguages = async({articleId}) => {
    let raw;
    const requestBody = {

    query : `
    query {
      alanguages(aid: "${match.params.id}"){
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData.data.alanguages);
    setALanguages(resData.data.alanguages);
  }).catch(err => {
    throw(err);
  })
  }
  const fetchTitle = async() => {
    let raw;

   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
      query{
        title(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData);
    if(resData.data.title){
      setTitle(resData.data.title);
    }else{
      setTitle({text: null});
    }
  }).catch(err => {
    throw(err);
  })
  }
  const fetchDescription = async() => {
    let raw;

   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
      query{
        description(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
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
  .then( res => {
      if(res.status !== 200 && res.status !== 201){
        throw new Error('failed');
      }
  return res.json();
  }).then(resData => {
    console.log(resData);
    if(resData.data.description){
      setDescription(resData.data.description);
    }else{
      setDescription({text: null});
    }
  }).catch(err => {
    throw(err);
  })
  }
  useEffectAsync(async ()=> {
    if(!preferredLanguage && localStorage.getItem("language")){
      setLang(localStorage.getItem("language"));
    }
  },[])
  useEffectAsync(async () => {

     await  fetchLanguages();
     await fetchALanguages(match.params.id);
     await fetchTitle();
     await fetchDescription();
    setLoaded(true);
  },[]);
  useEffectAsync(async() => {
    setLoaded(false);
     await fetchTitle();

     await fetchDescription();
    setLoaded(true);

  },[preferredLanguage]);

  const toggle = () => {
    setLang("en");
    localStorage.setItem("language","en");
     setModal(!modal);
   }
   const createDescription = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       createDescription(descriptionInput:{articleId:"${match.params.id}", text: "${currentDescription}", language: "${preferredLanguage}"}){
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.description);
     setDescription(resData.data.description);
     }).catch(err => {
     throw(err);
     })

     setED(false);
     await fetchDescription();
     await fetchALanguages(match.params.id);
     setLoaded(true);

   }
   const updateDescription = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       updateDescription(descriptionInput:{articleId:"${match.params.id}", text: "${currentDescription}", language: "${preferredLanguage}"}){
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.description);
     setDescription(resData.data.description);
     }).catch(err => {
     throw(err);
     })

     setED(false);
     await fetchDescription();
     setLoaded(true);

   }
   const createTitle = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       createTitle(titleInpt:{articleId:"${match.params.id}", title: "${currentTitle}", language: "${preferredLanguage}"}){
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
         'Authorization': 'Bearer '+ authD.token
       }
     }
     )
     .then( res => {
       if(res.status !== 200 && res.status !== 201){
         throw new Error('failed');
       }
     return res.json();
     }).then(resData => {
     console.log(resData.data.title);
     if(resData.data.title){
       setTitle(resData.data.title);
     }else{
       setTitle({text: null});
     }
     }).catch(err => {
     throw(err);
     })
     await fetchTitle();
     await fetchALanguages(match.params.id);
     setET(false);
     setLoaded(true);
   }
   const changeSValue = (e) => {
     e.preventDefault();
     setModal(true);
     setLang(e.target.value);
   }
   const lpreferredLanguage = localStorage.getItem("language");
   const rtlLanguage =( lpreferredLanguage === "ar" ||lpreferredLanguage === "he");
  return (
    <Container>
    <Row>
      <Col xs="4">
      <div class="card">
        <div class="card-header">
          {title.text &&
            <>{title.text}</>
          }
          {!title.text &&
            <>Untitled article</>
          }
        </div>
      </div>
      <div class="card">
        <div class="card-header">
          Languagues
        </div>
        <div class="card-body" style={{padding:0}}>
        <ul className="list-group list-group-flush">
        {alanguages.map(language => {
          return(

             <li style={{"margin":"0px !important", "padding:": "0px  !important"}} class="list-group-item" onClick={() => {setLang(language.shorthand); localStorage.setItem("language",language.shorthand)}} class="list-group-item">{language.name}</li>

          )

      })}
      </ul>
        </div>
      </div>

      </Col>
      <Col xs="8">
      {!lpreferredLanguage && <>
        <Modal isOpen="true" >
        <ModalHeader >Select a Preferred Language</ModalHeader>
        <ModalBody>
         <Form >
         <p>Select a language. Cancelling sets the language to English by default.</p>
         <span>WikiMVC allows articles to be written in multiple languages; pick the language you want to write your articles in. P.S: you can change the settings later.</span> <br/>
         {!loaded && <>
           <div class="sk-folding-cube">
             <div class="sk-cube1 sk-cube"></div>
             <div class="sk-cube2 sk-cube"></div>
             <div class="sk-cube4 sk-cube"></div>
             <div class="sk-cube3 sk-cube"></div>
           </div>

         </>}
         {loaded && <>
           <select onChange={changeSValue} name="slanguage">
           {languages.map(language => {
              return(<option value={language.shorthand}>{language.name}</option>)
           })}

           </select>
           </>
         }
         </Form>

         </ModalBody>
        <ModalFooter>
          <button onClick={(e) => { if (!preferredLanguage){
              setLang("en");
              localStorage.setItem("language","en");
              setModal(false);
            }else{
              localStorage.setItem("language",preferredLanguage);
              setModal(false);
            }
            }
          } color="primary" >Done</button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
        </>
      }
      <div className="card">
        <div className="card-body">
        {loaded && <>

          {!title.text &&
            <>
            {!editTitle &&
            <>
            <h3 onClick={() => setET(true)}>
            Set a title for the article
            </h3>
            </>
            }
            {editTitle &&
              <form onSubmit={createTitle}>
              <input type="text" onChange={(e) => setCT(e.target.value)} value={currentTitle} placeholder="Set a title for the article" />
              </form>
            }
            </>
          }
          {title.text &&
            <h3>{title.text}</h3>
          }

          <div className="jb-info">


                        <div style={{"clear":"left"}}></div>
          </div>
          <div id="jb-finfo">
            <div style={{"clear":"right"}}></div>
            <div className="job-description">
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
                <form onSubmit={createDescription}>
                <textarea onChange={(e) => setCD(e.target.value)} value={currentDescription}  />
                <input type="submit" />
                </form>
              }
              </>
            }
            {description.text &&
              <p>{description.text}</p>
            }
            </div>
            </div>
            </>}

              {!loaded && <>
                <div class="sk-folding-cube">
                  <div class="sk-cube1 sk-cube"></div>
                  <div class="sk-cube2 sk-cube"></div>
                  <div class="sk-cube4 sk-cube"></div>
                  <div class="sk-cube3 sk-cube"></div>
                </div>
              </>}
        </div>
      </div>

      </Col>
    </Row>
    </Container>
  )
}
export default Article;
