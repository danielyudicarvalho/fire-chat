import React, {useRef, useState} from 'react'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './App.css'


import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore'

firebase.initializeApp({
    apiKey: "AIzaSyBZw-693IIrBdtlXLqN6CaX3kZrxGt2v-0",
    authDomain: "superchat-a6e2a.firebaseapp.com",
    projectId: "superchat-a6e2a",
    storageBucket: "superchat-a6e2a.appspot.com",
    messagingSenderId: "530329999125",
    appId: "1:530329999125:web:58ab28eef7d5014c48fb1c",
    measurementId: "G-TK7DMEP4MM"

})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

  const [user] = useAuthState(auth)
  return (
    <div className="App">
      <header className="App-header">
        <h1>Out</h1>
        <SignOut/>
      </header>
      <section>
        {user ? <ChatRoon/> : <SignIn/>}
      </section>      
    </div>
  );
}


function SignIn(){
  const signInWithGoogle = ()=>{
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  const signInWithFacebook = ()=>{
    const faceProvider = new firebase.auth.FacebookAuthProvider()
    auth.signInWithPopup(faceProvider);
  }
    return(
      <>  
        <button className="sign-In" onClick={signInWithGoogle}>SignIn with Google</button>
        <button className="sign-In" onClick={signInWithFacebook}>SignIn with Facebook</button>
        <p>Do not violate the community guidelines or you will be banned for life!</p>
      </>
    )
  
}


function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoon(){
  const dummy = useRef('');

  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

  const [messages] = useCollectionData(query,{isField:'id'});

  const [formValue, setFormValue] = useState('');

  const sendMessage = async(e)=>{
    e.preventDefault();

    const {uid,photoURL} = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      uid,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({behavior:'smooth'})
  }


  return(
    <>
      <main>
        {messages && messages.map((msg)=><ChatMessage key={msg.id} message={msg}/>)}
      </main>

      <form onSubmit={sendMessage}>

        <input value={formValue} onChange={(e)=>setFormValue(e.target.value)} type="text"/>
        <button type='submit' disabled={!formValue}>Send</button>
      </form>
    </>
  )
}

function ChatMessage(props){
  const {text, uid, photoURL} = props.message;

  const messageClass = uid ===auth.currentUser.uid ? 'send' : 'received'

  return(
    <>
      <div className={`message ${messageClass}`}>
        <img src={photoUR}/>
        <p>{text}</p>
      </div>
    </>
  )
}

export default App;
