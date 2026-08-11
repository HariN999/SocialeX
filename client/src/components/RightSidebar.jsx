import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { renderAvatar } from '../utils/avatar';
import '../styles/RightSidebar.css';

const RightSidebar = () => {
    const navigate = useNavigate();
    const [suggestions, setSuggestions] = useState([]);

    const profilePic = localStorage.getItem('profilePic');
    const username = localStorage.getItem('username');
    const userId = localStorage.getItem('userId');

    useEffect(() => {
        const following = (localStorage.getItem('following') || '').split(',');
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get('/fetchAllPosts');
                const posts = response.data || [];

                // Extract unique post authors
                const authorsMap = new Map();
                posts.forEach(post => {
                    if (
                        post.userId &&
                        post.userId !== userId &&
                        !following.includes(post.userId)
                    ) {
                        authorsMap.set(post.userId, {
                            _id: post.userId,
                            username: post.userName,
                            profilePic: post.userPic
                        });
                    }
                });

                setSuggestions(Array.from(authorsMap.values()).slice(0, 4));
            } catch (err) {
                console.error('Error fetching suggestions:', err);
            }
        };

        fetchSuggestions();
    }, [userId]);

    return (
        <div className="sidebar-right">
            <div className="user-profile-summary" onClick={() => navigate(`/profile/${userId}`)}>
                {renderAvatar(username, profilePic, "summary-avatar")}
                <div className="summary-info">
                    <span className="summary-name">{username}</span>
                    <span className="summary-handle">@{username?.toLowerCase()}</span>
                </div>
            </div>

            <div className="right-card suggestions-card">
                <h3>Who to follow</h3>
                <div className="suggestions-list">
                    {suggestions.length > 0 ? (
                        suggestions.map(user => (
                            <div key={user._id} className="suggestion-item" onClick={() => navigate(`/profile/${user._id}`)}>
                                {renderAvatar(user.username, user.profilePic, "suggestion-avatar")}
                                <div className="suggestion-info">
                                    <span className="suggestion-name">{user.username}</span>
                                    <span className="suggestion-handle">@{user.username.toLowerCase()}</span>
                                </div>
                                <button className="btn btn-sm btn-outline-primary follow-suggestion-btn">View</button>
                            </div>
                        ))
                    ) : (
                        <p className="empty-text">No suggestions available</p>
                    )}
                </div>
            </div>

            <div className="right-card trending-card">
                <h3>Trending Topics</h3>
                <div className="trending-list">
                    <div className="trending-item">
                        <span className="trending-category">Technology · Trending</span>
                        <span className="trending-topic">#MERNStack</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-category">Web Development · Trending</span>
                        <span className="trending-topic">#SocketIO</span>
                    </div>
                    <div className="trending-item">
                        <span className="trending-category">JavaScript · Trending</span>
                        <span className="trending-topic">#ReactJS</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RightSidebar;
