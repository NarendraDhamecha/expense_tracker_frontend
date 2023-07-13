import { useRef } from "react";
import { NavLink } from "react-router-dom";

const SignUp = () => {
  const nameRef = useRef("");
  const mobileNoRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const confirmPasswordRef = useRef("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    const name = nameRef.current.value;
    const mobileNo = mobileNoRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (password !== confirmPassword) {
      alert("password and confirm password does not match");
      return;
    }

    if (password.length < 6) {
      alert("password is too short");
      return;
    }

    try {
      const res = await fetch("http://localhost:4000/signup", {
        method: "POST",
        body: JSON.stringify({
          name: name,
          mobileNo: mobileNo,
          email: email,
          password: password,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.errors[0].message);
      }

      alert("user has successfully signed up");
    } catch (err) {
      alert(err);
    }
  };

  return (
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col-md-4 col-10 mx-auto">
          <div className="card">
            <h3 className="card-header">SIGN UP</h3>
            <div className="card-body">
              <form onSubmit={onSubmitHandler}>
                <div className="mb-2">
                  <input
                    ref={nameRef}
                    className="form-control"
                    type="text"
                    placeholder="Name"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    ref={mobileNoRef}
                    className="form-control"
                    type="number"
                    placeholder="Mobile Number"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    ref={emailRef}
                    className="form-control"
                    type="email"
                    placeholder="Email"
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    ref={passwordRef}
                    className="form-control"
                    type="password"
                    placeholder="Password"
                    required
                  />
                </div>
                <div className="mb-3">
                  <input
                    className="form-control"
                    type="password"
                    ref={confirmPasswordRef}
                    placeholder="Confirm Password"
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Sign Up
                </button>
              </form>
            </div>
          </div>
          <div className="card mt-3">
            <div className="card-body">
               <p className="card-text">
               Already have an account? <NavLink to="/login">Log In</NavLink>
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
