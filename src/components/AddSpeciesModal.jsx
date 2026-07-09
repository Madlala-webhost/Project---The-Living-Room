import { useLazyGetSpeciesQuery } from "../store/api/speciesAPI";
import { useAdddbSpeciesMutation } from "../store/api/dbAPI";
import { useState } from "react";
import { toast } from "react-toastify";

function AddSpeciesModal({ onClose }) {
  const [adddbSpecies, { isLoading: isAdding }] = useAdddbSpeciesMutation(); // Renamed to isAdding for clarity, since it reflects the POST operation status, not the GET query.
  const [getSpecies, { isLoading: isFetchingSpecies }] =
    useLazyGetSpeciesQuery();
  const [formData, setFormData] = useState({
    speciesName: "",
  });
  const [errors, setErrors] = useState({});
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newErrors = {};
      if (!formData.speciesName.trim()) {
        newErrors.speciesName = "Species name is required.";
      }
      setErrors(newErrors);
      if (Object.keys(newErrors).length > 0) {
        // Proceed with form submission (e.g., API call)

        return;
      }

      const speciesData = await getSpecies({
        speciesName: formData.speciesName,
      }).unwrap();

      const saved = await adddbSpecies(speciesData).unwrap();
      toast.success("Species saved to database!");
      onClose();
    } catch {
      toast.error("Failed to add member. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: null,
      }));
    }
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      style={{
        backgroundColor: "rgba(0,0,0,0.6)",
      }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <form onSubmit={handleSubmit}>
            <div className="modal-header bg-success border-0 p-4 ">
              <h5 className="modal-title">
                <i className="bi bi-pencil-square me-2"></i>
                Add New Species
              </h5>
              <button
                onClick={onClose}
                type="button"
                className="btn-close"
              ></button>
            </div>
            <div className="modal-body p-4">
              <div className="row">
                <div className="col-12">
                  <div className="mb-4">
                    <label className="form-label">
                      <i className="bi bi-book"></i> Species/Common Name *
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.speciesName ? "is-invalid" : ""}`}
                      placeholder="Name..."
                      name="speciesName"
                      value={formData.speciesName}
                      onChange={handleInputChange}
                    />
                    <div className="invalid-feedback">{errors.speciesName}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer border-0 p-4">
              <button
                onClick={onClose}
                type="button"
                className="btn btn-outline-secondary px-4"
                disabled={isFetchingSpecies || isAdding}
              >
                <i className="bi bi-x-circle me-2"></i>
                Cancel
              </button>
              <button type="submit" className="btn btn-success px-4">
                {isFetchingSpecies || isAdding ? (
                  <>
                    <div
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    Adding Member...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Add Member
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddSpeciesModal;
