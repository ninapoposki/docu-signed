import React, { useEffect } from "react";
import axios from "axios";
import LoginPage from "./pages/auth/LoginPage.tsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/auth/RegisterPage.tsx";
import HomePage from "./pages/home/Home.tsx";
import SignDocumentPage from "./pages/document/SignDocumentPage.tsx";
import MainLayout from "./components/layout/MainLayout.tsx";
import SignaturePage from "./pages/signature/SignaturePage.tsx";
import FinalDocumentPage from "./pages/final/FinalDocumentPage.tsx";

function App() {
  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((response) => {
        console.log("Connection successful:", response.data);
      })
      .catch((error) => {
        console.error("Error during connection:", error);
      });
  }, []);

  return (
    // <Router>
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/login" element={<LoginPage />} />
    //     <Route path="/register" element={<RegisterPage />} />
    //   </Routes>
    // </Router>
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/upload" element={<SignDocumentPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="sign-document/:id" element={<SignaturePage />} />
          <Route path="/final-document" element={<FinalDocumentPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
