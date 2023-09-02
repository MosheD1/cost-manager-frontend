import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Navbar from './navbar';
import HomePage from './homePage';
import ReportsPage from "./reportsPage";

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar/>
                <div className="content">
                    <Routes>
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