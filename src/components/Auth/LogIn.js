import { useRef } from "react";
import { NavLink } from "react-router-dom";

const LogIn = () => {
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const submitHandler = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    if (password.length < 6) {
      alert("password is too short");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/login", {
        method: "POST",
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log(data);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col-md-4 col-10 mx-auto">
          <div className="card">
            <h3 className="card-header">LOG IN</h3>
            <div className="card-body">
              <form onSubmit={submitHandler}>
                <div className="mb-2">
                  <input
                    className="form-control"
                    ref={emailRef}
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    className="form-control"
                    ref={passwordRef}
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Log In
                </button>
              </form>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
              <p className="card-text">
                Don't have an account? <NavLink to="/">Sign Up</NavLink>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
