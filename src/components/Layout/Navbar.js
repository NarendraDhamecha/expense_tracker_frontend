import { useHistory } from "react-router-dom";

const Navbar = (props) => {
  const history = useHistory();

  const onLogout = () => {
    localStorage.removeItem("token");
    props.setToken(null);
    history.push('/login')
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-3">
      <div className="container-fluid">
        <span className="navbar-brand">Expense Tracker</span>
        <span className="navbar-text"></span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            {props.token && (
              <li className="nav-item">
                <button className="btn btn-danger btn-sm" onClick={onLogout}>
                  LOG OUT
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
