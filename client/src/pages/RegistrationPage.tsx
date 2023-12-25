import React, { Dispatch, SetStateAction, useState } from "react";
import { TextField, Button, Box, Typography, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";

interface IRegistrationFormState {
  userid: number | null;
  phoneNumber: string;
  fio: string;
  email: string;
  password: string;
}

interface RegistrationPageProps {
  setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const RegistrationPage: React.FC = () => {
  const [registrationForm, setRegistrationForm] =
    useState<IRegistrationFormState>({
      userid: null,
      phoneNumber: "",
      fio: "",
      email: "",
      password: "",
    });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRegistrationForm({
      ...registrationForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("phoneNumber", registrationForm.phoneNumber);
    formData.append("fio", registrationForm.fio || "");
    formData.append("email", registrationForm.email || "");
    formData.append("password", registrationForm.password);
    if (registrationForm.userid) {
      formData.append("userid", registrationForm.userid.toString());
    }

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetch("http://localhost:5180/api/user/Register", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.statusCode === 0) {
        console.log("Registration successful:", data);
        setSuccessMessage("Registration successful!");
        setIsLoggedIn(true);
        // Redirect
        setTimeout(() => navigate("/dashboard"), 3000);
      } else {
        console.error("Registration failed:", data.errorMessage);
        setErrorMessage(data.errorMessage || "Registration failed.");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error during registration:", error.message);
        setErrorMessage(
          error.message || "An error occurred during registration."
        );
      } else {
        console.error("Error during registration:", error);
        setErrorMessage("An unknown error occurred during registration.");
      }
    }
  };
  return (
    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
      <Typography component="h1" variant="h4">
        Регистрация
      </Typography>

      {successMessage && <Alert severity="success">{successMessage}</Alert>}
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

      <TextField
        margin="normal"
        required
        fullWidth
        label="Номер Телефона"
        name="phoneNumber"
        autoFocus
        value={registrationForm.phoneNumber}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="ФИО"
        name="fio"
        value={registrationForm.fio}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Email"
        name="email"
        value={registrationForm.email}
        onChange={handleChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        label="Пароль"
        name="password"
        type="password"
        value={registrationForm.password}
        onChange={handleChange}
      />
      <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
        Register
      </Button>
    </Box>
  );
};

export default RegistrationPage;
