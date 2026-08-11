import React from 'react'
import '../styles/Chat.css'
import LeftSidebar from '../components/Sidebar'
import Sidebar from '../components/chat/Sidebar'
import UserChat from '../components/chat/UserChat'

const Chat = () => {
  return (
    <div className='chatPageContainer'>
      <LeftSidebar />

      <div className="chatMainArea">
        <Sidebar />
        <UserChat />
      </div>
    </div>
  )
}

export default Chat;