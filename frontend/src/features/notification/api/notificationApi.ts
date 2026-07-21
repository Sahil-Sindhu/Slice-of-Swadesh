import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/notifications',
  withCredentials: true
});

export const getNotifications = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/?page=${page}&limit=${limit}`);
  return data.data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get('/unread');
  return data.data.count;
};

export const markAsRead = async (id: string) => {
  const { data } = await api.patch(`/${id}/read`);
  return data.data;
};

export const markAllAsRead = async () => {
  const { data } = await api.patch('/read-all');
  return data.data;
};

export const getAdminNotifications = async (page = 1, limit = 10) => {
  const { data } = await api.get(`/admin?page=${page}&limit=${limit}`);
  return data.data;
};
