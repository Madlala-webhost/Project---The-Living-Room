function Footer() {
    return (
      <footer
        className="mt-5 position-relative"
        style={{
          background: "linear-gradient(135deg,  #1a252f 75%, #0f171d 100%)",
          color: "#ffffff",
        }}
      >
        <div className="container position-relative">
          <div className="border-top border-secondary">
            <div className="row py-4">
              <div className="col-md-6">
                <p className="mb-0 text-white-50 small">
                  © 2026 The Living Room. All rights reserved.
                </p>
              </div>
              <div className="col-md-6 text-md-end">
                <p className="mb-0 text-white-50 small">
                  Made with <i className="bi bi-heart-fill text-danger"></i> by  
                  <span className="text-warning fw-semibold">  
                    Njabulo
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
}

export default Footer;