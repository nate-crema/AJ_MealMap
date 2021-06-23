import react from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";

// components
import Index from "./pages/Index";

function App() {
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
