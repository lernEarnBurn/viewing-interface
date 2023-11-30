import "./App.css";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useState } from "react";

import { NavBar } from "./components/NavBar";
import { LoginForm } from "./components/LoginForm";
import { SignupForm } from "./components/SignupForm";
import { BlogMenu } from "./components/BlogMenu";
import { BlogPage } from "./components/BlogPage";

import { ThemeProvider } from "@/components/theme-provider";

import { AnimatePresence } from "framer-motion";

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));

  const location = useLocation();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NavBar loggedIn={loggedIn} setLoggedIn={setLoggedIn} />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route
            path="/"
            element={
              loggedIn ? <Navigate to="/viewing-interface/blogs" /> : <Navigate to="/viewing-interface/log-in" />
            }
          />
          <Route
            path="/viewing-interface/log-in"
            element={<LoginForm setLoggedIn={setLoggedIn} />}
          />
          <Route
            path="/viewing-interface/sign-up"
            element={<SignupForm setLoggedIn={setLoggedIn} />}
          />
          <Route path="/viewing-interface/blogs" element={<BlogMenu />} />
          <Route path="/viewing-interface/blogs/:postId" element={<BlogPage />} />
        </Routes>
      </AnimatePresence>
    </ThemeProvider>
  );
}

export default App;
