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

export { login };
