import react from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import json from "./keys/api.json";

// components
import Index from "./pages/Index";

function App() {

  const APIKEY = json.kakao.web;

  react.useEffect(() => {
    const scriptMapBase = document.createElement('script');
    scriptMapBase.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&autoload=false`;
    scriptMapBase.async = false;
    document.body.appendChild(scriptMapBase);


    const scriptMapLib = document.createElement('script');
    scriptMapLib.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${APIKEY}&libraries=services,clusterer,drawing&autoload=false`;
    scriptMapLib.async = false;
    document.body.appendChild(scriptMapLib);
  
  
  
    return () => {
      document.body.removeChild(scriptMapBase);
      document.body.removeChild(scriptMapLib);
    }
  }, []);
  return (
    <Router>
      <Switch>
        {/* 
        
          /shared: 공유된 컨텐츠 열람 페이지 (디자인 별개)
          /: 일반 사용 페이지
        
        */}
        {/* <Route path="/shared" component={Shared}/> */}
        <Route path="/" component={Index}/>
      </Switch>
    </Router>
  );
}

export default App;
