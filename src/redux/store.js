import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import dataReducer from "./datareducer";

const rootReducer = combineReducers({
  data: dataReducer,
});

// Create the Redux store
const store = createStore(rootReducer, applyMiddleware(thunk));

// Load auth state from localStorage and dispatch loginSuccess if the user is already authenticated

export default store;
