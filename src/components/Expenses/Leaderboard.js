import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Leaderboard = (props) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/premium/showleaderboard", {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then((data) => setLeaderboardData(data.data))
      .catch((err) => console.log(err));
  }, []);

  return (
        <div className="col">
          <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
             <div>
             <h4 >LEADERBOARD</h4>
             </div>
             <div>
              <button className="btn btn-close" onClick={() => props.setshowleaderboard(false)}></button>
             </div>
          </div>
            <div className="card-body">
              <ul>
                {leaderboardData.map((data) => {
                  return (
                    <li key={data.id} className="mb-2 row text-start">
                      <div className="col">Name - {data.name}</div>
                      <div className="col">Total Expenses - {data.totalExpenses || 0}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
  );
};

export default Leaderboard;
