import './sass/entry.scss';
import './pics/winter.jpg';

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
import authorizationReducer from './reducers/authorization';
import imageReducer from './reducers/image';
import postsReducer from './reducers/posts';
import commentsReducer from './reducers/comments';
import errorsReducer from './reducers/errors';
import Authorization from './components/Authorization.jsx';
import User from './components/User.jsx';
import BlogList from './components/BlogList.jsx';
import PostView from './components/PostView.jsx';
import CreatePost from './components/CreatePost.jsx';
import EditPost from './components/EditPost.jsx';
import authorizationAction from './actions/ajax/authorization';
import clearErrors from './actions/clearErrors';
import browserHistory from './helpers/browserHistory';

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
