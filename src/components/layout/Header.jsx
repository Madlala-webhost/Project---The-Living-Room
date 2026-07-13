import Logo from "../../assets/logo/file.svg";
import { ROUTES } from "../../utility/constants";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { clearUser } from "../../store/slice/authSlice";
import { useLogOutUserMutation } from "../../store/api/authAPI";

function Header({ handleSpeciesCount }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logOutUser] = useLogOutUserMutation();
  const { isAuthenticated, user, isInitialized, isAdmin } = useSelector(
    (state) => state.auth,
  ); //Here we are using useSelector to access the authentication state from the Redux store. We are destructuring the isAuthenticated, user, isInitialized, and isAdmin properties from the auth slice of the state. This allows us to conditionally render different parts of the header based on whether the user is logged in, their role, and whether the authentication state has been initialized.

  const handleLogout = async () => {
    try {
      await logOutUser().unwrap();
      dispatch(clearUser());
      navigate(ROUTES.HOME);
    } catch {}
  };

  return (
    <nav className="navbar navbar-expand-sm pt-3 border-bottom shadow-sm">
      <div className="container">
        <Link
          className="navbar-brand fw-bold d-flex align-items-center text-success"
          to={ROUTES.HOME}
        >
          <div>
            <div id="icon-container" className="me-2">
              <img
                src={Logo}
                alt="Logo"
                style={{ width: "120px", height: "120px" }}
              />
            </div>
          </div>
          The Living Room
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
            <li className="nav-item me-4 mb-2 mb-sm-0">
              <Link
                className="nav-link position-relative btn btn-outline-success rounded-pill px-3 border-2"
                to={ROUTES.SPECIES}
                style={{
                  borderWidth: "2px",
                  borderStyle: "solid",
                  transition: "all 0.3s ease",
                  width: "200px",
                }}
              >
                <i className="bi bi-house-add-fill"></i>
                <span> Your Species Home </span>
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-success">
                  {handleSpeciesCount()}
                </span>
              </Link>
            </li>

            <li className="nav-item me-3 mb-2 mb-sm-0">
              <button
                className="btn btn-outline-secondary rounded-pill px-3"
                onclick="toggleTheme()"
              >
                <i className="bi bi-sun"></i>
              </button>
            </li>
            {!isInitialized ? (
              <li className="nav-item me-2 d-flex align-items-center text-muted">
                Checking session...
              </li>
            ) : isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <button
                    className="nav-link dropdown-toggle btn btn-link"
                    type="button"
                    id="navbarDropdown"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="bi bi-person me-1"></i>
                    {isAuthenticated ? user.displayName : "User"}
                  </button>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="navbarDropdown"
                    style={{ minWidth: "200px" }}
                  >
                    <li>
                      <Link className="dropdown-item" to={ROUTES.MANAGE_SPECIES}>
                        <i className="bi bi-leaf-fill me-2"></i>
                        Manage my species
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>

                    <li>
                      <Link className="dropdown-item" to={ROUTES.MANAGE_USERS}>
                        <i className="bi bi-clipboard-data me-2"></i>
                        Manage users
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <button className="dropdown-item" onClick={handleLogout}>
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-2">
                  <Link className="nav-link px-4 py-2" to={ROUTES.LOGIN}>
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link px-0 py-2" to={ROUTES.REGISTER}>
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Header;
