import { BrowserRouter, Routes, Route } from "react-router-dom"

import Body from "./components/Body.jsx"
import Login from "./components/Login.jsx"
import Profile from "./components/Profile.jsx"
import { Provider } from "react-redux"
import Feed from "./components/Feed.jsx";
import { store } from "./utils/appStore.js"
import Error from "./components/Error.jsx"
function App() {

  return (
    <>
    <Provider store={store}>
    <BrowserRouter basename="/"> 
    <Routes>
      <Route path="/" element={<Body/>} >
      <Route path="/error"element={<Error/>} />
      <Route path="/feed" element={<Feed/>}/>
      <Route path="/login" element={<Login/>} />
      <Route path="/profile" element={<Profile/>} />
   </Route>
   
  </Routes>

    </BrowserRouter>


    </Provider>
    
   
    </>
  )
}

export default App
