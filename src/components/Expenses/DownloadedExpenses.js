import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const DownloadedExpenses = () => {
  const [downloadedExpenses, setDownloadedExpenses] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:4000/expenses/olddownloaded", {
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      })
      .then((response) => {
        setDownloadedExpenses(response.data);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    
      <div className="col">
        <div className="card">
          <h4 className="card-header">Downloaded Expenses</h4>
          <div className="card-body">
            <ul>
              {downloadedExpenses.map((expense) => {
                return (
                  <li className="d-flex justify-content-around" key={expense.id}>
                    <div>Last downloaded on {expense.createdAt}</div>
                    <a href={expense.fileURL} download="myexpense.csv">
                      download file
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
   
  );
};

export default DownloadedExpenses;
