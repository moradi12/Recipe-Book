import { NavLink } from "react-router-dom";
import notFoundImage from "../../assets/Pics/404Image.jpg";
import "./Page404.css";

export function Page404(): JSX.Element {
  return (
    <div className="Page404">
      <h1>404</h1>
      <p>
        Oops! The page you are looking for has taken a little detour. 
        Don’t worry, we’ll guide you back.
      </p>
      
      <NavLink to="/" className="back-home-link">
        Take me home
      </NavLink>

      <img 
        src={notFoundImage} 
        alt="404 not found" 
        className="not-found-img" 
      />
    </div>
  );
}
