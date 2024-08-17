import axios from "axios";

// Create Axios instances
const Api = axios.create({
  baseURL: "https://localhost:5500", // Ensure your backend is using HTTPS
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiWithFormData = axios.create({
  baseURL: "https://localhost:5500", // Ensure your backend is using HTTPS
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    // Token will be set dynamically
  },
});

// Token configuration
const getAuthToken = () => {
  return `Bearer ${localStorage.getItem("token")}`;
};

// Set authorization header dynamically
const setAuthHeader = (axiosInstance) => {
  axiosInstance.defaults.headers.common['Authorization'] = getAuthToken();
};

// Apply token to instances
setAuthHeader(Api);
setAuthHeader(ApiWithFormData);

// API Endpoints

// create user api
export const createUserApi = (data) => Api.post("/api/user/create", data);

// login user api
export const loginUserApi = (data) => Api.post("/api/user/login", data);

// update the user
export const editUserApi = (id, formData) =>
  Api.put(`/api/user/editProfile/${id}`, formData);

// get user by id
export const getUserByIdApi = (id) => Api.get(`/api/user/getUser/${id}`);

// update user password
export const editUserPassword = (id, formData) =>
  Api.put(`/api/user/editPassword/${id}`, formData);

// create new subscriber
export const createSubscriberApi = (formData) =>
  Api.post("/api/subscriber/add", formData);

// fetch all subscribers
export const getAllSubscribersApi = () => Api.get("/api/subscriber/all");

// fetch total subscriber count
export const totalSubscriberCountApi = () =>
  Api.get("/api/subscriber/count");

// delete subscriber by id
export const deleteSubscriberByIdApi = (id) =>
  Api.delete(`/api/subscriber/delete/${id}`);

// Get subscriber By Id
export const getSubscriberByIdApi = (id) =>
  Api.get(`/api/subscriber/get/${id}`);

// Update subscriber by id
export const updateSubscriberByIdApi = (id, formData) =>
  Api.put(`/api/subscriber/edit/${id}`, formData);

// Create Group
export const createGroupApi = (data) =>
  Api.post("/api/group/add", data);

// Fetch Group
export const getAllGroupApi = () => Api.get("/api/group/all");

// Fetch Group by Id
export const getGroupByIdApi = (id) => Api.get(`/api/group/get/${id}`);

// Update Group By Id
export const updateGroupByIdApi = (id, data) =>
  Api.put(`/api/group/update/${id}`, data);

// Delete Group by Id
export const deleteGroupByIdApi = (id) =>
  Api.delete(`/api/group/delete/${id}`);

// Create new broadcast
export const createBroadcastApi = (data) =>
  Api.post("/api/broadcast/create", data);

// Fetch All broadcast
export const getAllBroadcastApi = () => Api.get("/api/broadcast/all");

// fetch total broadcast count
export const totalBroadcastCountApi = () =>
  Api.get("/api/broadcast/count");

// Get Single Broadcast
export const getSingleBroadcastApi = (id) =>
  Api.get(`/api/broadcast/get/${id}`);

// Delete Broadcast
export const deleteBroadcastByApi = (id) =>
  Api.delete(`/api/broadcast/delete/${id}`);

// Update Broadcast
export const updateBroadcastApi = (id, data) =>
  Api.put(`/api/broadcast/update/${id}`, data);

// Add subscriber through CSV
export const addSubscriberCSVApi = (formData) =>
  ApiWithFormData.post("/api/subscriber/add-subscribers-csv", formData);

// Forgot password and send otp Api
export const sendOTPApi = (formData) =>
  Api.post("/api/user/forgot-password", formData);

// Reset password after otp send to user in email
export const resetPasswordApi = (formData) =>
  Api.post("/api/user/reset-password", formData);

// Unsubscribe api
export const unsubscribeApi = (userId, subscriberId) =>
  Api.put(`/api/user/unsubscribe/${userId}/${subscriberId}`);

// Update user image api
export const updateUserImageApi = (id, formData) =>
  ApiWithFormData.put(`/api/user/uploadImage/${id}`, formData);

// Subscriber count for Graph
export const getSubscriberCountForGraph = () =>
  Api.get("/api/subscriber/countForGraph");

// Broadcast count for graph
export const getBroadcastCountForGraph = () =>
  Api.get("/api/broadcast/countForGraph");

// Growth rate
export const getGrowthRate = () => Api.get("/api/user/getGrowthRate");

// Export subscribers in CSV
export const exportSubscriberInCSV = () =>
  Api.get("/api/subscriber/exportCSV");
