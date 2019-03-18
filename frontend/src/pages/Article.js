
import React, { useReducer, useContext, useState, useEffect } from 'react';
import AuthContext from '../context/auth';
import useEffectAsync from '../helpers/useEffectAsync';
import strings from '../language/localization';
import LangContext from '../language/languageContext';
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
  DropdownMenu,Table,
  DropdownItem,
 Button, Modal, ModalHeader, ModalBody, ModalFooter, InputGroup, InputGroupText, InputGroupAddon,
Col, Row, Form, Container, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';

const Article = ({match}) => {
  const lContext = useContext(LangContext);
  const authD =  useContext(AuthContext);
  const [fields, reloadFields] = useState([]);
  const [fieldForm, setFieldForm] = useState([{fieldname: "en",  fieldvalue:"English"}]);
  const [preferredLanguage,setLang] = useState(null);
  const [addField, setAddField] =  useState(false);
  const [editMode, setEM] = useState(false);
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
  const fetchFields = async() => {
  
   let lpreferredLanguage = localStorage.getItem("language");
   console.log(lpreferredLanguage,match.params.id);
    const requestBody = {

    query : `
      query{
        fields(articleID:"${match.params.id}", language:"${lpreferredLanguage}"){
          name
          value
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
    if(resData.data.fields){
      reloadFields(resData.data.fields);
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
      await setLang(localStorage.getItem("language"));
      await lContext.changeLanguage(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
    if(localStorage.getItem("language")){
      await lContext.changeLanguage(localStorage.getItem("language"));
      await setLang(localStorage.getItem("language"));
      // console.log(strings.untitled);
    }
  },[])
  useEffectAsync(async () => {

     await  fetchLanguages();
     await fetchALanguages(match.params.id);
     await fetchTitle();
     await fetchFields();
     await fetchDescription();
    setLoaded(true);
  },[]);
  useEffectAsync(async() => {
    setLoaded(false);
     await lContext.changeLanguage(localStorage.getItem("language"));
     await fetchTitle();
     await fetchFields();
     await fetchDescription();
    setLoaded(true);

  },[preferredLanguage]);

  const toggle = async () => {
    setLang("en");
    // localStorage.setItem("language","en");
    await lContext.changeLanguage("en");
     setModal(!modal);
   }
   const changeFieldProp =  (e) => {
    const name = e.target.name;
    const value = e.target.value;
     setFieldForm(fieldForm => {  return {...fieldForm, [name]:value} })
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
   const changeSValue = async (e) => {
     e.preventDefault();
     setModal(true);
    //  setLang(e.target.value);
     await LangContext.changeLanguage(e.target.value);
   }
   const lpreferredLanguage = localStorage.getItem("language");
   const rtlLanguage =( lpreferredLanguage === "ar" ||lpreferredLanguage === "he");
   const createField = async (e) => {
     e.preventDefault();
     setLoaded(false);
     const requestBody = {

     query : `
     mutation {
       createField(fieldInput:{articleId:"${match.params.id}", name: "${fieldForm.fieldname}", value: "${fieldForm.fieldvalue}", language: "${preferredLanguage}"}){
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
     await fetchFields();
     await fetchALanguages(match.params.id);
     setET(false);
     setLoaded(true);
   }
  return (
    <LangContext.Consumer>
      {lContext => {
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
              <>{strings.untitledarticle}</>
            }
          </div>
          <div className="card-body" style={{padding:0}}>
          <Table>
            {fields.map((field) => {
              return (
                <tr style={{padding:15}}>
                  <td style={{width:"30%"}}>{field.name}</td>
                  <td style={{width:"70%"}}>{field.value}</td>
                </tr>

              )
            })}
          </Table>
          {editMode && 
          <>
          {addField && 
           <form onSubmit={createField}>
            <table>
              <tr>
               
                    <td style={{width:"30%"}}><Input name="fieldname" onChange={changeFieldProp} value={fieldForm.fieldname} placeholder={strings.name} /></td>
                    <td style={{width:"70%"}}><Input name="fieldvalue" onChange={changeFieldProp} value={fieldForm.fieldvalue}  placeholder={strings.value}/><input type="submit" /></td>
          
              </tr>
            </table>
            </form>
          }
          {!addField &&
            <Button onClick={() => setAddField(true)} style={{marginTop:5}} outline color="secondary">{strings.addfield}</Button>
          }
          </>
          }
          </div>
        </div>
        <div class="card">
          <div class="card-header">
            {strings.languages}
          </div>
          <div class="card-body" style={{padding:0}}>
          <ul className="list-group list-group-flush">
          {alanguages.map(language => {
            return(

              <li style={{"margin":"0px !important", "padding:": "0px  !important"}} class="list-group-item" onClick={async () => {setLang(language.shorthand); await lContext.changeLanguage(language.shorthand);  }} class="list-group-item">{language.name}</li>

            )

        })}
         {editMode && 
          <Button onClick={() => setAddField(true)} style={{marginTop:5}} outline color="secondary">Add a new language</Button>
         }
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
            <button onClick={async (e) => { if (!preferredLanguage){
                // setLang("en");
                // localStorage.setItem("language","en");
                await lContext.changeLanguage("en");
                setModal(false);
              }else{
                // localStorage.setItem("language",preferredLanguage);
                await lContext.changeLanguage(localStorage.getItem("language"));
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
            {!editMode && 
              <Button onClick={() => setEM(true)} style={{float:"right"}} outline color="primary">{strings.editmode}</Button>
            }
            {editMode && 
              <Button onClick={() => setEM(false)} style={{float:"right"}} outline color="primary">{strings.done}</Button>
            }
            {!title.text &&
              <>
              {!editTitle &&
              <>
              <h3 onClick={() => setET(true)}>
              {strings.setTitle}
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
      }}
    </LangContext.Consumer>
  )
}
export default Article;
