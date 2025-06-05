import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./Components/Login";
import SignupPage from "./Components/Signup";
import Home from "./Home";
import AdminHome from "./AdminHome";
import Adoption from "./Admin/Adoption";
import Content from "./Components/Content";
import Content1 from "./Components/Content1";
import PetAdoptionPage from "./Pages/Petadoption";
import PetHealthTracker from "./Pages/Pethealthtracker";
// import PetHealth from "./Admin/PetHealth";
import ContactForm from "./ContactForm";
import PetConnectEventAdmin from "./Admin/Events";
import PetConnectEventUser from "./Pages/UserEvents";
import AdminHealthTracker from "./Admin/AdminHealthTracker";
import Petsocial from "./Pages/Petsocial";
import PetProfile from "./Pages/PetProfile";
import Messages from "./Pages/Messages";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />{" "}
          {/* Redirect "/" to "/login" */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/AdminHome" element={<AdminHome />} />
          <Route path="/ContactForm" element={<ContactForm />} />
          <Route path="/Content" element={<Content />} />
          <Route path="/Content1" element={<Content1 />} />
          <Route path="/petadoption" element={<PetAdoptionPage />} />
          <Route path="/pethealth" element={<PetHealthTracker />} />
          <Route path="/adoption" element={<Adoption />} />
          <Route path="/AdminPetEvents" element={<PetConnectEventAdmin />} />
          <Route path="/UserPetEvents" element={<PetConnectEventUser />} />
          <Route
            path="/admin/health-tracker"
            element={<AdminHealthTracker />}
          />
          <Route path="/Petsocial" element={<Petsocial />} />
          <Route path="/PetProfile" element={<PetProfile />} />
          <Route path="/Messages" element={<Messages />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
