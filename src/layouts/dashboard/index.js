// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDBox from "components/MDBox";
import { DataGrid } from "@mui/x-data-grid";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDTypography from "components/MDTypography";

// Data
import reportsBarChartData from "layouts/dashboard/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboard/data/reportsLineChartData";

// Dashboard components
import Projects from "layouts/dashboard/components/Projects";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";

// Dark thema
import { ThemeProvider, createTheme } from "@mui/material/styles";
import themeRTL from "assets/theme/theme-rtl";
import { useMaterialUIController } from "context";

function Dashboard() {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const localizedTextsMap = {
    columnMenuUnsort: "não classificado",
    columnMenuSortAsc: "Classificar por ordem crescente",
    columnMenuSortDesc: "Classificar por ordem decrescente",
    columnMenuFilter: "Filtro",
    columnMenuHideColumn: "Ocultar",
    columnMenuShowColumns: "Mostrar colunas",
  };

  const columns = [
    { field: "id", headerName: "Id Broad", width: 120 },
    { field: "mensage", headerName: "Mensagem", width: 300 },
    { field: "scheduleAt", headerName: "Agendamento", width: 200 },
    {
      field: "pages",
      headerName: "Páginas",
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      description: "Esse status mostra quantas mensagem deram certo de ser enviada",
      sortable: false,
      width: 250,
    },
  ];

  const rows = [
    {
      id: 1,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Jon",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 2,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Cersei",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 3,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Jaime",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 4,
      scheduleAt: "Sem agendamento",
      mensage: "Arya",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 5,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Daenerys",
      pages: null,
      status: "500 enviado 5 não enviado",
    },
    {
      id: 6,
      scheduleAt: "20/12/2024 10h30m",
      mensage: null,
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 7,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Ferrara",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 8,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Rossini",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
    {
      id: 9,
      scheduleAt: "20/12/2024 10h30m",
      mensage: "Harvey",
      pages: "Bia triz, romeeiro brito, breno brenom teste teste",
      status: "500 enviado 5 não enviado",
    },
  ];
  const { sales, tasks } = reportsLineChartData;

  return (
    <DashboardLayout>
      <DashboardNavbar />
      {/* <MDBox
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="80vh" // Ajuste conforme necessário para centralizar verticalmente
      >
        <MDTypography variant="h4" color="text">
          Em breve...
        </MDTypography>
      </MDBox> */}
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox pt={6} mx={2} py={3} px={2}>
                <MDTypography variant="h3">Detalhes dos envios de broad</MDTypography>
              </MDBox>
              <MDBox pt={4} px={4} pb={3}>
                <ThemeProvider theme={darkMode ? darkTheme : themeRTL}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    localeText={localizedTextsMap}
                  />
                </ThemeProvider>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
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
