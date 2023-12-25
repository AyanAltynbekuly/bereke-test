import React from "react";
import { Link } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";

const Dashboard: React.FC = () => {
  return (
    <Box
      sx={{
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "20px" }}>
        Dashboard
      </Typography>
      <Box>
        <Button
          variant="contained"
          component={Link}
          color="success"
          to="/create-request"
          sx={{ marginRight: "10px" }}
        >
          Создать заявку
        </Button>
        <Button
          variant="contained"
          color="success"
          component={Link}
          to="/my-requests"
        >
          Мои заявки
        </Button>
      </Box>
    </Box>
  );
};

export default Dashboard;
