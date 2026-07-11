import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { ROUTES } from "../../utility/constants";
import { useLoginUserMutation } from "../../store/api/authAPI";
import { toast } from "react-toastify";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [loginUser] = useLoginUserMutation(); // RTK Query mutation hook for user login, which provides a function to trigger the login API call and returns the result of the mutation (e.g., success or error response) that we can use to handle the login process in our component.
  const [formData, setFormData] = useState({
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

      await loginUser(formData).unwrap();

      toast.success(
        "Login successful! You will be redirected to the home page.",
      ); // Show a success toast notification if the login was successful, providing feedback to the user that they have logged in successfully.
      const from = location.state?.from?.pathname || ROUTES.HOME; // Get the path the user was trying to access before being redirected to the login page, or default to the home page if there is no such path. This allows us to redirect the user back to their intended destination after a successful login, providing a smoother user experience.

      navigate(from); // Navigate the user to the home page after successful login, allowing them to access the application's main features.
    } catch (error) {
      const errorMessage = //this error meessage is returned from firebase and can be different formats
        typeof error?.data === "string"
          ? error.data
          : error?.data?.message || error?.message || "Login failed";
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
                  <h1 className="h3 mb-2 fw-bold">Welcome Back!</h1>
                  <p className="text-muted">Sign in to your account</p>
                </div>
                {formErrors &&
                  Object.keys(formErrors).length > 0 && ( //object.keys(formErrors).length > 0 is used to check if there are any validation errors in the formErrors object. If there are errors, we display an alert message to the user indicating that there are validation errors that need to be addressed before submitting the form. This provides feedback to the user about what went wrong and helps them understand that they need to correct the errors before they can successfully submit the form.
                    <div
                      className="alert alert-danger alert-dismissible fade show"
                      role="alert"
                    >
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
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
                    className="btn btn-success w-100 mb-4 py-3"
                    disabled={isLoading} // Disable the submit button while the registration process is in progress to prevent multiple submissions and provide feedback to the user that their request is being processed.
                  >
                    {isLoading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Signing In...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-box-arrow-in-right me-2"></i>
                        Sign In
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="mb-0 text-muted">
                      Don't have an account?{" "}
                      <Link
                        to={ROUTES.REGISTER}
                        className="text-success fw-semibold text-decoration-none"
                      >
                        Create account
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

export default Login;
