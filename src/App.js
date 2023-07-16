import { Route, Switch} from 'react-router-dom';
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/LogIn";
import Expense from './components/Expenses/Expense';


function App() {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  
  return (
    <Switch>
        <Route exact path='/' component={SignUp}/>
        <Route exact path='/login' component={LogIn}/>
        {isLoggedIn === 'true' && <Route exact path='/expenses' component={Expense}/>}
    </Switch>
  );
}

export default App;
