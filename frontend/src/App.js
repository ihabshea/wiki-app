import './App.css';
import React, { useReducer, useContext, useState, useEffect } from 'react';
import {BrowserRouter as Router, Link, Route} from 'react-router-dom';
import { PropsRoute, PublicRoute, PrivateRoute } from 'react-router-with-props';
import AuthContext from './context/auth';
import useEffectAsync from './helpers/useEffectAsync';
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
Col, Row, Form, FormGroup, Label, Input, FormText, ListGroup, ListGroupItem, Jumbotron } from 'reactstrap';
const Context = React.createContext(null);
const Header = () => {
  const [modal, setModal] = useState(false);
  const context = useContext(AuthContext);
  const [loginForm, setLoginForm] = useState([{
    username: '',
    password : ''
  }]);
  const loginTo = async (username, password) => {
    console.log(username, password);

    const loginRequest = {
      query: `
      query{
        login(username: "${username}", password: "${password}"){
          userId
          token
          tokenExpiration
        }
      }
      `
    }
    await fetch('http://localhost:9000/graphql',
    {
      method: 'POST',
      body: JSON.stringify(loginRequest),
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
      if(resData.data.login.token){
        context.login(resData.data.login.token, resData.data.login.userId,resData.data.login.userId.tokenExpiration);
      }
        // if(resData.data.login.token){
        // }
    }).catch(err => {
      throw(err);
    });
  }
  const toggle = () => { setModal(!modal); }
  const changeInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setLoginForm(loginForm => { return {...loginForm, [name]: value}})
  }
  return(
    <AuthContext.Consumer>
    {context => {
      return (
        <div>
        <header>
          <div id="header-links">
            <a className="current" id="header-link"><img src="/img/home.png" /><span className="text">Home</span></a>
          </div>
          <div id="logo">
          WikiMVC
          </div>
          {!context.token &&
            <>
               <button onClick={toggle} className="loginLink">Login</button>
               <Modal isOpen={modal} toggle={toggle}>
               <ModalHeader toggle={toggle}>Login</ModalHeader>
               <ModalBody>
                <Form >
                  <FormGroup>
                    <Label for="exampleEmail" hidden>Username</Label>
                    <Input type="text" name="username" value={loginForm.username} onChange={changeInput} id="exampleEmail" placeholder="Username" />
                    </FormGroup>
                    {' '}
                    <FormGroup>
                    <Label for="examplePassword" hidden>Password</Label>
                    <Input type="password" name="password" value={loginForm.password} onChange={changeInput} id="examplePassword" placeholder="Password" />
                  </FormGroup>
                </Form>
                </ModalBody>
               <ModalFooter>
                 <button onClick={() => loginTo(loginForm.username, loginForm.password)} color="primary" >Login</button>{' '}
                 <Button color="secondary" onClick={toggle}>Cancel</Button>
               </ModalFooter>
             </Modal>
            </>
          }
          <div style={{"clear":"right"}}></div>
        </header>
       </div>
      )
    }}

    </AuthContext.Consumer>
   );
}
let loaded = false;
const currentPathReducer = (state,  action) =>{
  switch(action.type){
    case 'navigate':

  }
}
const appReducer = (state, action)  => {
    switch(action.type){
      case 'update':
      const updateRequest = {

      query : `
      mutation{
          updateCharacter(characterInput: {

          }){

          }
        }
      `
    };
      return fetch('http://localhost:9000/graphql',

      {
        method: 'POST',
        body: JSON.stringify(updateRequest),
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
      return resData.data.characters;
    }).catch(err => {
      throw(err);
    });
    case 'topArticles':
      const retrieveQuery = {
        query: `
          query {

          }
        `
      }
      default:
        return state;
    }
  }
const TopArticles = ({topArticles}) => {

}
const MainPage = ({token, articles}) => {
  const authD =  useContext(AuthContext);
  const createArticle = async(event) => {
    const loginRequest = {
      query: `
      mutation{
        createArticle{
          _id
          createdOn
          creator{
            _id
          }
        }
      }
      `
    }
    await fetch('http://localhost:9000/graphql',
    {
      method: 'POST',
      body: JSON.stringify(loginRequest),
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
        // console.log(resData);
        window.location.replace("http://localhost:3000/article/"+resData.data.createArticle._id);
        // if(resData.data.login.token){
        // }
    }).catch(err => {
      throw(err);
    });
  }
  return(
    <>
    <AuthContext.Consumer>
    {context => {
      return (
        <div>
          <Jumbotron>
            <h1 className="display-3">Hello, world!</h1>
            <p className="lead">An encyclopedia management system built to help fullstack developers.</p>
            <hr className="my-2" />
            <p>Contribute to the development, try the software out or explore the API.</p>
            <p className="lead">
            {context.token &&
              <Button onClick={createArticle} color="primary">Create Article</Button>
            }

            </p>
          </Jumbotron>

        </div>
      )
    }}
      </AuthContext.Consumer>
    </>
  )
}

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
    setLoaded(true);
  },[preferredLanguage]);

  const toggle = () => {
    setLang("en");
    localStorage.setItem("language","en");
     setModal(!modal);
   }
   const createDescription = async (e) => {
     e.preventDefault();
     const requestBody = {

     query : `
     mutation {
       createDescription(descriptionInput:{articleId:"${match.params.id}", title: "${currentTitle}", language: "${preferredLanguage}"}){
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
     setTitle(resData.data.title);
     }).catch(err => {
     throw(err);
     })
     setET(false);

   }
   const createTitle = async (e) => {
     e.preventDefault();
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
     setTitle(resData.data.title);
     }).catch(err => {
     throw(err);
     })
     setET(false);

   }
   const changeSValue = (e) => {
     e.preventDefault();
     setModal(true);
     setLang(e.target.value);
   }
   const lpreferredLanguage = localStorage.getItem("language");
   const rtlLanguage =( lpreferredLanguage === "ar" ||lpreferredLanguage === "he");
  return (
    <>
    <div id="wrapper" className={rtlLanguage ? "rtl"  : "" }>
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
      <div id="portofolio">
        <div id="job">
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

            <p className="ongoing" id="jb-status">
              <i className="fa fa-circle-notch"></i>New
            </p>
            <div style={{"clear":"right"}}></div>
            <div className="job-description">
            {!description.text &&
              <>
              {!editDescrition &&
              <>
              <h3 onClick={() => setED(true)}>
              Set a description for the article
              </h3>
              </>
              }
              {editDescrition &&
                <form onSubmit={createDescription}>
                <input type="text" onChange={(e) => setCT(e.target.value)} value={currentTitle} placeholder="Set a title for the article" />
                </form>
              }
              </>
            }
            {description.text &&
              <h3>{description.text}</h3>
            }
            </div>

            <div style={{"clear":"left"}}></div>
          </div>



            <div style={{"clear":"left"}}></div>


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
      </div>
      <div id="profile-p">

      </div>
      <div id="profile-p">
      <p>This article is available in:</p>
      <Nav>
      {alanguages.map(language => {
        return(
          <NavItem>
            <NavLink onClick={() => {setLang(language.shorthand); localStorage.setItem("language",language.shorthand)}}>{language.name}</NavLink>
          </NavItem>
        )

  })}
</Nav>





      </div>
      <div style={{"clear":"right"}}></div>
    </>
  )
}
const App = () => {
const [articles, dispatch] = useReducer(appReducer,  []);
const [loginState, updateToken] = useState({
  token: null,
  userId: null,
  tokenExpiration: null
});
useEffect(()=> {

        updateToken(JSON.parse(localStorage.getItem('login')));


}, []);
// useEffect(()=> {
//   localStorage.setItem('login', JSON.stringify(loginState));
// },[loginState])
const loginFunction = async (token, userId, tokenExpiration) => {
  try{
    const t = {token: token, userId: userId, tokenExpiration:  tokenExpiration};
    await updateToken(t);
    console.log(t);
    localStorage.setItem('login', JSON.stringify(t));
    console.log(JSON.parse(localStorage.getItem('login')))
  }catch(error){

  }
}

const logoutFunction = () => {

}
  return(
    <Router>
      <Context.Provider value={dispatch}>
        <AuthContext.Provider value={{token: loginState.token, userId: loginState.userId, login: loginFunction, logout: logoutFunction}}>
        <Header />
        <PropsRoute exact path="/" component={MainPage} loginState={loginState} articles={articles} />
        <PropsRoute path="/article/:id" component={Article} />
        </AuthContext.Provider>

      </Context.Provider>
    </Router>

  )
}

export default App;
