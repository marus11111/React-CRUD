import './sass/entry.scss';

import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {reducer as formReducer, Field} from 'redux-form';
import authorizationReducer from './reducers/authorization';
import userDataReducer from './reducers/userData';
import errorsReducer from './reducers/errors';
import thunk from 'redux-thunk';
import Authorization from './components/Authorization.jsx';
import User from './components/User.jsx';
import BlogList from './components/BlogList.jsx';
import PostView from './components/PostView.jsx';
import CreatePost from './components/CreatePost.jsx';
import EditPost from './components/EditPost.jsx';
import ajaxRequest from './helpers/ajaxRequest';
import clearErrors from './actions/ajaxErrors/clearErrors';


const reducers = combineReducers({
    auth: authorizationReducer,
    userData: userDataReducer,
    errors: errorsReducer,
    form: formReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

hashHistory.listen(() => {
    store.dispatch(clearErrors());
});

//check cookies and start rendering after it's done
store.dispatch(ajaxRequest('post', 'cookieAuth'))
.then(() => {
    render(
        <Provider store={store}>
            <Router history={hashHistory}>
                <Route path='/' component={Authorization}/>
                <Route path='/:user' component={User}>
                    <IndexRoute component={BlogList} />
                    <Route path=':postId/:titleLink' component={PostView} />
                    <Route path=':postId/:titleLink/edit' protection='redirect' component={EditPost} />
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
        <p>{error}An error occured when trying to connect to the server.</p>,
        document.getElementById('root')
    )
})