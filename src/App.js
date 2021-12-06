import { useEffect } from "react";
import { getCookie, setCookie } from "./connection/cookie";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

// components
import ServiceWrap from "./pages/Wrapper";
import MobileMap from "./mobile/fullmap/MobileMap";
// import Login from "./pages/Login";

function App() {

  useEffect(() => {
    const isLogined = getCookie("isLogined");
    console.log(isLogined);
    if (isLogined != "true") setCookie("isLogined", "true");
  }, []);

  return (
    <>
      <Router>
        <Switch>
          {/* 
          
            /shared: 공유된 컨텐츠 열람 페이지 (디자인 별개)
            /: 일반 사용 페이지
          
          */}
          {/* <Route path="/shared" component={Shared}/> */}
          <Route exact path="/fullmap" component={MobileMap}/>
          <Route path="/" component={ServiceWrap}/>
        </Switch>
      </Router>
    </>
  );
}

export default App;
