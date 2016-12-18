import './sass/entry.scss';

import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {reducer as formReducer, Field} from 'redux-form';
import authorizationReducer from './reducers/authorization';
import userDataReducer from './reducers/userData';
import thunk from 'redux-thunk';
import Authorization from './components/Authorization.jsx';
import User from './components/User.jsx';
import BlogList from './components/BlogList.jsx';
import PostView from './components/PostView.jsx';
import CreateUpdatePost from './components/CreateUpdatePost.jsx';
import ajaxRequest from './actions/ajaxRequest';



const reducers = combineReducers({
    auth: authorizationReducer,
    userData: userDataReducer,
    form: formReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

//check cookies and start rendering after it's done
store.dispatch(ajaxRequest('post', 'cookieAuth'))
.then(() => {
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path='/' component={Authorization}/>
                <Route path='/:user' component={User}>
                    <IndexRoute component={BlogList} />
                    <Route path='post/*' component={PostView} />
                    <Route path='post/*/update' type='Update' protection='redirect' component={CreateUpdatePost} />
                    <Route path='create' type='Create' protection='redirect' component={CreateUpdatePost} />
                </Route>
            </Router>
        </Provider>,
       document.getElementById('root')
     );
});