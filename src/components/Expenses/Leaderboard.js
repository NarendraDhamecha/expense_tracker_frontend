import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/purchase/showleaderboard", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((data) => setLeaderboardData(data.data))
      .catch((err) => console.log(err));
  }, []);

  console.log(leaderboardData);

  return (
    <div className="container-fluid text-center">
      <div className="row">
        <div className="col-md-4 col-10 mx-auto">
          <div className="card">
            <h2 className="card-header">LEADERBOARD</h2>
            <div className="card-body">
              <ul>
                {leaderboardData.map((data) => {
                  return (
                    <li key={data.userId} className="mb-2 d-flex justify-content-around">
                      <div>Name - {data.name}</div>
                      <div>Total Expenses - {data.totalAmount}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
