const editChangeHandler = (fieldName) => (dispatch) =>
    (event) => {
        const value = event.target.value;
        dispatch({ type: 'REACTML_UPDATE', fieldName, value });
    };

export default {
    editChangeHandler,
};