import axios from 'axios';
import { updateToken } from '../Pages/Redux/slices/unifiedAuthSlice';
import { recipeSystem } from '../Pages/Redux/store';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
    request => {       
        request.headers.Authorization = `Bearer ${recipeSystem.getState().auth.token}`;
        return request;
    }
);

axiosJWT.interceptors.response.use(
    response => {
        const authorization:string = response.headers.authorization.split(' ')[1];
        recipeSystem.dispatch(updateToken(authorization));      
        sessionStorage.setItem('jwt', authorization);               
        return response;
    }
);

export default axiosJWT;