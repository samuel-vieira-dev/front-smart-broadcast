/* eslint-disable prettier/prettier */
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

// @mui material date components
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
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
import FacebookLogin from "react-facebook-login";
import { jwtDecode } from "jwt-decode"; // Não mexa aqui. De preferência use aspas duplas nessa página.

// dark theme
import { useMaterialUIController } from "context";
import themeDarkRTL from "../../assets/theme-dark/theme-rtl";
import { ThemeProvider } from "@mui/material/styles";
import themeRTL from "../../assets/theme/theme-rtl";

import "./Broadcast.css"; // Importar arquivo CSS

function Broadcast() {
  const [schedule, setSchedule] = useState(null);
  const [pages, setPages] = useState([]);
  const [appAccessToken, setAppAccessToken] = useState("");
  const [selectedPages, setSelectedPages] = useState([]);
  const [message, setMessage] = useState("");
  const [buttons, setButtons] = useState([{ title: "", url: "" }]);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const [nameBroad, setNameBroad] = useState("");
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const navigate = useNavigate();

  useEffect(() => {
    fetchSettings();
  }, []);

  const getToken = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/authentication/sign-in");
      return null;
    }
    return token;
  }, [navigate]);

  const fetchSettings = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.userId;

      const response = await axios.get(
        `https://webhook-messenger-67627eb7cfd0.herokuapp.com/api/settings/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { accessToken, pages } = response.data;
      setAppAccessToken(accessToken || "");
      setPages(pages);
      return accessToken || "";
    } catch (error) {
      console.error("Error fetching settings:", error);
      setAlertMessage("Erro ao carregar configurações.");
      setAlertSeverity("error");
      setOpen(true);
      return null;
    }
  };

  const fetchPages = async (userId, accessToken) => {
    let nextUrl = `https://graph.facebook.com/v20.0/${userId}/accounts?access_token=${accessToken}`;
    let allPages = [];
    try {
      setLoadingMessage("Buscando páginas, por favor aguarde...");
      setLoading(true); // Inicia o loading
      while (nextUrl) {
        const response = await axios.get(nextUrl, {});
        allPages = allPages.concat(response.data.data);
        nextUrl = response.data.paging?.next || null;
      }
      setLoading(false); // Finaliza o loading
      if (allPages.length === 0) {
        setAlertMessage("Nenhuma página encontrada.");
        setAlertSeverity("info");
        setOpen(true);
      } else {
        setPages(allPages);
        setAlertMessage("Informações carregadas com sucesso!");
        setAlertSeverity("success");
        setOpen(true);
      }
      setPagesUserSettings(allPages, userId, accessToken);
    } catch (error) {
      setLoading(false); // Finaliza o loading
      console.error("Error fetching pages or settings:", error);
      setAlertMessage("Erro ao carregar informações.");
      setAlertSeverity("error");
      setOpen(true);
    }
  };

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
    const token = getToken();
    if (!token) return;
    const verifyButtons = await verifyButtonss(buttons);
    const decoded = jwtDecode(token);
    const data = {
      pageids: selectedPages.map((page) => page.id),
      nameBroad: nameBroad,
      message: message,
      buttons: verifyButtons,
      schedule: schedule,
      userId: decoded.userId,
      n8n: false,
    };
    try {
      const token = getToken();
      if (!token) return;

      setLoadingMessage("Enviando broadcast, por favor aguarde...");
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
      setAlertMessage(
        "Broadcast enviado com sucesso! Os resultados aparecerão em breve no dashboard."
      );
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

  const verifyButtonss = async (buttons) => {
    if (!buttons[0].title || !buttons[0].url) {
      return [];
    } else {
      return buttons.map((button) => ({
        type: "web_url",
        url: button.url,
        title: button.title,
      }));
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

  const responseFacebook = async (response) => {
    console.log("Facebook response:", response);
    setSelectedPages([]);
    const appAccessToken = await fetchSettings();
    if (appAccessToken) {
      fetchPages(response.userID, response.accessToken);
    }
  };
  const addVariableInMessageBroad = (typeVariabel) => {
    setMessage((prevMessage) => prevMessage + typeVariabel + " ");
  };
  const setPagesUserSettings = async (allPages, userId, accessToken) => {
    const token = getToken();
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      const userIdApp = decoded.userId;

      const data = {
        pages: allPages,
        facebookUserId: userId,
        accessToken: accessToken,
      };
      await axios.post(`https://webhook-messenger-67627eb7cfd0.herokuapp.com/api/settings`, data, {
        headers: {
          "Content-Type": "application/json",
          userId: userIdApp,
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Erro ao salvar userSettings:", error);
    }
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
                <FacebookLogin
                  appId="426096060385647"
                  autoLoad={false}
                  fields="name,email,picture"
                  scope="public_profile,email,pages_show_list,pages_read_engagement,pages_manage_metadata,pages_read_user_content,pages_manage_posts,pages_messaging"
                  callback={responseFacebook}
                  icon="fa-facebook"
                  textButton="Login com Facebook"
                  cssClass="facebook-login-button"
                />
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
                <MDButton variant="text" color="info" onClick={() => setSelectedPages(pages)}>
                  Selecionar Todas
                </MDButton>
                <Typography variant="caption" color="secondary">
                  {selectedPages.length} páginas(s) selecionadas
                </Typography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <Grid item xs={12} pb={2}>
                  <TextField
                    label="Nome do broadcast"
                    variant="outlined"
                    fullWidth
                    value={nameBroad}
                    placeholder="Digite o nome do seu broadcast"
                    onChange={(e) => setNameBroad(e.target.value)}
                  />
                </Grid>
                <Grid maxWidth={560}>
                  <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={["DateTimePicker"]}>
                        <DateTimePicker
                          className="custom-date-time-picker"
                          label="Data e horário do agendamento"
                          onChange={(newValue) => setSchedule(dayjs(newValue))}
                        />
                      </DemoContainer>
                    </LocalizationProvider>
                  </ThemeProvider>
                </Grid>
              </MDBox>

              <MDBox pt={3} px={3}>
                <MDBox>
                  <MDTypography variant="h6">
                    Adicionar váriaveis ao texto do broadCast
                  </MDTypography>
                  <Grid container spacing={2} alignItems="center" maxWidth={1020}>
                    <Grid item xs={2}>
                      <MDButton
                        variant="contained"
                        color="success"
                        onClick={() => addVariableInMessageBroad("{{first_name}}")}
                      >
                        Primeiro nome
                      </MDButton>
                    </Grid>
                    <Grid item xs={2}>
                      <MDButton
                        variant="contained"
                        color="success"
                        onClick={() => addVariableInMessageBroad("{{last_name}}")}
                      >
                        Ultimo nome
                      </MDButton>
                    </Grid>
                    <Grid item xs={2}>
                      <MDButton
                        variant="contained"
                        color="success"
                        onClick={() => addVariableInMessageBroad("{{full_name}}")}
                      >
                        Nome completo
                      </MDButton>
                    </Grid>
                  </Grid>
                </MDBox>
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
                        label={`Texto Botão ${index + 1}`}
                        variant="outlined"
                        fullWidth
                        value={button.title}
                        onChange={(e) => handleButtonChange(index, "title", e.target.value)}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={5}>
                      <TextField
                        label={`URL Botão ${index + 1}`}
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
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleClose} severity={alertSeverity}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
        <MDTypography variant="h6" color="white" sx={{ ml: 2 }}>
          {loadingMessage}
        </MDTypography>
      </Backdrop>
    </DashboardLayout>
  );
}

export default Broadcast;
