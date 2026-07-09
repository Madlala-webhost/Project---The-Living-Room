import IUCNPieChart from "./IUCNPieChart";

function SpeciesOccurenceCards({
  statusCounts,
  countryInfo,
  isLoading,
  isError,
}) {
  const labels = {
    CR: "Critically Endangered",
    EN: "Endangered",
    VU: "Vulnerable",
    NT: "Near Threatened",
    LC: "Least Concern",
  };
const cardData = {...statusCounts, ...countryInfo};
console.log("Card data in SpeciesOccurenceCards:", cardData); // Debug log to check the combined card data
  if (isLoading) {
    return <p className="text-center text-muted">Loading observations...</p>;
  }

  if (isError) {
    return (
      <p className="text-center text-danger">
        Could not load observations for this country.
      </p>
    );
  }

  const entries = Object.entries(cardData || {});

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted">
        No observations found for the selected country.
      </p>
    );
  }

  return (
    <>
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header fw-bold">Species Conservation Status</div>

        <div className="card-body">
          <IUCNPieChart statusCounts={statusCounts} countryInfo={countryInfo} />
        </div>
      </div>

      <div className="row">
        {entries.map(([status, count]) => (
          <div key={status} className="col-md-4 mb-3">
            <div className="card shadow-sm">
              <div className="card-body">
                <h6>{labels[status] || status}</h6>

                <h3>{count}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default SpeciesOccurenceCards;
