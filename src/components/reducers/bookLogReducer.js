function bookLogReducer(state, action) {
  console.log("action", action);
  console.log("reducer:state", state);

  if (typeof state === "undefined") {
    return {
      bookLog: []
    };
  }

  const {
    bookid,
    title,
    author,
    category,
    pages,
    journal,
    startDate,
    endDate,
    completed,
    imageURL,
    currency,
    price
  } = action.bookLog;

  switch (action.type) {
    case "ADD_BOOKLOG_MANUAL":
      console.log("reducer inside", state.bookLog);
      return {
        ...state,
        bookLog: state.bookLog.bookLog.concat({
          bookid,
          title,
          author,
          category,
          pages,
          journal,
          startDate,
          endDate,
          completed,
          imageURL,
          currency,
          price
        })
      };

    default:
      return state;
  }
}

export default bookLogReducer;
