import { useCallback, useEffect, useRef, useState } from "react";
import ExpensesList from "./ExpensesList";
import PremiumFeature from "./PremiumFeature";
import DownloadedExpenses from "./DownloadedExpenses";
import axios from "axios";
import Leaderboard from "./Leaderboard";
import Dummy from "../extra/Dummy";

const Expense = () => {
  const initialState = JSON.parse(localStorage.getItem("isPremium"));
  const initialRowsPerPage = Number(localStorage.getItem("rows"));
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [isPremium, setPremium] = useState(initialState);
  const [expensesList, setExpensesList] = useState([]);
  const [pagination, setPagination] = useState({
    hasNextPage: false,
    hasPreviousPage: false,
    currentPage: 1,
    nextPage: 2,
    previousPage: null,
  });
  const amountRef = useRef("");
  const descriptionRef = useRef("");
  const catagoryRef = useRef("");
  const [showleaderboard, setshowleaderboard] = useState(false)

  const getExpenses = useCallback(
    async (page) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/expenses?page=${page}&rows=${rowsPerPage}`,
          {
            headers: {
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        setExpensesList(response.data.response);

        setPagination({
          hasNextPage: response.data.hasNextPage,
          hasPreviousPage: response.data.hasPreviousPage,
          currentPage: response.data.currentPage,
          nextPage: response.data.nextPage,
          previousPage: response.data.previousPage,
        });
      } catch (err) {
        console.log(err);
      }
    },
    [rowsPerPage]
  );

  useEffect(() => {
    getExpenses(1);
  }, [getExpenses]);

  const submitHandler = async (e) => {
    e.preventDefault();

    const amount = Number(amountRef.current.value);
    const description = descriptionRef.current.value;
    const category = catagoryRef.current.value;

    try {
      const response = await fetch(
        "http://localhost:4000/expenses/addExpense",
        {
          method: "POST",
          body: JSON.stringify({
            amount,
            description,
            category,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      if (expensesList.length < rowsPerPage) {
        const data = await response.json();
        setExpensesList((prevList) => [...prevList, data]);
      } else {
        setPagination((prevObj) => {
          return {
            hasNextPage: true,
            hasPreviousPage: prevObj.hasPreviousPage,
            currentPage: prevObj.currentPage,
            nextPage: prevObj.currentPage + 1,
            previousPage: prevObj.previousPage,
          };
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (id, amount) => {
    const response = await fetch(
      `http://localhost:4000/expenses/${id}/${amount}`,
      {
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("token"),
        },
      }
    );

    if (response.ok) {
      const filteredList = expensesList.filter((expense) => {
        return expense.id !== id;
      });

      setExpensesList(filteredList);
    }
  };

  const handleRowsPerPage = (e) => {
    localStorage.setItem("rows", e.target.value);
    setRowsPerPage(e.target.value);
  };

  return (
    <div className="container-fluid text-center my-3">
      <div className="row">
        <div className="col">
          <div className="card">
            <h4 className="card-header">ADD EXPENSES HERE</h4>
            <div className="card-body">
              <form onSubmit={submitHandler}>
                <div className="mb-2">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Amount"
                    ref={amountRef}
                    required
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    ref={descriptionRef}
                    required
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label">Choose a category</label>
                  <select className="form-select" ref={catagoryRef}>
                    <option value="Food">Food</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Travel">Travel</option>
                    <option value="Medical & Healthcare">
                      Medical & Healthcare
                    </option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Add expense
                </button>
              </form>
            </div>
          </div>
        </div>
        {!showleaderboard && <PremiumFeature setshowleaderboard={setshowleaderboard} setPremium={setPremium} isPremium={isPremium} />}
        {showleaderboard && <Leaderboard setshowleaderboard={setshowleaderboard}/>}
      </div>
      <div className="row mt-2">
        <div className="col">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <h4>EXPENSES</h4>
              </div>
              <div>
                <select
                  className="form-select w-auto"
                  defaultValue={rowsPerPage}
                  onChange={handleRowsPerPage}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="15">15</option>
                  <option value="20">20</option>
                </select>
              </div>
            </div>
            <div className="card-body">
              <ExpensesList onDelete={onDelete} expenses={expensesList} />
              {pagination.hasPreviousPage && (
                <button
                  className="btn btn-primary btn-sm me-1"
                  onClick={() => getExpenses(pagination.previousPage)}
                >
                  {pagination.previousPage}
                </button>
              )}
              {
                <button
                  className="btn btn-primary me-1"
                  onClick={() => getExpenses(pagination.currentPage)}
                >
                  {pagination.currentPage}
                </button>
              }
              {pagination.hasNextPage && (
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => getExpenses(pagination.nextPage)}
                >
                  {pagination.nextPage}
                </button>
              )}
            </div>
          </div>
        </div>
        {isPremium && <DownloadedExpenses />}
        {!isPremium && <Dummy/>}
      </div>
    </div>
  );
};

export default Expense;
