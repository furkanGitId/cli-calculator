import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/calc";

export const getCalculationHistory = async () => {
  const response = await axios.get(`${API_BASE_URL}/history`);
  return response.data;
};

export const calculateExpression = async (expression) => {
  const response = await axios.post(`${API_BASE_URL}/calculate`, {
    expression,
  });
  return response.data;
};

export const updateCalculation = async (calc_id, expression) => {
  const response = await axios.put(`${API_BASE_URL}/calculate/${calc_id}`, {
    expression,
  });
  return response.data;
};

export const deleteHistory = async (ids) => {
  await axios.delete(`${API_BASE_URL}/delete_history`, {
    data: { ids },
  });
};

export const truncateHistory = async () => {
  await axios.delete(`${API_BASE_URL}/truncate_history`, {
    data: { confirm: true },
  });
};





