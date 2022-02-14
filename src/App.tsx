import { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { createBrowserHistory } from 'history';

//recoil
import recoil, { RecoilRoot } from 'recoil';

//css
import '@styles/App.css';

// components
import DisplayHandler from './DisplayHandler';
import Login from "@pages/Login";
import Main from './pages/Main';

const App: React.FC = () => {

  return <RecoilRoot>
    <Router>
      <DisplayHandler>
        <Routes>
          <Route path="/login" element={ <Login/> }/>
          <Route path="/*" element={ <Main/> }/>
        </Routes>
      </DisplayHandler>
    </Router>
  </RecoilRoot>
};

export default App