import { Route, Switch} from 'react-router-dom';
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/LogIn";
import Expense from './components/Expenses/Expense';
import Leaderboard from './components/Expenses/Leaderboard';
import { useState } from 'react';


function App() {
  const initialState = localStorage.getItem('token')
  const [token, setToken] = useState(initialState);
  
  return (
    <Switch>
        <Route exact path='/' component={SignUp}/>
        <Route exact path='/login'>
          <LogIn setToken={setToken}/>
        </Route>
        {token && <Route exact path='/expenses' component={Expense}/>}
        <Route exact path='/leaderboard' component={Leaderboard}/>
    </Switch>
  );
}

export default App;
