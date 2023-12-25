import React, { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { TextField, Button, Container, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

interface LoginFormState {
  phoneNumber: string;
  password: string;
}

const LoginPage: React.FC = () => {
  const [loginForm, setLoginForm] = useState<LoginFormState>({
    phoneNumber: "",
    password: "",
  });
  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("phoneNumber", loginForm.phoneNumber);
    formData.append("password", loginForm.password);

    try {
      const response = await fetch("http://localhost:5180/api/user/login", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Response Data:", data);

      if (data.statusCode === 0) {
        setIsLoggedIn(true);

        // local storage
        localStorage.setItem("accessToken", data.result.accessToken);
        localStorage.setItem("fio", data.result.fio ?? "defaultFio");
        localStorage.setItem("phoneNumber", data.result.phoneNumber);
        localStorage.setItem("userID", data.result.userID?.toString());

        navigate("/dashboard");
      } else {
        console.error("Login failed:", data.errorMessage);
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">
        Логин
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="phoneNumber"
          label="Phone Number"
          type="tel"
          autoComplete="tel"
          autoFocus
          value={loginForm.phoneNumber}
          onChange={handleChange}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={loginForm.password}
          onChange={handleChange}
        />
        <Button type="submit" fullWidth variant="contained" color="primary">
          Войти
        </Button>
        <Link to="/register">{"Нет аккаунта? Регистрация"}</Link>
      </form>
    </Container>
  );
};

export default LoginPage;
