// src/App.jsx — All routes wired together
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import StoryList from "./pages/StoryList";
import StoryDetails from "./pages/StoryDetails";
import AddStory from "./pages/AddStory";
import EditStory from "./pages/EditStory";
import DeleteStory from "./pages/DeleteStory";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <>
      {/* Navbar reads auth state via useAuth() internally */}
      <Navbar />

      <main>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<StoryList />} />
          <Route path="/stories/:id" element={<StoryDetails />} />

          {/* Protected routes — auth gate is inside each page component */}
          <Route path="/stories/add" element={<AddStory />} />
          <Route path="/stories/:id/edit" element={<EditStory />} />
          <Route path="/stories/:id/delete" element={<DeleteStory />} />

          {/* Authentication */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </>
  );
}
