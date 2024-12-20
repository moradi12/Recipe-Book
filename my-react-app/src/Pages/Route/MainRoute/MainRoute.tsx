import { Route, Routes } from "react-router-dom";
import { Main } from "../../../Layout/Main/Main";
import Login from "../../Login/Login";
import { Page404 } from "../../Page404/Page404";
import Register from "../../Register/Register";

export function MainRoute(): JSX.Element {
  return (
    <div className="MainRoute">
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </div>
  );
}
