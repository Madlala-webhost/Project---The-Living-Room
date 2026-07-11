import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../utility/constants";
import { useRegisterUserMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/slice/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [registerUser] = useRegisterUserMutation(); // RTK Query mutation hook for user registration, which provides a function to trigger the registration API call and returns the result of the mutation (e.g., success or error response) that we can use to handle the registration process in our component.
  const [formData, setFormData] = useState({
    displayName: "",
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState({}); // we are using formErrors state to keep track of any validation errors for the form fields. This allows us to display error messages and highlight invalid fields in the UI when the user submits the form with invalid data. We will update this state based on the validation logic we implement for the form inputs, and we will use it to conditionally render error messages and apply error styles to the input fields in our JSX.
  const handleInputChange = (e) => {
    const { name, value } = e.target; // Get the name and value of the input field that triggered the change event
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Update the corresponding field in formData state with the new value
    }));
    if (formErrors[name]) {
      // If there is an existing error for this field, remove it when the user starts typing to correct the error
      setFormErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null, // Clear the error message for this field
      }));
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior, which would cause a page reload. We want to handle the form submission with our custom logic instead.
    setIsLoading(true); // Set loading state to true when the form is submitted, which can be used to disable the submit button and show a loading indicator while the registration process is in progress.
    try {
      const newErrors = {}; // Object to hold validation errors
      if (!formData.displayName.trim()) {
        // Validate that the displayName field is not empty. The trim() method is used to remove any leading or trailing whitespace from the input, ensuring that a string of only spaces is also considered invalid.
        newErrors.displayName = "Display name is required"; // If the displayName field is empty, add an error message to the newErrors object under the "displayName" key.
      }
      if (!formData.email.trim()) {
        // Validate that the email field is not empty. The trim() method is used to remove any leading or trailing whitespace from the input, ensuring that a string of only spaces is also considered invalid.
        newErrors.email = "Email is required"; // If the email field is empty, add an error message to the newErrors object under the "email" key.
      }

      if (!formData.password.trim()) {
        // Validate that the password field is not empty. The trim() method is used to remove any leading or trailing whitespace from the input, ensuring that a string of only spaces is also considered invalid.
        newErrors.password = "Password is required"; // If the password field is empty, add an error message to the newErrors object under the "password" key.
      }

      setFormErrors(newErrors); // Update the errors state with the newErrors object, which will trigger a re-render and display any validation error messages in the form.
      if (Object.keys(newErrors).length > 0) {
        // Check if there are any validation errors by checking if the newErrors object has any keys. If it does, it means there are validation errors that need to be addressed before proceeding with form submission.
        setIsLoading(false); // Set loading state back to false if there are validation errors, since we won't be proceeding with the submission until the errors are resolved.
        return; // If there are validation errors, exit the handlesubmit function early to prevent further processing (e.g., API call) until the errors are resolved.
      }

      const result = await registerUser(formData).unwrap();
      dispatch(setUser(result)); // we dispatch the setUser action with the result of the registration API call to update the auth state in our Redux store with the newly registered user's data. This allows us to keep track of the authenticated user in our application and manage access to protected routes and features based on the user's authentication status.

      toast.success("Registration successful! Please log in to continue."); // Show a success toast notification if the registration was successful, providing feedback to the user that their account was created successfully and prompting them to log in.
      navigate(ROUTES.LOGIN); // Navigate the user to the login page after successful registration, allowing them to log in with their new account.
    } catch (error) {
      const errorMessage = //this error meessage is returned from firebase and can be different formats
        typeof error?.data === "string"
          ? error.data
          : error?.data?.message || error?.message || "Registration failed";
      toast.error(`Error: ${errorMessage}`); // Show an error toast notification if there was an error during the API call, providing feedback to the user about what went wrong.
    } finally {
      setIsLoading(false); // Set loading state back to false after submission is complete (whether successful or not)
    }
  };

  return (
    <div className="pt-5 d-flex align-items-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card shadow border-0">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <div
                    className="d-inline-flex align-items-center justify-content-center bg-success rounded-circle mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    <i class="bi bi-leaf-fill"></i>
                  </div>
                  <h1 className="h3 mb-2 fw-bold">Create Account</h1>
                  <p className="text-muted">Join us and start shopping today</p>
                </div>
                {formErrors && Object.keys(formErrors).length > 0 && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                    ERROR
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                    ></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="form-floating mb-3">
                    <input
                      type="text"
                      className={`form-control ${formErrors.displayName ? "is-invalid" : ""}`}
                      id="displayName"
                      name="displayName"
                      placeholder="Full Name"
                      value={formData.displayName}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="displayName">
                      <i className="bi bi-person me-2"></i>Full Name
                    </label>
                    <div className="invalid-feedback">
                      {formErrors.displayName}
                    </div>
                  </div>

                  <div className="form-floating mb-3">
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                      id="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="email">
                      <i className="bi bi-envelope me-2"></i>Email Address
                    </label>
                    <div className="invalid-feedback">{formErrors.email}</div>
                  </div>

                  <div className="form-floating mb-4">
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                      id="password"
                      name="password"
                      placeholder="Password"
                      minLength="6"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="password">
                      <i className="bi bi-lock me-2"></i>Password
                    </label>
                    <div className="invalid-feedback">
                      {formErrors.password}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100 mb-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-person-plus me-2"></i>
                        Create Account
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Already have an account?
                      <Link
                        to={ROUTES.LOGIN}
                        className="text-success fw-semibold text-decoration-none"
                      >
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
