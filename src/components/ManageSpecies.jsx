import { useGetdbSpeciesQuery } from "../store/api/dbAPI";
import { useLazyGetTaxonSpeciesQuery } from "../store/api/speciesAPI";
import { useState, useEffect } from "react";
import {
  useLazyGetDescriptionQuery,
  useLazyGetSpeciesObservationsQuery,
} from "../store/api/speciesAPI";

function ManageSpecies() {
  const { data: dbSpeciesData, isLoading, isError } = useGetdbSpeciesQuery();
    const [getSpecies] = useLazyGetTaxonSpeciesQuery();
  
    const [speciesList, setSpeciesList] = useState([]);
    const [description, setDescription] = useState(null);
    const [observations, setObservations] = useState(null);

    const [getDescription, { isLoading: isDescriptionLoading }] =
      useLazyGetDescriptionQuery();
    const [getObservations, { isLoading: isObservationsLoading }] =
      useLazyGetSpeciesObservationsQuery();

  
    useEffect(() => {
      const fetchSpeciesKey = async () => {
        if (dbSpeciesData?.length > 0) {
          const taxonKeys = dbSpeciesData
            .map((item) => item?.taxonKey)
            .filter((key) => key !== undefined && key !== null);
  
          const resultsSpecies = await Promise.all(
            //Here we use Promise.all to fetch all species data in parallel for the given taxon keys. This ensures that we wait for all fetches to complete before updating the state.
            taxonKeys.map((taxonKey) =>
              getSpecies({ dbSpeciesKey: taxonKey }).unwrap(),
            ),
          );
          const resultsDescription = await Promise.all(
            taxonKeys.map((taxonKey) =>
              getDescription({ taxonKey }).unwrap(),
            ),
          )
          const resultsObservations = await Promise.all(
            taxonKeys.map((taxonKey) =>
              getObservations({ taxonKey }).unwrap(),
            ),
          )
          setDescription(resultsDescription);
          setObservations(resultsObservations);


          setSpeciesList(resultsSpecies); //We filter out any null or undefined results to ensure that only valid species data is stored in the state.

        } else {
          setSpeciesList([]);
        }
      };
      fetchSpeciesKey();
      console.log("dbSpeciesData:", dbSpeciesData);
    }, [dbSpeciesData, getSpecies, getDescription, getObservations]);
    const handleEditClick = (species) => {
      // Handle the edit button click for a specific species
      // You can implement the logic to open a modal or navigate to an edit page with the species details
      console.log("Edit species:", species);
    }
    const handleDeleteClick = (speciesId) => {
      // Handle the delete button click for a specific species
      // You can implement the logic to delete the species from the database and update the UI accordingly
      console.log("Delete species with ID:", speciesId);
    }
    const images = Array.isArray(speciesList.imageUrl)
      ? speciesList.imageUrl
      : speciesList.imageUrl
        ? [speciesList.imageUrl]
        : [];

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-header border-0 py-3">
        <h5 className="card-title mb-0">
          <i className="bi bi-list-ul me-2 text-success"></i>
          Species List ({speciesList.length})
        </h5>
      </div>
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="">
              <tr>
                <th className="border-0 ps-4">Image</th>
                <th className="border-0">Species name</th>
                <th className="border-0">Description</th>
                <th className="border-0">Observations</th>
                <th className="border-0">IUCN status</th>
                <th className="border-0 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {speciesList.map((species) => (
                <tr className="border-0" key={species.taxonKey}>
                  <td className="ps-4 py-3">
                    <img
                      src={
                        species.imageUrl ||
                        "https://placehold.co/60x60/f8f9fa/6c757d?text=No+Image"
                      }
                      style={{
                        width: "60px",
                        height: "60px",
                        borderRadius: "15px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                  <td className="py-3">
                    <div>
                      <h6 className="mb-1 fw-bold ">{species.name}</h6>
                      <p
                        className="text-muted mb-0 small"
                        style={{ maxWidth: "200px" }}
                      >
                        {species.description && species.description.length > 40
                          ? `${species.description.substring(0, 40)}...`
                          : species.description}
                      </p>
                    </div>
                  </td>
                  <td className="py-3">
                        <div className="d-flex flex-wrap gap-1 mb-4">
            <span className="badge bg-light text-dark border small fw-normal">
              K: {species.speciesKingdom}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              P: {species.speciesPhylum}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              C: {species.speciesClass}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              O: {species.speciesOrder}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              F: {species.speciesFamily}
            </span>
            <span className="badge bg-light text-dark border small fw-normal">
              G: {species.speciesGenus}
            </span>
          </div>
        
                  </td>
                  <td>
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
            </td>
            <td className="py-3">
              <span className="badge bg-info  px-3 py-2 rounded-pill">
                <i className="bi bi-rulers me-1"></i>
                {species.iucnStatus || "Unknown"}
                    </span>
                  </td>
                  
                  <td className="py-3 text-center">
                    <div className="btn-group" role="group">
                      <button
                        className="btn btn-outline-primary btn-sm px-3"
                        title="Edit Species"
                        onClick={() => handleEditClick(species)} // Call the handleEditClick function with the species details when the edit button is clicked. This will allow you to open the edit modal and populate it with the species's current details for editing.
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm px-3"
                        title="Delete Species"
                        onClick={() => handleDeleteClick(species.id)} // Call the handleDeleteClick function with the species ID when the delete button is clicked. This will allow you to trigger the deletion of the species from the database and update the UI accordingly.
                      >
                        <i className="bi bi-trash3"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ManageSpecies;
