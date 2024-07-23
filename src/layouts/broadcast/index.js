// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Checkbox from "@mui/material/Checkbox";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// React and other dependencies
import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrigi o erro de importação

/* eslint-disable prettier/prettier */

function Broadcast() {
  const [pages, setPages] = useState([]);
  const [appAccessToken, setAppAccessToken] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState([{ title: "", url: "" }]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/authentication/sign-in");
      return null;
    }
    return token;
  }, [navigate]);

  useEffect(() => {
    const fetchPages = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        const settingsResponse = await axios.get(
          `https://webhook-messenger-67627eb7cfd0.herokuapp.com/api/settings/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { app_access_token } = settingsResponse.data;
        setAppAccessToken(app_access_token);

        const response = await axios.get(
          `https://graph.facebook.com/v20.0/me/accounts?access_token=${app_access_token}`
        );
        setPages(response.data.data);

        setAlertMessage("Informações carregadas com sucesso!");
        setAlertSeverity("success");
        setOpen(true);
      } catch (error) {
        console.error("Error fetching pages or settings:", error);
        setAlertMessage("Erro ao carregar informações.");
        setAlertSeverity("error");
        setOpen(true);
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/authentication/sign-in");
        }
      }
    };
    fetchPages();
  }, [getToken, navigate]);

  const handlePageChange = (event, value) => {
    setSelectedPages(value);
  };

  const handleButtonChange = (index, field, value) => {
    const newButtons = [...buttons];
    newButtons[index][field] = value;
    setButtons(newButtons);
  };

  const handleAddButton = () => {
    setButtons([...buttons, { title: "", url: "" }]);
  };

  const handleRemoveButton = (index) => {
    const newButtons = buttons.filter((_, i) => i !== index);
    setButtons(newButtons);
  };

  const handleSubmit = async () => {
    const data = {
      pageIds: selectedPages.map((page) => page.id),
      message: message,
      buttons: buttons.map((button) => ({
        type: "web_url",
        url: button.url,
        title: button.title,
      })),
    };

    try {
      const token = getToken();
      if (!token) return;

      setLoading(true); // Show loading
      await axios.post(
        "https://webhook-messenger-67627eb7cfd0.herokuapp.com/broadcast/send",
        data,
        {
          headers: {
            "Content-Type": "application/json",
            "app-access-token": appAccessToken,
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false); // Hide loading
      setAlertMessage("Broadcast enviado com sucesso! Os resultados aparecerão em breve no dashboard.");
      setAlertSeverity("success");
      setOpen(true);
    } catch (error) {
      setLoading(false); // Hide loading
      console.error("Erro ao enviar broadcast:", error);
      setAlertMessage("Erro ao enviar broadcast. Por favor, tente novamente.");
      setAlertSeverity("error");
      setOpen(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Ultra Broadcast
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <Autocomplete
                  multiple
                  options={pages}
                  getOptionLabel={(option) => option.name}
                  renderOption={(props, option, { selected }) => (
                    <li {...props}>
                      <Checkbox style={{ marginRight: 8 }} checked={selected} /> {option.name}
                    </li>
                  )}
                  value={selectedPages}
                  onChange={handlePageChange}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      label="Selecionar páginas"
                      placeholder="Clique para selecionar"
                    />
                  )}
                  fullWidth
                />
                <MDButton
                  variant="text"
                  color="info"
                  onClick={() => setSelectedPages(pages)}
                >
                  Selecionar Todas
                </MDButton>
                <Typography variant="caption" color="secondary">
                  {selectedPages.length} páginas(s) selecionadas
                </Typography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <TextField
                  label="Copy do Broadcast"
                  multiline
                  rows={4}
                  variant="outlined"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  margin="normal"
                />
                {buttons.map((button, index) => (
                  <Grid container spacing={2} key={index} alignItems="center">
                    <Grid item xs={5}>
                      <TextField
                        label={`Texto do Botão ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={button.title}
                        onChange={(e) => handleButtonChange(index, "title", e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label={`URL do Botão ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={button.url}
                        onChange={(e) => handleButtonChange(index, "url", e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <IconButton onClick={handleAddButton}>
                        <AddIcon />
                      </IconButton>
                      {buttons.length > 1 && (
                        <IconButton onClick={() => handleRemoveButton(index)}>
                          <RemoveIcon />
                        </IconButton>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </MDBox>
              <MDBox pt={3} px={3} pb={3} display="flex" justifyContent="center">
                <MDButton variant="contained" color="success" onClick={handleSubmit}>
                  Enviar Broadcast
                </MDButton>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
        <MDTypography variant="h6" color="white" sx={{ ml: 2 }}>
          Enviando broadcast, por favor aguarde...
        </MDTypography>
      </Backdrop>
    </DashboardLayout>
  );
}

export default Broadcast;
