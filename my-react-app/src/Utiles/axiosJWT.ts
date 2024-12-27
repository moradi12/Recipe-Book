import axios from 'axios';
import { updateTokenAction } from '../Pages/Redux/AuthReducer';
import { recipeSystem } from '../Pages/Redux/store';

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
    request => {       
        request.headers.Authorization = `Bearer ${recipeSystem.getState().auth.token}`;
        console.log("BEFORE POST",request.headers.Authorization)
        return request;
    }
);

axiosJWT.interceptors.response.use(
    response => {
        const authorization:string = response.headers.authorization.split(' ')[1];
        recipeSystem.dispatch(updateTokenAction(authorization));      
        sessionStorage.setItem('jwt', authorization);               
        return response;
    }
);

export default axiosJWT;