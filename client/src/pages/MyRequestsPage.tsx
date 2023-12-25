import React, { useEffect, useState } from "react";
import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const requestTypeNames: Record<number, string> = {
  1: "Покупка",
  2: "Продажа",
  3: "Аукцион",
};

interface Request {
  id: number;
  requestTypeId: number;
  phoneNumber: string;
  fio: string;
  email: string;
}

const MyRequestsPage = () => {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5180/api/Request/GetRequests",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setRequests(data.result || []);
      } else {
        console.error("Error fetching requests:", data.errorMessage);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  return (
    <TableContainer
      component={Paper}
      sx={{
        alignItems: "center",
      }}
    >
      <Table aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Тип</TableCell>
            <TableCell align="center">Телефон</TableCell>
            <TableCell align="center">ФИО</TableCell>
            <TableCell align="center">Email</TableCell>
            <TableCell align="center">Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} align="center">
                <Typography variant="h6">No requests found.</Typography>
              </TableCell>
            </TableRow>
          ) : (
            requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell component="th" scope="row">
                  {requestTypeNames[request.requestTypeId]}
                </TableCell>
                <TableCell align="center">{request.phoneNumber}</TableCell>
                <TableCell align="center">{request.fio}</TableCell>
                <TableCell align="center">{request.email}</TableCell>
                <TableCell align="center">
                  <Button onClick={() => navigate(`/requests/${request.id}`)}>
                    Детализация
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default MyRequestsPage;
