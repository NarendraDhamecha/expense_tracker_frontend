import { useCallback, useEffect, useRef, useState } from "react";
import ExpensesList from "./ExpensesList";
import PremiumFeature from "./PremiumFeature";
import DownloadedExpenses from "./DownloadedExpenses";
import axios from "axios";

const Expense = () => {
  const initialState = JSON.parse(localStorage.getItem("isPremium"));
  const initialRowsPerPage = Number(localStorage.getItem('rows')); 
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

  const getExpenses = useCallback(async (page) => {
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
  },[rowsPerPage]);

  useEffect(() => {
    getExpenses(1);
    console.log('useEffect')
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
    localStorage.setItem('rows', e.target.value);
    setRowsPerPage(e.target.value);
  }

  return (
    <div className="container-fluid text-center">
      <label className="me-1">Rows per page :</label>
      <select onChange={handleRowsPerPage}>
        <option value="5">5</option>
        <option value="10">10</option>
        <option value="15">15</option>
        <option value="20">20</option>
      </select>
      <PremiumFeature setPremium={setPremium} isPremium={isPremium} />
      <div className="row">
        <div className="col-md-5 col-10 mx-auto">
          <div className="card">
            <h2 className="card-header">ADD EXPENSES HERE</h2>
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
      </div>
      <div className="row">
        <div className="col-md-6 col-10 mx-auto">
          <div className="card mt-2">
            <h2 className="card-header">EXPENSES</h2>
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
      </div>
      {isPremium && <DownloadedExpenses />}
    </div>
  );
};

export default Expense;
