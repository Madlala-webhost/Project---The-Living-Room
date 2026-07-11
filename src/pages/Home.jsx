import Chart from "chart.js/auto";
import { useState } from "react";
import { getRelativePosition } from "chart.js/helpers";
import ContinentMap from "../components/ContinentMap";
import SpeciesOccurrenceCards from "../components/SpeciesOccurenceCards";

import { useGetCountryObservationsQuery } from "../store/api/occurenceAPI";

function Home() {
  const [selectedCountry, setSelectedCountry] = useState(null);
  console.log("Selected country in Home component:", selectedCountry); // Debug log to check the selected country state
  const {
    data,
    isLoading: isLoadingObservations,
    isError: isErrorObservations,
  } = useGetCountryObservationsQuery(
    { selectedCountry }, // Pass the selected country as a parameter to the query. This will trigger the API call whenever the country changes.
    { skip: !selectedCountry }, // Skip the query if no country is selected
  );

  const statusCounts = data?.observations || {}; // Ensure statusCounts is always an object, even if data is undefined
  const countryInfo = {
    Flag: data?.countryDisplay?.flag || null, // Safely access the flag URL, defaulting to null if not available
    Country: data?.countryDisplay?.name || selectedCountry || "Unknown Country", // Use the country name from the API if available, otherwise fall back to the selected country or a default string
  };
  console.log("Country info in Home component:", countryInfo); // Debug log to check the country info being passed to the SpeciesOccurrenceCards
  console.log("Status counts in Home component:", statusCounts); // Debug log to check the status counts being passed to the SpeciesOccurrenceCards
  return (
    <div className="container my-5">
      <section className="rounded-4 p-4 mb-5">
        <div className="text-center mb-4">
          <h2 className="display-6 fw-bold mb-3">iucn status data</h2>
          <p className="text-muted fs-5">
            Explore the conservation status of species in the selected country.
            You can view detailed information about each species and their
            current threat levels in Your Species Home page.
          </p>
        </div>
        <br />
        <div className="mx-auto" style={{ maxWidth: "1000px" }}>
          {selectedCountry ? (
            <SpeciesOccurrenceCards
              statusCounts={statusCounts}
              countryInfo={countryInfo}
              isLoading={isLoadingObservations}
              isError={isErrorObservations}
            />
          ) : (
            <h3 className="text-center display-6 fw-bold mb-3 ">
              Select a country to view species status data 🤔
            </h3>
          )}
        </div>
      </section>

      <hr className="my-5" />

      <ContinentMap
        onContinentClick={(country) => {
          console.log("Selected country:", country);
          setSelectedCountry(country);
        }}
      />

      <hr className="my-5" />
    </div>
  );
}

export default Home;
