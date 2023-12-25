import React from "react";
import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
import Header from "./components/Header";
import CreateRequestPage from "./pages/CreateRequestPage";
import MyRequestsPage from "./pages/MyRequestsPage";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/material";
import Dashboard from "./pages/DashboardPage";
import MyRequests from "./pages/MyRequestsPage";
import RequestDetailsPage from "./pages/RequestDetailsPage";
import { AuthProvider } from "./utils/AuthContext";

const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          fontFamily: "Roboto, sans-serif",
        },
        body: {
          margin: "20px",
          boxSizing: "border-box",
          fontFamily: "Roboto, sans-serif",
          backgroundColor: "##F7F7F7",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {},
      },
    },
  },
});
const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("accessToken")));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/create-request" element={<CreateRequestPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/my-requests" element={<MyRequestsPage />} />
          <Route path="/requests/:requestId" element={<RequestDetailsPage />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
