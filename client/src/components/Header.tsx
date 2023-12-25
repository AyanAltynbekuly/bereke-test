import React from "react";
import { Dispatch, SetStateAction } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, styled, Button } from "@mui/material";
import Logo from "../assets/logo_bereke_new-a316bac5.svg";
import { useAuth } from "../utils/AuthContext";

const StyledToolbar = styled(Toolbar)({
  justifyContent: "space-between",
});

const StyledLink = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(3),
  color: "#1A1A1A",
  textDecoration: "none",
  "&:hover": {
    textDecoration: "underline",
  },
}));

const Header: React.FC = () => {
  const { isLoggedIn, setIsLoggedIn } = useAuth();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("fio");
    localStorage.removeItem("phoneNumber");
    localStorage.removeItem("userID");
    setIsLoggedIn(false);
    navigate("/login");
  };
  return (
    <AppBar
      position="static"
      sx={{
        bgcolor: "white",
        borderRadius: "16px",
        marginBottom: "100px",
      }}
    >
      <StyledToolbar>
        <StyledLink to="/dashboard">
          <img src={Logo} alt="logo" />
        </StyledLink>
        <div>
          {isLoggedIn ? (
            <>
              <StyledLink to="/dashboard">Заявки</StyledLink>
              <StyledLink to="/register">Регистрация</StyledLink>
              <Button
                onClick={logout}
                variant="contained"
                sx={{
                  marginLeft: "24px",
                }}
              >
                Выйти
              </Button>
            </>
          ) : (
            <>
              <StyledLink to="/create-request">Создать заявку</StyledLink>
              <StyledLink to="/login">Логин</StyledLink>
              <StyledLink to="/register">Регистрация</StyledLink>
            </>
          )}
        </div>
      </StyledToolbar>
    </AppBar>
  );
};

export default Header;
