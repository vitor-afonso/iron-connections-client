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
    
    let res = await axios.post(`${API_URL}/upload`, file, {onUploadProgress: progressEvent => {
      console.log('Upload', Math.round(progressEvent.loaded / progressEvent.total * 100) + "%");
    }}, { 
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    } );
    
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

export const addNewComment = (postId, comment) => {
  return axios.post(`${API_URL}/posts/:${postId}/comment`, comment, {
    headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
  });
};

export const updatePost = (updatedPost) => {
  return axios.put(`${API_URL}/projects/${updatedPost._id}`, updatedPost, {
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
