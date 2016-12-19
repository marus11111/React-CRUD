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
import CreatePost from './components/CreatePost.jsx';
import UpdatePost from './components/UpdatePost.jsx';
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
                    <Route path=':postId/:title' component={PostView} />
                    <Route path=':postId/:title/update' protection='redirect' component={UpdatePost} />
                    <Route path='create' protection='redirect' component={CreatePost} />
                </Route>
            </Router>
        </Provider>,
       document.getElementById('root')
     );
})
//dont proceed if user credentials cant be checked
.catch((error) => {
    render(
        <p>An error occured when trying to connect to the server.</p>,
        document.getElementById('root')
    )
})