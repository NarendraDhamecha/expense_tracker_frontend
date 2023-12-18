import "./expenses.css";

const ExpensesList = (props) => {
  

  return (
    <ul>
      {props.expenses.map((expense) => {
        return (
          <li className="expense mb-2" key={expense.id}>
            <div>
              <b>Amount - </b> {`$${expense.amount}`}
            </div>
            <div>
              <b>Description - </b> {expense.description}
            </div>
            <div>
              <b>Catagory - </b> {expense.category}
            </div>
            <div>
            <button className="btn btn-danger btn-sm" onClick={() => props.onDelete(expense.id, expense.amount)}>Delete</button>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

export default ExpensesList;
