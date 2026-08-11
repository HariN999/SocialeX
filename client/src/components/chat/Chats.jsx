import React, { useContext, useEffect } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider';
import { renderAvatar } from '../../utils/avatar';

const Chats = () => {
  const { socket, chatFirends, setChatFriends, dispatch, chatData } = useContext(GeneralContext)

  const formatRelativeTime = (dateValue) => {
    if (!dateValue) return '';

    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return '';

    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'now';

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;

    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;

    const weeks = Math.floor(days / 7);
    return `${weeks}w`;
  }

  useEffect(() => {
    if (!socket) return;

    const requestFriends = () => {
      if (socket.connected) {
        socket.emit('fetch-friends');
      }
    };

    const handleFriendsFetched = ({ friendsData }) => {
      setChatFriends(friendsData || []);
    };

    socket.on('connect', requestFriends);
    socket.on("friends-data-fetched", handleFriendsFetched);
    socket.on('messages-updated', requestFriends);
    requestFriends();

    return () => {
      socket.off('connect', requestFriends);
      socket.off("friends-data-fetched", handleFriendsFetched);
      socket.off('messages-updated', requestFriends);
    };

  }, [socket, setChatFriends])

  const handleSelect = (data) => {
    dispatch({ type: "CHANGE_USER", payload: data });
  }

  useEffect(() => {
    if (!socket) return;
    if (chatData.chatId && chatData.chatId !== 'null') {
      socket.emit('fetch-messages', { chatId: chatData.chatId })
    }
  }, [chatData, socket])

  return (
    <div className='chats'>
      {chatFirends && chatFirends.length > 0 ? (
        chatFirends.map((data) => {
          const isActive = chatData.user?._id === data._id;
          const latestMessage = data.latestMessage || data.lastMessage;
          const preview = typeof latestMessage === 'string' ? latestMessage : latestMessage?.text || 'No messages yet';
          const timestamp = formatRelativeTime(latestMessage?.date || data.updatedAt);

          return (
            <div className={`userInfo ${isActive ? 'active' : ''}`} key={data._id} onClick={() => handleSelect(data)} >
              {renderAvatar(data.username, data.profilePic, "conversationAvatar")}
              <div className="userChatInfo">
                <div className="conversationMetaLine">
                  <span className="conversationName">{data.username}</span>
                  {timestamp && <span className="conversationTime">{timestamp}</span>}
                </div>
                <span className="conversationHandle">@{data.username?.toLowerCase()}</span>
                <p className="conversationPreview">{preview}</p>
              </div>
            </div>
          )
        })
      ) : (
        <div className="chatsEmptyState">
          <h4>No conversations yet</h4>
          <p>Search for someone to start a conversation.</p>
        </div>
      )}
    </div>
  )
}

export default Chats;
