import {applyMiddleware, combineReducers, createStore} from 'redux'
import houseHistoryReducer from "./reducers/houseHistoryReducer";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";

const allReducers = combineReducers({
    historyList: houseHistoryReducer
})

const store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)))

export default store