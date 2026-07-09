import { Navigate, useLocation, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROUTES } from "../utility/constants";

function RoleBasedRoutes({ allowedRoles, children }) {
  const location = useLocation(); //location is used to get the current location of the user, which we can use to redirect them back to the page they were trying to access after they log in, if they are not authenticated.
  const { user, isAuthenticated, isInitialized } = useSelector(
    (state) => state.auth,
  );
  if (!isInitialized) {
    //isInitialized is a flag that we can use to check if we have attempted to check the user's authentication status, which can be useful for controlling the rendering of our application (e.g., showing a loading spinner while we check the auth status). If isInitialized is false, it means we are still checking the user's authentication status, so we can show a loading spinner or some other indication that we are checking the auth status, and we can prevent rendering the protected page until we have determined whether the user is authenticated or not.
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <div className="spinner-border">
          <span className="visually-hidden">Loading... </span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }
  //check is user has required role
  const hasRequiredRole = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user.role)
    : user.role === allowedRoles; //here we check if allowedRoles is an array, if it is we check if user.role is included in the array, if it's not we check if user.role is equal to allowedRoles (which would be a single role)
  if (!hasRequiredRole && allowedRoles) {
    return (
      <div className="container py-5" style={{ marginTop: "80px" }}>
        <div className="row justify-content-center">
          <div className="col-md-6 text-center">
            <div className="card border-danger">
              <div className="card-body p-5">
                <i
                  className="bi bi-shield-exclamation text-danger"
                  style={{ fontSize: "64px" }}
                ></i>
                <h1 className="text-danger mt-3">Access Denied</h1>
                <p className="text-muted mb-3">
                  You don't have permission to access this page.
                </p>
                <div className="p-3 rounded mb-4">
                  <p className="mb-1">
                    <strong>Your role:</strong>
                    <span className="badge bg-secondary">{user.role}</span>
                  </p>
                  <p className="mb-0">
                    <strong>Required roles:</strong>

                    <span className="badge bg-primary">
                      {Array.isArray(allowedRoles)
                        ? allowedRoles.map((role, index) => (
                            <span key={role} className="badge bg-primary me-1">
                              {role}
                            </span>
                          ))
                        : allowedRoles}
                    </span>
                  </p>
                </div>
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <button className="btn btn-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Go Back
                  </button>
                  <a href="#" className="btn btn-primary">
                    <i className="bi bi-house me-2"></i>
                    Go Home
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return children; // If the user has the required role, render the child components (the protected page)
}

export default RoleBasedRoutes;
