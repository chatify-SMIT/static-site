export const fetchDataSuccess = (data) => {
  return {
    type: "FETCH_DATA_SUCCESS",
    payload: data,
  };
};
