import { NavLink, Outlet } from "react-router-dom";

export const Nav = () => {
  return (
    <>
      <div className="py-1">
        <div>
          <ul className="menu menu-compact menu-horizontal gap-1">
            <li>
              <NavLink className="p-0 px-1" to="/">
                Home
              </NavLink>
            </li>
            <li>
              <NavLink className="p-0 px-1" to="/event-form">
                Forms
              </NavLink>
            </li>
            <li>
              <NavLink className="p-0 px-1" to="/parts-form">
                Parts
              </NavLink>
            </li>
            <li>
              <NavLink className="p-0 px-1" to="/about">
                About
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className="p-1">
        <Outlet></Outlet>
      </div>
    </>
  );
};
