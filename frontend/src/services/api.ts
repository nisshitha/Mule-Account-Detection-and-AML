import axios from "axios";

export const predictAccount = async (data: any) => {
  const response = await axios.post(
    "http://127.0.0.1:8000/predict",
    data
  );
  return response.data;
};