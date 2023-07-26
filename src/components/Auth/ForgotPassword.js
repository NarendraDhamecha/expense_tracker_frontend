import axios from "axios";
import { useRef } from "react";

const ForgotPassword = () => {
  const emailRef = useRef("");

  const forgotPasswordHandler = async (e) => {
    e.preventDefault();

    axios.post("http://localhost:4000/password/forgotpassword", {
      email: emailRef.current.value,
    });
  };

  return (
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col-md-4 col-10 mx-auto">
          <div className="card">
            <h2 className="card-header">FORGOT PASSWORD</h2>
            <div className="card-body">
              <form onSubmit={forgotPasswordHandler}>
                <div className="mb-2">
                  <input
                    className="form-control"
                    type="email"
                    placeholder="enter your registered email"
                    ref={emailRef}
                  />
                </div>
                <button className="btn btn-outline-primary" type="submit">Send</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
