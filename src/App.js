import { Route, Switch} from 'react-router-dom';
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/LogIn";
import Expense from './components/Expenses/Expense';
import { useState } from 'react';
import ForgotPassword from './components/Auth/ForgotPassword';
import Navbar from './components/Layout/Navbar';


function App() {
  const initialState = localStorage.getItem('token')
  const [token, setToken] = useState(initialState);
  
  return (
    <>
    <Navbar token={token} setToken={setToken}/>
    <Switch>
        <Route exact path='/' component={SignUp}/>
        <Route exact path='/login'>
          <LogIn setToken={setToken}/>
        </Route>
        {token && <Route exact path='/expenses' component={Expense}/>}
        <Route exact path='/forgotpassword' component={ForgotPassword}/>
    </Switch>
    </>
  );
}

export default App;
