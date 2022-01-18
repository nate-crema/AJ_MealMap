import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Switch, Route, useHistory } from 'react-router-dom';

// components
import ManageMeeting from './Manage/ManageMeeting';

function Manage({ history }) {

    return <Switch>
        <Route
            key="record_reviewed"
            path="/manage/meeting"
            exact={true}
            render={() => <ManageMeeting history={ history } />}
        />
        <Route>
            { () => window.onload = () => history.push("/") }
        </Route>
    </Switch>;
}

export default Manage;