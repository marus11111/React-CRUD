import './entry.scss';

import React from 'react';
import {
  render
} from 'react-dom';
import {
  createStore,
  combineReducers,
  applyMiddleware
} from 'redux';
import {
  Provider
} from 'react-redux';
import {
  Router,
  Route,
  IndexRoute
} from 'react-router';
import {
  routerMiddleware
} from 'react-router-redux';
import {
  reducer as formReducer,
  Field
} from 'redux-form';
import thunk from 'redux-thunk';
import authorizationReducer from './js/reducers/authorization';
import imageReducer from './js/reducers/image';
import postsReducer from './js/reducers/posts';
import commentsReducer from './js/reducers/comments';
import errorsReducer from './js/reducers/errors';
import Authorization from './js/components/Authorization.jsx';
import User from './js/components/User.jsx';
import BlogList from './js/components/BlogList.jsx';
import PostView from './js/components/PostView.jsx';
import CreatePost from './js/components/CreatePost.jsx';
import EditPost from './js/components/EditPost.jsx';
import authorizationAction from './js/actions/ajax/authorization';
import clearErrors from './js/actions/clearErrors';
import browserHistory from './js/helpers/browserHistory';

//
let html = document.documentElement;
html.className = html.className.replace(/\s?no-js\s?/, '');

browserHistory.listen(() => {
  store.dispatch(clearErrors());
});

const reducers = combineReducers({
  auth: authorizationReducer,
  image: imageReducer,
  posts: postsReducer,
  comments: commentsReducer,
  errors: errorsReducer,
  form: formReducer
});

const routerMidd = routerMiddleware(browserHistory);
const store = createStore(reducers, applyMiddleware(thunk, routerMidd));

//check cookies 
store.dispatch(authorizationAction('cookie'));

render(
  <Provider store={store}>
    <Router history={browserHistory}>
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
