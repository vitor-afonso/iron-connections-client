//jshint esversion:9

import axios from 'axios';

const API_URL = `${process.env.REACT_APP_PROJECT_API}/api`;

//token to be sent to protected route
const storedToken = localStorage.getItem('authToken');

export const getAllPosts = () => {
    return axios.get(`${API_URL}/posts`, { headers: { Authorization: `Bearer ${storedToken}` } });
};

export const getPost = (id) => {
    return axios.get(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${storedToken}`}});
};

export const deletePost = (id) => {
    return axios.delete(`${API_URL}/posts/${id}`, { headers: { Authorization: `Bearer ${storedToken}`}});
};

export const addPost = (post) => {
    return axios.post(`${API_URL}/posts`, post, { headers: { Authorization: `Bearer ${storedToken}` } });
};

export const addNewComment = (postId, comment) => {
    return axios.post(`${API_URL}/posts/:${postId}/comment`, comment, { headers: { Authorization: `Bearer ${storedToken}` } });
};

export const updatePost = (updatedPost) => {
    return axios.put(`${API_URL}/projects/${updatedPost._id}`, updatedPost, { headers: { Authorization: `Bearer ${storedToken}`}});
};

export const signup = (user) => {
    return axios.post(`${API_URL}/signup`, user);
};

export const login = (user) => {
    return axios.post(`${API_URL}/login`, user);
};

export const verify = (storedToken) => {
    return axios.get(`${API_URL}/verify`, {headers: { Authorization: `Bearer ${storedToken}` }});
};