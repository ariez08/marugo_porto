import React from "react";
import { Routes, Route } from "react-router-dom";
import Main from "./pages/Home";
import AboutMe from "./pages/AboutMe";
import Collection from "./pages/Collection";
import Test from "./pages/Test";
import Page404 from "./pages/Page404";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/home" element={<Main />} />
        <Route path="/about-me" element={<AboutMe />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/upload" element={<Test />}></Route>

        {/* Catch-All Route */}
        <Route path="*" element={<Page404 />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
