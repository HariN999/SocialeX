import React, { useState, useRef, useEffect } from 'react'
import { renderAvatar } from '../utils/avatar';
import axios from "../api/axios";
import '../styles/CreatePosts.css'

const CreatePost = ({ onPostCreated }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [postDescription, setPostDescription] = useState('');
    const [postLocation, setPostLocation] = useState('');
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const textareaRef = useRef(null);
    const username = localStorage.getItem('username');
    const profilePic = localStorage.getItem('profilePic');

    const handleFocus = () => {
        setIsExpanded(true);
    };

    useEffect(() => {
        if (isExpanded && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isExpanded]);

    const handleCancel = () => {
        if (postDescription.trim()) {
            if (!window.confirm("Discard your draft post?")) {
                return;
            }
        }
        setPostDescription('');
        setPostLocation('');
        setShowLocationInput(false);
        setErrorMsg('');
        setIsExpanded(false);
    };

    const handlePostUpload = async (e) => {
        if (e) e.preventDefault();
        if (!postDescription.trim()) return;
        if (postDescription.length > 280) return;

        setIsLoading(true);
        setErrorMsg('');
        try {
            const inputs = {
                fileType: '',
                file: '',
                description: postDescription.trim(),
                location: postLocation.trim()
            };
            await axios.post('/createPost', inputs);
            setPostDescription('');
            setPostLocation('');
            setShowLocationInput(false);
            setIsExpanded(false);
            if (onPostCreated) {
                onPostCreated();
            }
        } catch (err) {
            console.error(err);
            setErrorMsg('Could not create post. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const isPostDisabled = !postDescription.trim() || postDescription.length > 280 || isLoading;

    return (
        <div className={`inline-composer ${isExpanded ? 'expanded' : 'compact'}`}>
            {errorMsg && <div className="alert alert-danger composer-error">{errorMsg}</div>}

            <div className="composer-row">
                <div className="composer-avatar-col">
                    {renderAvatar(username, profilePic, "composer-avatar")}
                </div>
                <div className="composer-input-col">
                    <textarea
                        ref={textareaRef}
                        className="composer-textarea"
                        placeholder="What's happening?"
                        value={postDescription}
                        onChange={(e) => setPostDescription(e.target.value)}
                        onFocus={handleFocus}
                        maxLength={280}
                        rows={isExpanded ? 3 : 1}
                    />
                </div>
                {!isExpanded && (
                    <div className="composer-compact-btn-col">
                        <button className="btn btn-primary btn-sm post-btn" disabled>
                            Post
                        </button>
                    </div>
                )}
            </div>

            {isExpanded && (
                <div className="composer-expanded-options">
                    <div className="composer-meta-row">
                        <span className={`char-counter ${postDescription.length > 280 ? 'counter-danger' : ''}`}>
                            {postDescription.length} / 280
                        </span>

                        {!showLocationInput ? (
                            <button
                                type="button"
                                className="location-toggle-btn"
                                onClick={() => setShowLocationInput(true)}
                            >
                                📍 Add location
                            </button>
                        ) : (
                            <div className="composer-location-input-wrapper">
                                <input
                                    type="text"
                                    className="composer-location-field"
                                    placeholder="Location (optional)"
                                    value={postLocation}
                                    onChange={(e) => setPostLocation(e.target.value)}
                                />
                            </div>
                        )}
                    </div>

                    <hr className="composer-divider" />

                    <div className="composer-actions">
                        <button type="button" className="btn-cancel" onClick={handleCancel} disabled={isLoading}>
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary post-btn"
                            disabled={isPostDisabled}
                            onClick={handlePostUpload}
                        >
                            {isLoading ? 'Posting...' : 'Post'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreatePost;