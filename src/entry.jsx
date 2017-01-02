import './sass/entry.scss';

import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {Router, Route, IndexRoute, hashHistory} from 'react-router';
import {reducer as formReducer, Field} from 'redux-form';
import RichTextEditor from 'react-rte';
import authorizationReducer from './reducers/authorization';
import userDataReducer from './reducers/userData';
import hamburgerMenuReducer from './reducers/hamburgerMenu';
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
import setWidth from './actions/setWidth';
import isMenuOpen from './actions/isMenuOpen';

window.RichTextEditor = RichTextEditor;

const reducers = combineReducers({
    auth: authorizationReducer,
    userData: userDataReducer,
    hamburgerMenu: hamburgerMenuReducer,
    errors: errorsReducer,
    form: formReducer
});

const store = createStore(reducers, applyMiddleware(thunk));

hashHistory.listen(() => {
    store.dispatch(clearErrors());
    store.dispatch(isMenuOpen(false));
});

store.dispatch(setWidth(window.innerWidth));
let resizeDebounce;
window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
        store.dispatch(setWidth(window.innerWidth));
    }, 500);
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