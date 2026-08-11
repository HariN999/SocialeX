import React, { useContext, useEffect, useState } from 'react'
import Message from './Message'
import { GeneralContext } from '../../context/GeneralContextProvider';

const Messages = () => {

  const {socket, chatData} = useContext(GeneralContext)
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages([]);
  }, [chatData.chatId]);

  useEffect(()=>{
    const handleMessagesUpdated = ({ chat }) => {
      if (chat) {
        setMessages(chat.messages || []);
      }
    };

    const handleNewMessage = () => {
      if (chatData.chatId && chatData.chatId !== 'null') {
        socket.emit('update-messages', { chatId: chatData.chatId });
      }
    };

    socket.on('messages-updated', handleMessagesUpdated);
    socket.on('message-from-user', handleNewMessage);

    return () => {
      socket.off('messages-updated', handleMessagesUpdated);
      socket.off('message-from-user', handleNewMessage);
    };
  },[socket, chatData])

  return (
    <div className='messages' >
      {messages.length > 0 ? messages.map((message)=>(
        <Message message={message} key={message.id} />
      )) : (
        <div className="messageThreadEmpty">
          <span>No messages yet</span>
        </div>
      )}
    </div>
  )
}

export default Messages
