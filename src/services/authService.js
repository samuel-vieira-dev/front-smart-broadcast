import axios from "axios";
import config from "../config";

const login = async (email, password) => {
  try {
    const response = await axios.post(`${config.API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

const register = async (name, email, password) => {
  try {
    const response = await axios.post(
      `https://webhook-messenger-67627eb7cfd0.herokuapp.com/api/register`,
      {
        name,
        email,
        password,
      }
    );
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};

export { login, register };
