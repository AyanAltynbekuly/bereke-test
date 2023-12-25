import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Typography, Box } from "@mui/material";

interface RequestDetail {
  id: number;
  phoneNumber: string;
  fio: string;
  email: string;
  requestTypeId: number;
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
    return <Typography>Loading request details...</Typography>;
  }

  const requestTypeName =
    requestTypeNames[requestDetails.requestTypeId] || "Unknown";

  return (
    <Box>
      <Typography variant="h4">Детализация</Typography>
      <Typography>Телефон: {requestDetails.phoneNumber}</Typography>
      <Typography>ФИО: {requestDetails.fio}</Typography>
      <Typography>Email: {requestDetails.email}</Typography>
      <Typography>Тип заявки: {requestTypeName}</Typography>
      <Button onClick={() => handleStatusChange(true)}>Завершить</Button>
      <Button onClick={() => handleStatusChange(false)}>Отменить</Button>
    </Box>
  );
};

export default RequestDetailsPage;
