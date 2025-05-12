import axios from 'axios';

export const getAllMantenimientos = () => {
    return axios.get('https://backmaincheck.onrender.com/tasks/tasks/api/v1/mantenimiento/')
};