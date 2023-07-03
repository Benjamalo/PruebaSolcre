import axios from "axios";

export const GET_USERS = "GET_USERS"
const URL = 'http://localhost:3000/';



export function getUsers() {
    return async function (dispatch) {
      const results = await axios(`${URL}`);
      console.log(results.data)
      dispatch({
        type: "GET_USERS",
        payload: results.data,
      });
    };
  }