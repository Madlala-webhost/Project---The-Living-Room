import AddSpeciesModal from "../components/AddSpeciesModal";
import { useState, useEffect } from "react";
import SpeciesCard from "../components/SpeciesCard";
import { useGetdbSpeciesQuery } from "../store/api/dbAPI";
import { useLazyGetTaxonSpeciesQuery } from "../store/api/speciesAPI";

function MySpecies() {
  const { data: dbSpeciesData, isLoading, isError } = useGetdbSpeciesQuery();
  const [getSpecies] = useLazyGetTaxonSpeciesQuery();

  const [speciesList, setSpeciesList] = useState([]);

  useEffect(() => {
    const fetchSpeciesKey = async () => {
      if (dbSpeciesData?.length > 0) {
        const taxonKeys = dbSpeciesData
          .map((item) => item?.taxonKey)
          .filter((key) => key !== undefined && key !== null);

        const results = await Promise.all(
          //Here we use Promise.all to fetch all species data in parallel for the given taxon keys. This ensures that we wait for all fetches to complete before updating the state.
          taxonKeys.map((taxonKey) =>
            getSpecies({ dbSpeciesKey: taxonKey }).unwrap(),
          ),
        );

        setSpeciesList(results); //We filter out any null or undefined results to ensure that only valid species data is stored in the state.
      } else {
        setSpeciesList([]);
      }
    };
    fetchSpeciesKey();
  }, [dbSpeciesData, getSpecies]);

  const [selectedSpecies, setSelectedSpecies] = useState("");

  const [showModal, setShowModal] = useState(false);

  const handleOpenModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const filteredSpecies = speciesList?.filter((species) => {
    //filtering the species based on the search input
    const searchText = selectedSpecies.trim().toLowerCase(); //removing extra spaces and converting to lowercase for case-insensitive search
    const taxonKey = species.taxonKey ? species.taxonKey.toString() : ""; //converting taxonKey to string for case-insensitive search
    const kingdom = species.speciesKingdom
      ? species.speciesKingdom.toLowerCase()
      : "";
    const phylum = species.speciesPhylum
      ? species.speciesPhylum.toLowerCase()
      : "";
    const className = species.speciesClass
      ? species.speciesClass.toLowerCase()
      : "";
    const order = species.speciesOrder
      ? species.speciesOrder.toLowerCase()
      : "";
    const family = species.speciesFamily
      ? species.speciesFamily.toLowerCase()
      : "";
    const genus = species.speciesGenus
      ? species.speciesGenus.toLowerCase()
      : "";
    const speciesName = species.speciesSpecies
      ? species.speciesSpecies.toLowerCase()
      : "";
    const iucnStatus = species.iucnStatus
      ? species.iucnStatus.toLowerCase()
      : "";

    //converting species name to lowercase for case-insensitive search
    const matchesName =
      !searchText ||
      taxonKey.includes(searchText) ||
      kingdom.includes(searchText) ||
      phylum.includes(searchText) ||
      className.includes(searchText) ||
      order.includes(searchText) ||
      family.includes(searchText) ||
      genus.includes(searchText) ||
      speciesName.includes(searchText) ||
      iucnStatus.includes(searchText);

    return matchesName;
  });
  const handleClearFilters = () => {
    setSelectedSpecies("");
  };

  return (
    <div className="container my-5">
      <section className="rounded-4 p-4 mb-5">
        <div className="text-center mb-4">
          <h2 className="display-6 fw-bold mb-3">
            Locate and manage your species
          </h2>
          <p className="text-muted fs-5">
            Search through members of your species and find out more about them.
            You can also add new members to your species and keep track of their
            information.
          </p>
        </div>
        <div
          className="card border shadow mx-auto"
          style={{ maxWidth: "1000px" }}
        >
          <div className="card-body p-6 border rounded">
            <div className="row g-3 align-items-center">
              <div className="col-lg-12 col-md-7">
                <label className="form-label fw-semibold ">
                  Search Your Species
                </label>
                <div className="position-relative">
                  <input
                    type="text"
                    className="form-control form-control-lg ps-5 rounded-pill"
                    value={selectedSpecies}
                    onChange={(e) => setSelectedSpecies(e.target.value)}
                    placeholder="Species you are looking for?"
                  />
                  <i className="bi bi-search position-absolute start-0 top-50 translate-middle-y ms-3 text-muted"></i>
                </div>
              </div>
            </div>

            <div className="row g-3 mt-2">
              <div className="col-md-8">
                <div className="d-flex align-items-center">
                  <span className="text-muted me-3">
                    <i className="bi bi-funnel me-1"></i>
                    {selectedSpecies
                      ? `${filteredSpecies.length} of ${speciesList.length} species matching "${selectedSpecies}"`
                      : `${speciesList?.length} species in total`}
                  </span>
                  {filteredSpecies.length < speciesList.length && (
                    <button
                      onClick={handleClearFilters}
                      className="btn btn-outline-secondary btn-sm rounded-pill"
                    >
                      <i className="bi bi-x me-1"></i>
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className="my-5" />

      <section className=" rounded-4 p-4 mb-5">
        <div className="text-center mb-4">
          <h2 className="display-5 fw-bold mb-3">Your Species Household</h2>
          <p className="text-muted fs-5">
            Discover your complete collection of species, each with their unique
            taxonomic classification, IUCN status, and other relevant
            information. From the kingdom to the species level, explore the
            diversity of life within your household.
          </p>
        </div>
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading species...</p>
          </div>
        )}

        {isError && (
          <div className="alert alert-danger text-center" role="alert">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Error loading species. Please try again later.
          </div>
        )}
        {!isLoading && !isError && filteredSpecies.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-search text-muted display-1"></i>
            <p className="mt-3 text-muted fs-5">
              No species found matching your search criteria.
            </p>
            <p className="text-muted">
              Try adjusting your search terms or filters.
            </p>
            <button className="btn btn-outline-success mt-2 rounded-pill">
              <i className="bi bi-arrow-clockwise me-1"></i>
              Clear All Filters
            </button>
          </div>
        )}

        {!isLoading && !isError && speciesList.length === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-emoji-frown text-muted display-1"></i>
            <p className="mt-3 text-muted fs-5">
              No species available at the moment.
            </p>
          </div>
        )}

        <div className="d-flex flex-wrap justify-content-center">
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {!isLoading &&
              !isError &&
              filteredSpecies.map((item) => (
                <div key={item.id || item.taxonKey}>
                  <SpeciesCard speciesData={item} />
                </div>
              ))}

            {showModal && <AddSpeciesModal onClose={handleCloseModal} />}
          </div>
        </div>
        <div className="text-center mt-4 pt-4">
          <button
            className="btn btn-success mt-2 rounded-pill "
            onClick={handleOpenModal}
          >
            Add Species
          </button>
        </div>
      </section>

      <hr className="my-5" />
    </div>
  );
}

export default MySpecies;
