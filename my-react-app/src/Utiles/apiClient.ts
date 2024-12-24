import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:8080/api/recipes', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;
