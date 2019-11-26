import actionTypes from 'actions/actionTypes';
import { toggleColumnVisibility } from '../models/beta/column'

const initialState = {
  isFetched: false,
  error: null,
  visibleColumns: {
    chilly_bin: true,
    backlog: true,
    done: true
  }
};

const projectBoardReducer = (state = initialState, action) => {
  switch(action.type) {
  case actionTypes.REQUEST_PROJECT_BOARD:
    return {
      ...state,
      isFetched: false,
      error: null
    };
  case actionTypes.RECEIVE_PROJECT_BOARD:
    return {
      ...state,
      projectId: action.data,
      isFetched: true
    };
  case actionTypes.ERROR_REQUEST_PROJECT_BOARD:
    return {
      ...state,
      error: action.error
    };
  case actionTypes.TOGGLE_COLUMN_VISIBILITY:
    return {
      ...state,
      visibleColumns: toggleColumnVisibility(state.visibleColumns, action.column)
    };
  default:
    return state;
  }
};

export default projectBoardReducer;
