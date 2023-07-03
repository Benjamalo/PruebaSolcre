import {
    GET_USERS
} from "./actions"

const initialState = {
  users: [],
};

export default function rootReducer(state = initialState, action) {
  // eslint-disable-next-line default-case
  switch (action.type) {
    case GET_USERS:
      return {
        ...state,
        users: action.payload,
      };
  }
}
