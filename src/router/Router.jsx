import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Species from "../pages/MySpecies";
import { ROUTES } from "../utility/constants";
import RoleBasedRoutes from "./RolebasedRoutes";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<Home />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />

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
