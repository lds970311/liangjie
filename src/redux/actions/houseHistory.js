import {ADD_HISTORY, CLEAR_ALL_HISTORY, DELETE_HISTORY} from "../constant";

function addHistory(houseId) {
    return {
        type: ADD_HISTORY,
        data: houseId
    }
}

function deleteHistory(houseId) {
    return {
        type: DELETE_HISTORY,
        data: houseId
    }
}

function clearAllHistory() {
    return {
        type: CLEAR_ALL_HISTORY,
        data: null
    }
}

export {addHistory, deleteHistory, clearAllHistory}