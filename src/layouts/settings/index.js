import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Corrigi o erro de importação

// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

const Settings = () => {
  const [verifyToken, setVerifyToken] = useState("");
  const [appAccessToken, setAppAccessToken] = useState("");
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [responseText, setResponseText] = useState("");
  const [open, setOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("success");
  const navigate = useNavigate();

  const getToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/authentication/sign-in");
      return null;
    }
    return token;
  };

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

      const {
        webhook_token,
        app_access_token,
        app_client_id,
        app_secret_key,
        webhook_url,
        response_text,
      } = response.data;
      setVerifyToken(webhook_token || "");
      setAppAccessToken(app_access_token || "");
      setClientId(app_client_id || "");
      setClientSecret(app_secret_key || "");
      setCallbackUrl(webhook_url || "");
      setResponseText(response_text || "");

      setAlertMessage("Informações carregadas com sucesso!");
      setAlertSeverity("success");
      setOpen(true);
    } catch (error) {
      console.error("Error fetching settings:", error);
      setAlertMessage("Erro ao carregar informações.");
      setAlertSeverity("error");
      setOpen(true);
      if (error.response && error.response.status === 401) {
        localStorage.removeItem("token");
        navigate("/authentication/sign-in");
      }
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    if (!token) return;

    const data = {
      verifyToken,
      appAccessToken,
      clientId,
      clientSecret,
      callbackUrl,
      responseText,
    };

    try {
      await axios.post("https://webhook-messenger-67627eb7cfd0.herokuapp.com/api/settings", data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setAlertMessage("Configurações salvas com sucesso!");
      setAlertSeverity("success");
      setOpen(true);
      // navigate("/dashboard");
    } catch (error) {
      console.error("Error saving settings:", error);
      setAlertMessage("Erro ao salvar configurações. Por favor, tente novamente.");
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
                  Configurações
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={3}>
                <form onSubmit={handleSubmit}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label="Verify Token"
                        variant="outlined"
                        fullWidth
                        value={verifyToken}
                        placeholder="Digite o Verify Token"
                        onChange={(e) => setVerifyToken(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="App Access Token"
                        variant="outlined"
                        fullWidth
                        value={appAccessToken}
                        placeholder="Digite o App Access Token"
                        onChange={(e) => setAppAccessToken(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Client ID"
                        variant="outlined"
                        fullWidth
                        value={clientId}
                        placeholder="Digite o Client ID"
                        onChange={(e) => setClientId(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Client Secret"
                        variant="outlined"
                        fullWidth
                        value={clientSecret}
                        placeholder="Digite o Client Secret"
                        onChange={(e) => setClientSecret(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Callback URL"
                        variant="outlined"
                        fullWidth
                        value={callbackUrl}
                        placeholder="Digite a Callback URL"
                        onChange={(e) => setCallbackUrl(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label="Response Text"
                        variant="outlined"
                        fullWidth
                        value={responseText}
                        placeholder="Digite o Response Text"
                        onChange={(e) => setResponseText(e.target.value)}
                      />
                    </Grid>
                  </Grid>
                  <MDBox mt={4} mb={1} display="flex" justifyContent="center">
                    <MDButton variant="contained" color="success" type="submit">
                      Salvar
                    </MDButton>
                  </MDBox>
                </form>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        TransitionComponent={TransitionUp}
        anchorOrigin={{ vertical: "center", horizontal: "center" }}
      >
        <Alert
          onClose={handleClose}
          severity={alertSeverity}
          style={{ backgroundColor: "#4CAF50", color: "white" }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>
    </DashboardLayout>
  );
};

export default Settings;
