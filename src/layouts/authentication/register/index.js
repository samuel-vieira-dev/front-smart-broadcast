import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "services/authService";

// react-router-dom components
import { Link } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import "./Register.css";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    if (!name) newErrors.name = "Campo Obrigatório";
    if (!email) newErrors.email = "Campo Obrigatório";
    if (!password) newErrors.password = "Campo Obrigatório";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    try {
      const data = await register(name, email, password);
      localStorage.setItem("token", data.token);
      navigate("/broadcast");
    } catch (error) {
      console.error("Login failed:", error);
      if (error.error === "Email already registered") {
        Swal.fire({
          title: "Email já existente",
          text: "Este email já existe em nossa base de dados. Tente novamente com outro email",
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Erro!",
          text: "Algo deu errado. Tente novamente mais tarde",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    }
  };

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    if (field === "name") setName(value);
    if (field === "email") setEmail(value);
    if (field === "password") setPassword(value);

    if (value.trim()) {
      setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <BasicLayout image={bgImage}>
      <Card>
        <MDBox
          variant="gradient"
          bgColor="info"
          borderRadius="lg"
          coloredShadow="info"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Registre-se
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <MDBox component="form" role="form">
            <MDBox mb={2}>
              <MDInput
                type="text"
                label="Nome Completo"
                fullWidth
                value={name}
                onChange={(e) => handleInputChange(e, "name")}
                error={!!errors.name}
                helperText={errors.name}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type="email"
                label="Email"
                fullWidth
                value={email}
                onChange={(e) => handleInputChange(e, "email")}
                error={!!errors.email}
                helperText={errors.email}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                type={showPassword ? "text" : "password"}
                label="Senha"
                fullWidth
                value={password}
                onChange={(e) => handleInputChange(e, "password")}
                error={!!errors.password}
                helperText={errors.password}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={togglePasswordVisibility}>
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </MDBox>
            <MDBox mt={4} mb={1} display="flex" alignItems="center">
              <MDButton variant="gradient" color="info" fullWidth onClick={handleSubmit}>
                Registrar
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
      </Card>
    </BasicLayout>
  );
}

export default Register;
