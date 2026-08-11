import React, { useContext, useEffect, useRef } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';
import { renderAvatar } from '../../utils/avatar';

const Message = ({message}) => {

  const {chatData} = useContext(GeneralContext);

  const ref = useRef();

  let date = new Date(message.date);

  useEffect(() => {
    ref.current?.scrollIntoView({behavior:'smooth'})
  }, [message]);

  const userId = localStorage.getItem('userId');
  return (
    <div>
        <div ref={ref} className={`message ${message.senderId === userId ? "owner" : ""}`}>
      <div className="messageInfo">
        {message.senderId === userId ?
          renderAvatar(localStorage.getItem('username'), localStorage.getItem('profilePic')) :
          renderAvatar(chatData.user.username, chatData.user.profilePic)
        }
        <span>{ date.getHours() < 12 ?  date.getHours() + ':' + date.getMinutes() + ' AM' : date.getHours()-12 + ':' + date.getMinutes() + ' PM' }</span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
      </div>
    </div>
    </div>
  )
}

export default Message;