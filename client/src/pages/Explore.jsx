import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { TbSearch } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { renderAvatar } from '../utils/avatar';
import '../styles/Explore.css';

const Explore = () => {
    const navigate = useNavigate();

    const [search, setSearch] = useState('');
    const [results, setResults] = useState([]);
    const [err, setErr] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [lastQuery, setLastQuery] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        const q = search.trim();
        if (!q) return;

        setErr(false);
        setResults([]);
        setIsLoading(true);
        setLastQuery(q);

        try {
            const response = await axios.get(`/search-users?q=${encodeURIComponent(q)}`);
            const users = response.data?.users || [];
            setResults(users);
            setErr(users.length === 0);
        } catch (error) {
            console.error('Error searching users:', error);
            setErr(true);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!search.trim()) {
            setResults([]);
            setErr(false);
            setLastQuery('');
        }
    }, [search]);

    return (
        <div className="explorePage">
            <Sidebar />

            <div className="exploreContent">
                <div className="exploreHeader">
                    <h2>Explore</h2>
                </div>

                <div className="exploreSearchBox">
                    <form onSubmit={handleSearch} className="exploreSearchForm">
                        <input
                            type="text"
                            placeholder="Search users by username..."
                            onChange={(e) => setSearch(e.target.value)}
                            value={search}
                        />
                        <button type="submit" className="exploreSearchBtn">
                            <TbSearch />
                        </button>
                    </form>
                </div>

                <div className="exploreResults">
                    {isLoading && <p className="loading-text">Searching...</p>}
                    {err && !isLoading && (
                        <p className="error-text">No users found matching "{lastQuery}"</p>
                    )}

                    {results.map((user) => (
                        <div
                            className="userCard"
                            key={user._id}
                            onClick={() => navigate(`/profile/${user._id}`)}
                        >
                            {renderAvatar(user.username, user.profilePic, 'userCardAvatar')}
                            <div className="userCardInfo">
                                <span className="userCardName">{user.username}</span>
                                <span className="userCardHandle">@{user.username.toLowerCase()}</span>
                            </div>
                            <button className="btn btn-primary btn-sm viewProfileBtn">View Profile</button>
                        </div>
                    ))}

                    {!isLoading && !err && results.length === 0 && (
                        <div className="exploreEmptyState">
                            <p>Discover other users on SocialeX. Try searching for friends by their username!</p>
                        </div>
                    )}
                </div>
            </div>

            <RightSidebar />
        </div>
    );
};

export default Explore;
