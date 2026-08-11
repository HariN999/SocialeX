import React, { useContext, useEffect, useState } from 'react'
import { TbSearch } from 'react-icons/tb'
import { GeneralContext } from '../../context/GeneralContextProvider';
import { renderAvatar } from '../../utils/avatar';
import '../../styles/Search.css';

const Search = () => {
  const { dispatch, socket } = useContext(GeneralContext)
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [err, setErr] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = search.trim();
    if (!query) return;

    if (!socket?.connected) {
      setErr('Not connected to chat server. Refresh the page and try again.');
      return;
    }

    setErr('');
    setResults([]);
    setIsLoading(true);
    socket.emit('chat-user-searched', { username: query });
  }

  useEffect(() => {
    if (!socket) return;

    const onFound = ({ users }) => {
      setIsLoading(false);
      setResults(users || []);
      setErr('');
    };

    const onNotFound = () => {
      setIsLoading(false);
      setResults([]);
      setErr('No user found matching that username.');
    };

    socket.on('searched-chat-users', onFound);
    socket.on('no-searched-chat-user', onNotFound);

    return () => {
      socket.off('searched-chat-users', onFound);
      socket.off('no-searched-chat-user', onNotFound);
    };
  }, [socket]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
    setResults([]);
    setSearch('');
    setErr('');
  }

  return (
    <div className='chat-search-container'>
      <form onSubmit={handleSearch} className="chat-search-form">
        <input
          type="text"
          placeholder="Search people to message"
          onChange={(e) => setSearch(e.target.value)}
          value={search}
        />
        <button type="submit" className="chat-search-btn">
          <TbSearch />
        </button>
      </form>

      {isLoading && <div className="chat-search-status">Searching...</div>}
      {err && <div className="chat-search-status error-message">{err}</div>}

      {results.map((user) => (
        <div className="chat-search-result" key={user._id} onClick={() => handleSelect(user)}>
          {renderAvatar(user.username, user.profilePic, "result-avatar")}
          <div className="result-info">
            <span className="result-name">{user.username}</span>
            <span className="result-handle">@{user.username.toLowerCase()}</span>
          </div>
          <span className="chat-result-action">Message</span>
        </div>
      ))}
    </div>
  )
}

export default Search;
