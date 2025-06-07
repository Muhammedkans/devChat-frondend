import { BrowserRouter, Routes, Route } from "react-router-dom"
 
import { Toaster } from 'react-hot-toast';

import Body from "./components/Body.jsx"
import Login from "./components/Login.jsx"
import Profile from "./components/Profile.jsx"
import { Provider } from "react-redux"
import Feed from "./components/Feed.jsx";
import { store } from "./utils/appStore.js"

import Connection from "./components/Connection.jsx"
import Requests from "./components/Requests.jsx"
import Chat from "./components/Chat.jsx"
import Premium from "./components/Premium.jsx"
import ProfilePage from "./components/ProfilePage.jsx"
import EditProfile from "./components/EditProfile.jsx"
import FeedPage from "./components/FeedPage.jsx";

function App() {

  return (
    <>
    
    <Provider store={store}>
    <BrowserRouter basename="/">
      <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path="/" element={<Body/>} >
     
      <Route path="/" element={<FeedPage/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<ProfilePage/>} />
      <Route  path="/connection"element={<Connection/>}/>
      <Route  path="/requests"element={<Requests/>}/>
      <Route  path="/chat/:targetUserId"element={<Chat/>}/>
      <Route  path="/premium"element={<Premium/>}/>
      <Route path="/editProfile" element={<EditProfile/>}/>
   </Route>
   
  </Routes>

    </BrowserRouter>


    </Provider>
    
   
    </>
  )
}

export default App;
