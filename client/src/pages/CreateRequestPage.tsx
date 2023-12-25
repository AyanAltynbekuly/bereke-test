import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Alert,
  Typography,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

const CreateRequestPage = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    requestTypeId: "",
    fio: localStorage.getItem("fio") || "",
    email: "",
    phoneNumber: localStorage.getItem("phoneNumber") || "",
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const name = event.target.name as keyof typeof formData;
    setFormData({
      ...formData,
      [name]: event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formPayload = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formPayload.append(key, value);
    });

    try {
      const response = await fetch(
        "http://localhost:5180/api/Request/CreateRequest",
        {
          method: "POST",
          body: formPayload,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setSuccessMessage("Request created successfully");
        setErrorMessage("");
      } else {
        setErrorMessage(result.errorMessage || "Error creating request");
        setSuccessMessage("");
      }
    } catch (error) {
      setErrorMessage("Network error");
      setSuccessMessage("");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <Typography
        component="h1"
        variant="h4"
        sx={{
          margin: "20px",
        }}
      >
        Создать заявку
      </Typography>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <FormControl fullWidth>
        <InputLabel id="request-type-label">Тип Заявки</InputLabel>
        <Select
          labelId="request-type-label"
          name="requestTypeId"
          value={formData.requestTypeId}
          label="Type of Request"
          onChange={handleSelectChange}
          required
        >
          <MenuItem value={1}>Продажа</MenuItem>
          <MenuItem value={2}>Покупка</MenuItem>
          <MenuItem value={3}>Аукцион</MenuItem>
        </Select>
      </FormControl>
      <TextField
        label="ФИО"
        name="fio"
        value={formData.fio}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <TextField
        label="Телефон"
        name="phoneNumber"
        value={formData.phoneNumber}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />
      <Button type="submit" variant="contained" color="success">
        Создать заявку
      </Button>
      {successMessage && <Alert severity="success">{successMessage}</Alert>}
    </form>
  );
};

export default CreateRequestPage;
