/*
    Moshe Dego 315044511
    Omri Elbaz 315006635
*/

//import the relevant components
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './navbar';
import HomePage from './homePage';
import ReportsPage from "./reportsPage";

//app component
function App() {
    return (
        <Router> {/*set up a Router to manage routing */}
            <div className="App">
                <Navbar/>
                <div className="content">
                    <Routes> {/*set up the routing for different pages */}
                        <Route exact path="/" element={<HomePage/>}>
                        </Route>
                        <Route path="/report" element={<ReportsPage/>}>
                        </Route>
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App;