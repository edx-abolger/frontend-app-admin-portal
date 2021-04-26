import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const REMOVE_ITEM_ACTION = 'REMOVE_ITEM_ACTION';
export const removeAction = (itemId) => ({
  type: REMOVE_ITEM_ACTION,
  itemId
});

const reducer = (rowListState = [], action) => {
  switch (action.type) {
    case REMOVE_ITEM_ACTION:
      return rowListState.filter(item => item.id != action.itemId);
    default:
      return rowListState;
  }

}

//TODO: dispatch + action to add items, 
// 

export const BulkEnrollContext = createContext({});

const BulkEnrollContextProvider = ({ children }) => {
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState({});

  const value = {
    courses: [selectedCourses, setSelectedCourses],
    emails: [selectedEmails, setSelectedEmails],
    subscription: [selectedSubscription, setSelectedSubscription],
  };

  return <BulkEnrollContext.Provider value={value}>{children}</BulkEnrollContext.Provider>;
};

BulkEnrollContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default BulkEnrollContextProvider;
