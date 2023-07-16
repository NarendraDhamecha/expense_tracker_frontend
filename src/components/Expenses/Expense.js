import { useEffect, useRef, useState } from "react";
import ExpensesList from "./ExpensesList";

const Expense = () => {
  const [expensesList, setExpensesList] = useState([]);
  const amountRef = useRef("");
  const descriptionRef = useRef("");
  const catagoryRef = useRef("");

  useEffect(() => {
    fetch("http://localhost:4000/expenses")
      .then((response) => response.json())
      .then((data) => setExpensesList(data));
  }, []);

  const submitHandler = async (e) => {
    e.preventDefault();

    const amount = amountRef.current.value;
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
          },
        }
      );

      const data = await response.json();
      setExpensesList((prevList) => [...prevList, data]);
    } catch (err) {
      console.log(err);
    }
  };

  const onDelete = async (id) => {
    const response = await fetch(`http://localhost:4000/expenses/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      const filteredList = expensesList.filter((expense) => {
        return expense.id !== id;
      });

      setExpensesList(filteredList);
    }
  };

  return (
    <div className="container-fluid text-center">
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
                  />
                </div>
                <div className="mb-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Description"
                    ref={descriptionRef}
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Expense;
