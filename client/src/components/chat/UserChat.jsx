import React, { useContext } from 'react'
import Input from './Input';
import Messages from './Messages';
import { GeneralContext } from '../../context/GeneralContextProvider';
import { renderAvatar } from '../../utils/avatar';
import { BiMessageRoundedDetail } from 'react-icons/bi';

const UserChat = () => {
  const { chatData } = useContext(GeneralContext);
  const hasSelectedUser = Boolean(chatData.user?._id);

  const focusSearch = () => {
    document.querySelector('.chat-search-form input')?.focus();
  }

  return (
    <div className='chat'>
      {hasSelectedUser ? (
        <>
          <div className="chatInfo">
            {renderAvatar(chatData.user.username, chatData.user.profilePic, "chatHeaderAvatar")}
            <div className="chatHeaderDetails">
              <span className="chatHeaderName">{chatData.user.username}</span>
              <span className="chatHeaderHandle">@{chatData.user.username?.toLowerCase()}</span>
            </div>
          </div>
          <Messages />
          <Input />
        </>
      ) : (
        <div className="chatEmptyState">
          <div className="chatEmptyIcon">
            <BiMessageRoundedDetail />
          </div>
          <h3>Start a conversation</h3>
          <p>Choose someone from your conversations, or start a new one.</p>
          <button type="button" onClick={focusSearch}>New chat</button>
        </div>
      )}
    </div>
  )
}

export default UserChat;
