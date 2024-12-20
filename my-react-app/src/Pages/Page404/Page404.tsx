import { NavLink } from "react-router-dom";
import "./Page404.css";

export function Page404(): JSX.Element {
  return (
    <div className="Page404">
      <h1>404</h1>
      <p>Oops! The page you are looking for doesn't exist.</p>
      <NavLink to="/" className="back-home-link">
        Back to Home
      </NavLink>
    </div>
  );
}
