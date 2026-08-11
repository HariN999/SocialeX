import React from 'react'
import Search from './Search'
import Chats from './Chats'
import { BiEdit, BiChevronDown } from 'react-icons/bi'

const Sidebar = () => {
  const focusSearch = () => {
    document.querySelector('.chat-search-form input')?.focus();
  }

  return (
    <div className='sidebar'>
      <div className="messagesPanelHeader">
        <h1>Messages</h1>
        <button type="button" className="newMessageIconButton" onClick={focusSearch} aria-label="New message">
          <BiEdit />
        </button>
      </div>
      <div className="messagesPanelToolbar">
        <button type="button" className="conversationFilterButton" aria-label="Conversation filter">
          <span>All</span>
          <BiChevronDown />
        </button>
      </div>
      <Search />
      <Chats />
    </div>
  )
}

export default Sidebar
