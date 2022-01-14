import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';

// components
import Reviewed from "./Record/RecordReviewed";
import Searched from "./Record/RecordSearched";

function Record() {

    const history = useHistory();

    return <Switch>
        <Route
            key="record_reviewed"
            path="/record/reviewed"
            exact={true}
            render={() => <Reviewed/>}
        />
        <Route
            key="record_search"
            path="/record/search"
            exact={true}
            render={() => <Searched/>}
        />
        <Route>
            { () => window.onload = () => history.push("/") }
        </Route>
    </Switch>;
}

export default Record;