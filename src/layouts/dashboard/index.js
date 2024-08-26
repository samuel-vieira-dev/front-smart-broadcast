// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import TextField from "@mui/material/TextField";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Slide from "@mui/material/Slide";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";

// Dashboard components
import MDButton from "components/MDButton";

// Dark thema
import { ThemeProvider, createTheme } from "@mui/material/styles";
import themeRTL from "assets/theme/theme-rtl";
import { useMaterialUIController } from "context";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState, useCallback } from "react";
import { jwtDecode } from "jwt-decode"; // Não mexa aqui. De preferência use aspas duplas nessa página.
import axios from "axios";
import "dayjs/locale/pt-br";

function Dashboard() {
  const [controller] = useMaterialUIController();
  const { darkMode, sidenavColor } = controller;

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });
  const [dadosBroad, setDadosBroad] = useState(null);
  const [alertMessage, setAlertMessage] = useState("");
  const [open, setOpen] = useState(false);
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
    const fetchData = async () => {
      const token = getToken();
      if (!token) return;
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        const response = await axios.get(
          `https://webhook-messenger-67627eb7cfd0.herokuapp.com/broadcast/getDetails/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDadosBroad(response.data);
      } catch (error) {
        console.error("Erro ao enviar broadcast:", error);
        setAlertMessage("Erro ao enviar broadcast. Por favor, tente novamente.");
        setAlertSeverity("error");
        setOpen(true);
      }
    };
    fetchData();
  }, []);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  const TransitionUp = (props) => {
    return <Slide {...props} direction="up" />;
  };
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={6} mx={2} py={3} px={2}>
                <MDTypography variant="h3">Detalhes dos envios de broad</MDTypography>
              </MDBox>
              <MDBox pt={4} px={4} pb={3}>
                <ThemeProvider theme={darkMode ? darkTheme : themeRTL}>
                  <MDBox
                    style={{
                      display: "flex",
                      fontWeight: "bold",
                      paddingBottom: "20px",
                      borderBottom: "4px solid white",
                    }}
                  >
                    <TextField
                      label="Buscar"
                      variant="outlined"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      style={{ marginRight: "20px", flexGrow: 1 }}
                    />
                    <MDBox
                      style={{
                        display: "flex",
                        padding: 0,
                        gap: "4px",
                      }}
                    >
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker label="Data incial" />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                        <DatePicker label="Data final" />
                      </LocalizationProvider>
                    </MDBox>
                    <MDBox ml="8px">
                      <MDButton variant="gradient" color={sidenavColor} fullWidth>
                        Buscar
                      </MDButton>
                    </MDBox>
                  </MDBox>
                  <MDBox style={{ backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    {dadosBroad?.map((item) => (
                      <MDBox
                        key={item._id}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          padding: "20px",
                          borderBottom: "8px solid white",
                          gap: "10px",
                        }}
                      >
                        <MDBox style={{ flex: 1 }}>
                          <MDTypography variant="subtitle2" style={{ flex: 1 }}>
                            Nome do broadcast
                          </MDTypography>
                          <MDTypography variant="h6" style={{ flex: 1 }}>
                            {item.nameBroad || "Sem nome"}
                          </MDTypography>
                        </MDBox>
                        <MDBox variant="h6" style={{ flex: 1 }}>
                          <MDTypography variant="subtitle2" style={{ flex: 1 }}>
                            Data do Agendamento
                          </MDTypography>
                          <MDTypography variant="h6" style={{ flex: 1 }}>
                            {item.scheduledAt || "Não agendado"}
                          </MDTypography>
                        </MDBox>
                        <MDBox style={{ flex: 1 }}>
                          <MDTypography variant="subtitle2" style={{ flex: 1 }}>
                            Ações
                          </MDTypography>
                          <MDBox style={{ paddingTop: "10px" }}>
                            <VisibilityIcon style={{ marginRight: "20px" }}></VisibilityIcon>
                            <DeleteIcon></DeleteIcon>
                          </MDBox>
                        </MDBox>
                      </MDBox>
                    ))}
                  </MDBox>
                </ThemeProvider>
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
      {/* <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="weekend"
                title="Bookings"
                count={281}
                percentage={{
                  color: "success",
                  amount: "+55%",
                  label: "than lask week",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Today's Users"
                count="2,300"
                percentage={{
                  color: "success",
                  amount: "+3%",
                  label: "than last month",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="store"
                title="Revenue"
                count="34k"
                percentage={{
                  color: "success",
                  amount: "+1%",
                  label: "than yesterday",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="person_add"
                title="Followers"
                count="+91"
                percentage={{
                  color: "success",
                  amount: "",
                  label: "Just updated",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="website views"
                  description="Last Campaign Performance"
                  date="campaign sent 2 days ago"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="success"
                  title="daily sales"
                  description={
                    <>
                      (<strong>+15%</strong>) increase in today sales.
                    </>
                  }
                  date="updated 4 min ago"
                  chart={sales}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="completed tasks"
                  description="Last Campaign Performance"
                  date="just updated"
                  chart={tasks}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
        <MDBox>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={8}>
              <Projects />
            </Grid>
            <Grid item xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox> */}
    </DashboardLayout>
  );
}

export default Dashboard;
