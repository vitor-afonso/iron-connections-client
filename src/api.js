//jshint esversion:9

import axios from "axios";

const API_URL = `${process.env.REACT_APP_PROJECT_API}/api`;

export const getAllPosts = () => {
  return axios.get(`${API_URL}/posts`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const getPost = (id) => {
  return axios.get(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const deletePost = (id) => {
  return axios.delete(`${API_URL}/posts/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const uploadImage = async (file) => {

  try {
    
    let res = await axios.post(`${API_URL}/upload`, file, { 
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    
    return res.data;

  } catch (error) {
      
    console.log(error);
  }
};

export const addPost = (post) => {
  return axios.post(`${API_URL}/posts`, post, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};


export const updatePost = (updatedPost, postId) => {
  return axios.put(`${API_URL}/posts/${postId}`, updatedPost, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const addNewComment = (postId, comment) => {
  return axios.post(`${API_URL}/posts/${postId}/comment`, comment, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const deleteComment = (postId, commentId) => {
  return axios.delete(`${API_URL}/posts/${postId}/comment/delete?commentId=${commentId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const getUsers = () => {
  return axios.get(`${API_URL}/users/`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const getUser = (userId) => {
  return axios.get(`${API_URL}/users/${userId}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const updateUser = (updatedUser, userId) => {
  return axios.put(`${API_URL}/users/${userId}`, updatedUser, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const addFollower = (userId, followerId) => {
  return axios.put(`${API_URL}/add-follower/${userId}?followerId=${followerId}`,{}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};
export const removeFollower = (userId, followerId) => {
  return axios.put(`${API_URL}/remove-follower/${userId}?followerId=${followerId}`,{}, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const deleteUser = (id) => {
  return axios.delete(`${API_URL}/users/${id}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const signup = (user) => {
  return axios.post(`${API_URL}/signup`, user);
};

export const login = (user) => {
  return axios.post(`${API_URL}/login`, user);
};

export const verify = (storedToken) => {
  return axios.get(`${API_URL}/verify`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};
