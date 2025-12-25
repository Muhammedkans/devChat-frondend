import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import Body from "./components/Body.jsx";
import Login from "./components/Login.jsx";
import ProfilePage from "./components/ProfilePage.jsx";
import Connection from "./components/Connection.jsx";
import Requests from "./components/Requests.jsx";
import Chat from "./components/Chat.jsx";
import Premium from "./components/Premium.jsx";
import EditProfile from "./components/EditProfile.jsx";
import FeedPage from "./components/FeedPage.jsx";
import UserProfile from "./components/UserProfile.jsx";

function App() {
  return (
    <>
      <BrowserRouter basename="/">
        <Toaster position="top-center" reverseOrder={false} />
        <Routes>
          <Route path="/" element={<Body />}>
            <Route index element={<FeedPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/connection" element={<Connection />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="/chat" element={<Connection />} />
            <Route path="/chat/:targetUserId" element={<Chat />} />
            <Route path="/premium" element={<Premium />} />
            <Route path="/editProfile" element={<EditProfile />} />
            <Route path="/users/:userId" element={<UserProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

