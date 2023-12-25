import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Box, Grid, Paper } from "@mui/material";

interface RequestDetail {
  id: number;
  phoneNumber: string;
  fio: string;
  email: string;
  requestTypeId: number;
  statusId: number;
}

const requestTypeNames: Record<number, string> = {
  1: "Покупка",
  2: "Продажа",
  3: "Аукцион",
};

const RequestDetailsPage = () => {
  const { requestId } = useParams<{ requestId: string }>();
  const [requestDetails, setRequestDetails] = useState<RequestDetail | null>(
    null
  );

  const fetchRequestDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:5180/api/Request/GetRequest?id=${requestId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (data.statusCode === 0) {
        setRequestDetails(data.result);
      } else {
        console.error("Error fetching request details:", data.errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  const handleStatusChange = async (accept: boolean) => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("User not authenticated");
        return;
      }

      const response = await fetch(
        `http://localhost:5180/api/Request/changeStatusIssuance?requestId=${requestId}&accept=${accept}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      if (data.statusCode === 0) {
        console.log("Status changed successfully");
        fetchRequestDetails(); // Refetch for status change
      } else {
        console.error("Error changing status:", data.errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  useEffect(() => {
    fetchRequestDetails();
  }, [requestId]);

  if (!requestDetails) {
    return <Typography>Загрузка...</Typography>;
  }

  const requestTypeName =
    requestTypeNames[requestDetails.requestTypeId] || "Unknown";
  return (
    <Box sx={{ padding: "20px" }}>
      <Paper elevation={3} sx={{ padding: "20px", marginBottom: "20px" }}>
        <Typography variant="h4" gutterBottom>
          Детализация заявки
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Телефон:</b> {requestDetails.phoneNumber}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>ФИО:</b> {requestDetails.fio}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Email:</b> {requestDetails.email}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Тип заявки:</b> {requestTypeName}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1">
              <b>Статус:</b> {requestDetails.statusId}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => handleStatusChange(true)}
        >
          Завершить
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => handleStatusChange(false)}
        >
          Отменить
        </Button>
      </Box>
    </Box>
  );
};

export default RequestDetailsPage;
