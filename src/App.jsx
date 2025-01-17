import { BrowserRouter, Routes, Route } from "react-router-dom"
 


import Body from "./components/Body.jsx"
import Login from "./components/Login.jsx"
import Profile from "./components/Profile.jsx"
import { Provider } from "react-redux"
import Feed from "./components/Feed.jsx";
import { store } from "./utils/appStore.js"

import Connection from "./components/Connection.jsx"
import Requests from "./components/Requests.jsx"
function App() {

  return (
    <>
    <Provider store={store}>
    <BrowserRouter basename="/"> 
    <Routes>
      <Route path="/" element={<Body/>} >
     
      <Route path="/" element={<Feed/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
      <Route  path="/connection"element={<Connection/>}/>
      <Route  path="/requests"element={<Requests/>}/>
   </Route>
   
  </Routes>

    </BrowserRouter>


    </Provider>
    
   
    </>
  )
}

export default App;
