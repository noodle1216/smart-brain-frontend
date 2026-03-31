import React, { useState } from 'react';
// import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation.jsx';
import Logo from './components/Logo/Logo.jsx';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.jsx';
import Rank from './components/Rank/Rank.jsx';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.jsx';
import Signin from './components/Signin/Signin.jsx';
import Register from './components/Register/Register.jsx';
import ParticlesBg from 'particles-bg'
import './App.css';
import { API_URL } from './config';

// const initialState = {
//   input: '',
//   imageUrl: '',
//   box: {},
//   route: 'signin',
//   isSignedIn: false,
//   user: {
//     id: '',
//     name: '',
//     email: '',
//     entries: 0,
//     joined: ''
//   }
// };

function App () {
  const [input, setInput] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [boxes, setBoxes] = useState([]);
  const [route, setRoute] = useState('signin');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState({
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
  });

  const loadUser = (data) => {
    setUser({
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    });
  };

  // const calculateFaceLocation = (data) => {
  //   if (!data || data.length === 0) {
  //     return [];
  //   }

  //   const image = document.getElementById('inputimage');
  //   if (!image) return [];

  //   const width = image.width;
  //   const height = image.height;

  //   return data.map(face => {
  //     const box = face.faceRectangle;

  //     return {
  //       leftCol: box.left,
  //       topRow: box.top,
  //       rightCol: width - (box.left + box.width),
  //       bottomRow: height - (box.top + box.height)
  //     };
  //   });
  // };

const calculateFaceLocation = (data) => {
  if (!data || data.length === 0) return [];

  const image = document.getElementById('inputimage');
  if (!image) return [];

//Original image width: 1000px but Displayed width: 500px
// so correct position on resized image with ratio=0.5
  const widthRatio = image.width / image.naturalWidth;
  const heightRatio = image.height / image.naturalHeight;

  return data.map(face => {
    const box = face.faceRectangle;

    return {
      leftCol: box.left * widthRatio,
      topRow: box.top * heightRatio,
      rightCol: image.width - (box.left + box.width) * widthRatio,
      bottomRow: image.height - (box.top + box.height) * heightRatio
    };
  });
};

  const displayFaceBox = (box) => {
    setBoxes(box);
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageUrl(input);

    //removed to config.js
    // const API_URL = import.meta.env.VITE_API_URL;

    fetch(`${API_URL}/imageurl`, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        imageUrl: input
      })
    })
      .then(res => res.json())
      .then(response => {
        console.log('API response', response);

        if (!Array.isArray(response)) {
          alert('Face detection failed. Check backend API.');
          console.error('Invalid API response:', response);
          return;
        }
        
        if (response && response.length) {
          fetch(`${API_URL}/image`, {
            method: 'put',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify({
              id: user.id
            })
          })
            .then(res => res.json())
            .then(count => {
              setUser(prev => ({ ...prev, entries: count }));
            });
        }

  displayFaceBox(calculateFaceLocation(response));
})
      .catch(console.log);
  };

  const onRouteChange = (route) => {
    if (route === 'signout') {
      setInput('');
      setImageUrl('');
      setBoxes([]);
      setRoute('signin');
      setIsSignedIn(false);
      setUser({
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      });
      setRoute('signin');
      return; //force to signin
    } else if (route === 'home') {
      setIsSignedIn(true)
    }
      setRoute(route);
  };

  return (
    <div className="App">
      <ParticlesBg className='particles' type="cobweb" color="#E5E4E2" bg={true} />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange}/>
      { route === 'home'
        ? <div>
            <Logo />
            <Rank name={user.name} entries={user.entries}/>
            <ImageLinkForm 
              onInputChange={onInputChange} 
              onButtonSubmit={onButtonSubmit}
            />
            <FaceRecognition boxes={boxes} imageUrl={imageUrl} />
          </div> 
        : (
          route === 'signin'
          ? <Signin loadUser={loadUser} onRouteChange={onRouteChange} />
          : <Register loadUser={loadUser} onRouteChange={onRouteChange} /> 
          )
      }      
    </div>
  );
}
 
export default App;
