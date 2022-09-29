import './App.css';
import {BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import store, {persistor} from './store/index.ts'
import {Provider} from "react-redux"
import {PersistGate} from "redux-persist/integration/react"
import ProtectedRoute from "./routes/ProtectedRoute"
import Main from './components/main/Main';
import Login from './components/main/Login';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="App">
      
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={null}>
          <Router>
            <Navbar/>
            <Routes>
              <Route path='/login' element={<Login/>}/>
              <Route path="/" element={<ProtectedRoute/>} />
            </Routes>
          </Router>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
