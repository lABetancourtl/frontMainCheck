import axios from 'axios';

export const getAllMantenimientos = () => {
    return axios.get('http://localhost:8000/tasks/api/v1/mantenimiento/')
};