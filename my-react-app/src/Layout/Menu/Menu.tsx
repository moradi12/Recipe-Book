import { NavLink } from "react-router-dom";
import "./Menu.css";

export function Menu(): JSX.Element {
  return (
    <div className="Menu">
      | <NavLink to="/all">Coupons</NavLink> |
      <NavLink to="/all/companies">List of Companies</NavLink> |
      <NavLink to="/admin/add/company">Add Company</NavLink> |
      <NavLink to="/admin/customers">Customer List</NavLink>
    </div>
  );
}
