import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Species from "../pages/MySpecies";
import { ROUTES } from "../utility/constants";
import RoleBasedRoutes from "./RolebasedRoutes";
import ManageSpecies from "../components/ManageSpecies";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.MANAGE_SPECIES} element={<ManageSpecies />} />
     {/*<Route path={ROUTES.MANAGE_USERS} element={<ManageUsers />} />*/} 

{/* access only if authenticated */}
      <Route
        path={ROUTES.SPECIES}
        element={
          <RoleBasedRoutes>
            <Species />
          </RoleBasedRoutes>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
