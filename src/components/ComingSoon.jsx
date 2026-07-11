import { Link } from "react-router-dom";

function ComingSoon({
  title = "Feature Coming Soon",
  description = "This section is currently under development and will be available in a future update.",
  features = [],
}) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 rounded-4">
            <div className="card-body p-5 text-center">
              <div className="display-2 mb-3">🚧</div>

              <h1 className="fw-bold mb-3">{title}</h1>

              <p className="text-muted fs-5 mb-4">{description}</p>

              {features.length > 0 && (
                <>
                  <h5 className="fw-semibold mb-3">Planned Features</h5>

                  <ul className="list-group list-group-flush text-start mb-4">
                    {features.map((feature, index) => (
                      <li key={index} className="list-group-item border-0">
                        ✅ {feature}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              <Link to="/" className="btn btn-primary px-4 rounded-pill">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComingSoon;
