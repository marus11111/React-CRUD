import './sass/entry.scss';

import React from 'react';
import {render} from 'react-dom';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import {reducer as formReducer, Field} from 'redux-form';
import thunk from 'redux-thunk';
import SignInUp from './components/SignInUp.jsx';

const reducers = combineReducers({
    form: formReducer
});

const store = createStore(reducers, applyMiddleware(thunk));


class App extends React.Component {
    render (){
        return (
            <div>
                <SignInUp formType='signUp'/>
                <SignInUp formType='signIn'/>
            </div>
        )
    }
}


render(
    <Provider store={store}>
        <App />
    </Provider>,
   document.getElementById('root')
 );
   