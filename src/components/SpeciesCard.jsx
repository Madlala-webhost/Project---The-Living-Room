import { useState } from "react";
import {
  useLazyGetDescriptionQuery,
  useLazyGetSpeciesObservationsQuery,
} from "../store/api/speciesAPI";

function SpeciesCard({ speciesData }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [description, setDescription] = useState(null);
  const [observations, setObservations] = useState(null);

  const [getDescription, { isLoading: isDescriptionLoading }] =
    useLazyGetDescriptionQuery();
  const [getObservations, { isLoading: isObservationsLoading }] =
    useLazyGetSpeciesObservationsQuery();

  const handleDescription = async (speciesData) => {
    try {
      if (!speciesData?.taxonKey) {
        alert("Missing taxon key for this species.");
        return;
      }
console.log("Fetching description for taxonKey:", speciesData.taxonKey);
      const descriptionResult = await Promise.all([getDescription({
        taxonKey: speciesData.taxonKey,
      }).unwrap()]);
    

      setDescription(descriptionResult);
      console.log("Fetched description:", descriptionResult);
    } catch (error) {
      alert("Failed to fetch description.");
    }
  };

  const handleObservation = async (speciesData) => {
    try {
      if (!speciesData?.taxonKey) {
        alert("Missing taxon key for this species.");
        return;
      }

      const observationsResult = await getObservations({
        taxonKey: speciesData.taxonKey,
      }).unwrap();

      const normalizedObservations = Array.isArray(observationsResult)
        ? observationsResult
        : observationsResult?.observations || [];

      console.log("Fetched observations:", observationsResult);
      setObservations(normalizedObservations);
    } catch (error) {
      alert("Failed to fetch observations.");
    }
  };

  const images = Array.isArray(speciesData.imageUrl)
    ? speciesData.imageUrl
    : speciesData.imageUrl
      ? [speciesData.imageUrl]
      : [];

  const nextSlide = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev + 1) % images.length);
  };
  const prevSlide = (e) => {
    e.stopPropagation();
    setActiveIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const getStatusColor = (status) => {
    const colors = {
      CR: "bg-danger",
      EN: "bg-warning text-dark",
      VU: "bg-info text-dark",
    };
    return colors[status] || "bg-secondary";
  };

  return (
    <div
      className="card h-100 border-0 shadow rounded-4 overflow-hidden shadow-hover" 
      style={{ transition: "transform 0.2s", maxWidth: "400px" }} 
    >
      {/* Image Section */}
      <div
        className="position-relative"
        style={{ height: "240px", backgroundColor: "#e9ecef" }}
      >
        {images.length > 0 ? (
          <>
            <img
              src={images[activeIndex]}
              alt="Species"
              className="w-100 h-100 object-fit-cover" 
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="btn btn-dark btn-sm position-absolute start-0 top-50 translate-middle-y ms-2 rounded-circle border-0 opacity-75"
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <button
                  onClick={nextSlide}
                  className="btn btn-dark btn-sm position-absolute end-0 top-50 translate-middle-y me-2 rounded-circle border-0 opacity-75"
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
                <span className="position-absolute bottom-0 start-50 translate-middle-x mb-2 badge bg-dark opacity-75 rounded-pill">
                  {activeIndex + 1} / {images.length}
                </span>
              </>
            )}
          </>
        ) : (
          <div className="d-flex flex-column align-items-center justify-content-center h-100 text-muted">
            <i className="bi bi-image fs-1 opacity-25"></i>
            <span className="small">No Image</span>
          </div>
        )}

        <span
          className={`position-absolute top-0 start-0 m-3 badge rounded-pill ${getStatusColor(speciesData.iucnStatus)} shadow-sm px-3 py-2`}
        >
          {speciesData.iucnStatus === "CR"
            ? "Critically Endangered"
            : speciesData.iucnStatus === "EN"
              ? "Endangered"
              : speciesData.iucnStatus}
        </span>
      </div>

      {/* Body Section */}
      <div className="card-body p-4 d-flex flex-column">
        <div>
          <h5 className="card-title fw-bold mb-0 text-capitalize">
            {speciesData.speciesSpecies || "Unknown Species"}
          </h5>
          <p className="text-muted fst-italic small mb-3">
            {speciesData.speciesGenus} {speciesData.speciesSpecies}
          </p>

          <div className="d-flex flex-wrap gap-1 mb-4">
            <span className="badge bg-light text-dark border small fw-normal">
              K: {speciesData.speciesKingdom}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              P: {speciesData.speciesPhylum}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              C: {speciesData.speciesClass}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              O: {speciesData.speciesOrder}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              F: {speciesData.speciesFamily}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              G: {speciesData.speciesGenus}
            </span>
          </div>
        </div>

        <div className="mt-auto d-flex flex-column gap-3">
          {/* Action Row: Observations */}
          <div className="w-100">
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => handleObservation(speciesData)}
                disabled={isObservationsLoading}
                className="btn btn-success flex-grow-1 fw-semibold py-2 shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                {isObservationsLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <i className="bi bi-geo-alt me-2"></i> Observations
                  </>
                )}
              </button>
              {observations && (
                <i
                  className="bi bi-x-circle-fill text-muted fs-3 clickable"
                  onClick={() => setObservations(null)}
                ></i>
              )}
            </div>
            {observations && (
              <div
                className="mt-2 p-2 border rounded bg-light-subtle overflow-auto"
                style={{ maxHeight: "120px" }}
              >
                {observations.length === 0 ? (
                  <div className="small text-muted">No observations found.</div>
                ) : (
                  observations.map((obs, i) => (
                    <div
                      key={obs.id || i}
                      className="small border-bottom py-1 last-child-border-0" 
                    >
                      <span className="me-1">{obs.flag}</span>{" "}
                      <strong>{obs.location}</strong>{" "}
                      <span className="text-muted float-end">{obs.date}</span>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Action Row: Description */}
          <div className="w-100">
            <div className="d-flex align-items-center gap-2">
              <button
                onClick={() => handleDescription(speciesData)}
                disabled={isDescriptionLoading}
                className="btn btn-outline-success flex-grow-1 fw-semibold py-2 shadow-sm rounded-3 d-flex align-items-center justify-content-center"
              >
                {isDescriptionLoading ? (
                  <span className="spinner-border spinner-border-sm"></span>
                ) : (
                  <>
                    <i className="bi bi-journal-text me-2"></i> Description
                  </>
                )}
              </button>
              {description && (
                <i
                  className="bi bi-x-circle-fill text-muted fs-3 clickable"
                  onClick={() => setDescription(null)}
                ></i>
              )}
            </div>
            {description && (
              <div
                className="mt-2 p-3 border rounded bg-light-subtle text-secondary small"
                style={{ maxHeight: "150px", overflowY: "auto" }} 
              >
                {description}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .clickable { cursor: pointer; transition: color 0.2s; }
        .clickable:hover { color: #dc3545 !important; }
        .shadow-hover:hover { transform: translateY(-4px); }
        .last-child-border-0:last-child { border-bottom: 0 !important; }
      `}</style>
    </div>
  );
}

export default SpeciesCard;
