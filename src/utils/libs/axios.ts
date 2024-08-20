import axios from "axios";


const axiosInstance = () => {
  const defaultOptions = {
    baseURL: "https://attendance-backend-24xu.onrender.com/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  };

  let instance = axios.create(defaultOptions);

  instance.interceptors.request.use(function (config) {
    const token = localStorage.getItem('access_token');
    config.headers.Authorization =  token ? `Bearer ${token}` : '';
    return config;
  });

  
  return instance;
};

export default axiosInstance;

export const createDepartment = async (name: string) => {
  const response = await axiosInstance().post('/department/create', { name });
  return response.data;
};

export const updateDepartment = async (id: number, name: string) => {
  const response = await axiosInstance().put(`/department/${id}`, { name });
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await axiosInstance().delete(`/department/${id}`);
  return response.data;
};

export const createPosition = async (name: string, department_id: number) => {
  const response = await axiosInstance().post('/position/create', { name, department_id });
  return response.data;
};

export const updatePosition = async (id: number, name: string, department_id: number) => {
  const response = await axiosInstance().put(`/position/${id}`, { name, department_id });
  return response.data;
};

export const deletePosition = async (id: number) => {
  const response = await axiosInstance().delete(`/position/${id}`);
  return response.data;
};

export const createUser = async (employee_id: string, password: string, role: string, full_name: string, department_id: number, position_id: number, phone: string, email: string) => {
  const response = await axiosInstance().post(`/user/create`, {employee_id, password, role, full_name, department_id, position_id, phone, email});
  return response.data;
};

export const updateUser = async (id: number, employee_id: string, password: string, role: string, full_name: string, department_id: number, position_id: number, phone: string, email: string) => {
  const response = await axiosInstance().put(`/user/${id}`, {employee_id, password, role, full_name, department_id, position_id, phone, email});
  return response.data;
};

