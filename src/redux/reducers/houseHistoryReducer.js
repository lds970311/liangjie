import {ADD_HISTORY, CLEAR_ALL_HISTORY, DELETE_HISTORY} from "../constant";

const initState = []

function deleteItem(historyList, id) {
    let index = historyList.indexOf(id);
    historyList.splice(index, 1)
    return historyList
}

function houseHistoryReducer(preState = initState, action) {
    const {data, type} = action
    switch (type) {
        case ADD_HISTORY:
            return [data, ...preState]
        case DELETE_HISTORY:
            return [...deleteItem(preState, data)]
        case CLEAR_ALL_HISTORY:
            return []
        default:
            return preState
    }
}

export default houseHistoryReducer