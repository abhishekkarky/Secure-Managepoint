import axios from "axios";

const Api = axios.create({
  baseURL: "https://localhost:5500", // Change to https
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const ApiWithFormData = axios.create({
  baseURL: "https://localhost:5500", // Change to https
  withCredentials: true,
  headers: {
    "Content-Type": "multipart/form-data",
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Token
const config = {
  headers: {
    authorization: `Bearer ${localStorage.getItem("token")}`,
  },
};

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
  Api.post("/api/subscriber/add", formData, config);

// fetch all subscribers
export const getAllSubscribersApi = () =>
  Api.get("/api/subscriber/all", config);

// fetch total subscriber count
export const totalSubscriberCountApi = () =>
  Api.get("/api/subscriber/count", config);

// delete subscriber by id
export const deleteSubscriberByIdApi = (id) =>
  Api.delete(`/api/subscriber/delete/${id}`, config);

// Get subscriber By Id
export const getSubscriberByIdApi = (id) =>
  Api.get(`/api/subscriber/get/${id}`, config);

// Update subscriber by id
export const updateSubscriberByIdApi = (id, formData) =>
  Api.put(`/api/subscriber/edit/${id}`, formData, config);

// Create Group
export const createGroupApi = (data) =>
  Api.post("/api/group/add", data, config);

// Fetch Group
export const getAllGroupApi = () => Api.get("/api/group/all", config);

// Fetch Group by Id
export const getGroupByIdApi = (id) => Api.get(`/api/group/get/${id}`, config);

// Update Group By Id
export const updateGroupByIdApi = (id, data) =>
  Api.put(`/api/group/update/${id}`, data, config);

// Delete Group by Id
export const deleteGroupByIdApi = (id) =>
  Api.delete(`/api/group/delete/${id}`, config);

// Create new broadcast
export const createBroadcastApi = (data) =>
  Api.post("/api/broadcast/create", data, config);

// Fetch All broadcast
export const getAllBroadcastApi = () => Api.get("/api/broadcast/all", config);

// fetch total broadcast count
export const totalBroadcastCountApi = () =>
  Api.get("/api/broadcast/count", config);

// Get Single Broadcast
export const getSingleBroadcastApi = (id) =>
  Api.get(`/api/broadcast/get/${id}`, config);

// Delete Broadcast
export const deleteBroadcastByApi = (id) =>
  Api.delete(`/api/broadcast/delete/${id}`, config);

// Update Broadcast
export const updateBroadcastApi = (id, data) =>
  Api.put(`/api/broadcast/update/${id}`, data, config);

// Add subscriber through CSV
export const addSubscriberCSVApi = (formData) =>
  ApiWithFormData.post("/api/subscriber/add-subscribers-csv", formData, config);

// Forgot password and send otp Api
export const sendOTPApi = (formData) =>
  Api.post("/api/user/forgot-password", formData);

// Reset password after otp send to user in email
export const resetPasswordApi = (formData) =>
  Api.post("/api/user/reset-password", formData);

// unsubscribed api
export const unsubscribeApi = (userId, subscriberId) =>
  Api.put(`/api/user/unsubscribe/${userId}/${subscriberId}`);

// update user image api
export const updateUserImageApi = (id, formData) =>
  ApiWithFormData.put(`/api/user/uploadImage/${id}`, formData);

// Subscriber count for Graph
export const getSubscriberCountForGraph = () =>
  Api.get("/api/subscriber/countForGraph", config);

// broadcast count for graph
export const getBroadcastCountForGraph = () =>
  Api.get("/api/broadcast/countForGraph", config);

// growth rate
export const getGrowthRate = () => Api.get("/api/user/getGrowthRate", config);

// export subscribers in csv
export const exportSubscriberInCSV = () =>
  Api.get("/api/subscriber/exportCSV", config);
