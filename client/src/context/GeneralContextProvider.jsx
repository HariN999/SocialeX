import React, { createContext, useReducer, useState, useEffect } from 'react'
import socketIoClient from 'socket.io-client';

export const GeneralContext = createContext();


const WS = process.env.REACT_APP_WS_URL || 'http://localhost:6001';

const socket = socketIoClient(WS, {
  autoConnect: false,
  auth: {
    token: localStorage.getItem('userToken')
  }
});

export const GeneralContextProvider = ({children}) => {

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (token) {
            socket.auth = { token };
            socket.connect();
        }
        return () => {
            socket.disconnect();
        };
    }, []);

    const [isCreatPostOpen, setIsCreatePostOpen] = useState(false);
    const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);

    const [notifications, setNotifications] = useState([]);


    const [chatFirends, setChatFriends] = useState([]);
   

    const INITIAL_STATE = {
      chatId: 'null',
      user: {},
  };

  const userId = localStorage.getItem('userId');

  const chatReducer = (state, action) => {
      switch (action.type) {
          case "CHANGE_USER":
              return {
                  user: action.payload,
                  chatId: userId > action.payload._id ? userId + action.payload._id : action.payload._id + userId
              }
          default:
              return state;
      }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);




  return (
    <GeneralContext.Provider value={{socket, isCreatPostOpen, setIsCreatePostOpen, isCreateStoryOpen, setIsCreateStoryOpen, isNotificationsOpen, setNotificationsOpen, notifications, setNotifications, chatFirends, setChatFriends, chatData:state, dispatch}}>{children}</GeneralContext.Provider>
  )
}
