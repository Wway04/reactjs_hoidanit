const initialState = [];

const counterReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD":
      return { ...state, counter: state.counter + 1 };
    case "REMOVE":
      return { ...state, counter: state.counter - 1 };
      case "UPDATE":
      return { ...state, counter: state.counter - 1 };
    default:
      return state;
  }
};

export default counterReducer;
