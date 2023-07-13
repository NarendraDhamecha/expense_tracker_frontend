import { Route, Switch} from 'react-router-dom';
import SignUp from "./components/Auth/SignUp";
import LogIn from "./components/Auth/LogIn";


function App() {
  return (
    <Switch>
        <Route exact path='/' component={SignUp}/>
        <Route exact path='/login' component={LogIn}/>
    </Switch>
  );
}

export default App;
