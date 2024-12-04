/* eslint-disable no-unused-vars */
import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: ({type, message}) => {},
    setFeedbackFromError: ({type, error}) => {},
    setShouldRefresh: (value) => {}
});

export default FeedbackContext;