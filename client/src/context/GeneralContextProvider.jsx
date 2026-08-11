import React, { createContext, useReducer, useState, useEffect } from 'react'
import socketIoClient from 'socket.io-client';
import { useLocation } from 'react-router-dom';

export const GeneralContext = createContext();

const WS = process.env.REACT_APP_WS_URL || 'http://localhost:6001';

const buildChatId = (idA, idB) => {
    const a = String(idA);
    const b = String(idB);
    return a > b ? a + b : b + a;
};

const socket = socketIoClient(WS, {
  autoConnect: false,
  reconnection: true,
  transports: ['polling', 'websocket'],
  auth: {
    token: localStorage.getItem('userToken')
  }
});

export const GeneralContextProvider = ({children}) => {
    const location = useLocation();

    useEffect(() => {
        const token = localStorage.getItem('userToken');
        if (!token) {
            if (socket.connected) socket.disconnect();
            return;
        }

        socket.auth = { token };
        if (!socket.connected) {
            socket.connect();
        }
    }, [location.pathname]);

    const [isCreatPostOpen, setIsCreatePostOpen] = useState(false);
    const [isCreateStoryOpen, setIsCreateStoryOpen] = useState(false);
    const [isNotificationsOpen, setNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [chatFirends, setChatFriends] = useState([]);

    const INITIAL_STATE = {
      chatId: 'null',
      user: {},
    };

    const chatReducer = (state, action) => {
        switch (action.type) {
            case "CHANGE_USER": {
                const userId = localStorage.getItem('userId');
                return {
                    user: action.payload,
                    chatId: buildChatId(userId, action.payload._id)
                };
            }
            default:
                return state;
        }
    };

    const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

    return (
        <GeneralContext.Provider value={{socket, isCreatPostOpen, setIsCreatePostOpen, isCreateStoryOpen, setIsCreateStoryOpen, isNotificationsOpen, setNotificationsOpen, notifications, setNotifications, chatFirends, setChatFriends, chatData:state, dispatch}}>{children}</GeneralContext.Provider>
    );
};
