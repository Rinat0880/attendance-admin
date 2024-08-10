import axios from 'axios';

const API_BASE_URL = 'https://attendance-backend-24xu.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Функция для установки токена в заголовках
export const setAuthToken = (token: string) => {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

// Аутентификация
export const signIn = async (employee_id: string, password: string) => {
  const response = await api.post('/sign-in', { employee_id, password });
  return response.data;
};

// Другие запросы
export const createDepartment = async (name: string) => {
  const response = await api.post('/department/create', { name });
  return response.data;
};

export const updateDepartment = async (id: number, name: string) => {
  const response = await api.put(`/department/${id}`, { name });
  return response.data;
};

export const deleteDepartment = async (id: number) => {
  const response = await api.delete(`/department/${id}`);
  return response.data;
};

export const getDepartments = async () => {
  const response = await api.get('/department/list');
  return response.data;
};

export const getDepartmentById = async (id: number) => {
  const response = await api.get(`/department/${id}`);
  return response.data;
};

// Должности
export const createPosition = async (name: string, department_id: number) => {
  const response = await api.post('/position/create', { name, department_id });
  return response.data;
};

export const updatePosition = async (id: number, name: string, department_id: number) => {
  const response = await api.put(`/position/${id}`, { name, department_id });
  return response.data;
};

export const deletePosition = async (id: number) => {
  const response = await api.delete(`/position/${id}`);
  return response.data;
};

export const getPositions = async (department_id?: number, search?: string) => {
  const response = await api.get('/position/list', {
    params: {
      department_id,
      search,
    },
  });
  return response.data;
};

export const getPositionById = async (id: number) => {
  const response = await api.get(`/position/${id}`);
  return response.data;
};

export default api;
