import React, { useContext, useEffect, useState } from 'react';
import { AiOutlineHeart, AiTwotoneHeart, AiOutlineDelete } from "react-icons/ai";
import { BiCommentDetail } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoIosPersonAdd } from 'react-icons/io';
import axios from '../api/axios';
import { GeneralContext } from '../context/GeneralContextProvider';
import { useNavigate } from 'react-router-dom';
import { renderAvatar } from '../utils/avatar';
import '../styles/Posts.css';

const Post = ({ posts: propsPosts, setPosts: propsSetPosts, fetchPosts: propsFetchPosts }) => {
    const navigate = useNavigate();
    const { socket } = useContext(GeneralContext);

    const [localPosts, setLocalPosts] = useState([]);
    const [commentText, setCommentText] = useState({});

    const posts = propsPosts || localPosts;
    const setPosts = propsSetPosts || setLocalPosts;

    const fetchPosts = propsFetchPosts || (async () => {
        try {
            const response = await axios.get('/fetchAllPosts');
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    });

    const currentUserId = localStorage.getItem("userId");

    useEffect(() => {
        if (!propsPosts) {
            fetchPosts();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [propsPosts]);

    const handleLike = (postId) => {
        socket.emit('postLiked', { postId });
    }

    const handleUnLike = (postId) => {
        socket.emit('postUnLiked', { postId });
    }

    const handleFollow = (userId) => {
        socket.emit('followUser', { followingUserId: userId });
    }

    const handleCommentSubmit = (postId) => {
        const comment = commentText[postId];
        if (!comment || !comment.trim()) return;

        socket.emit('makeComment', { postId, comment: comment.trim() });
        setCommentText(prev => ({ ...prev, [postId]: '' }));

        setTimeout(() => {
            fetchPosts();
        }, 150);
    }

    const handleDeletePost = (postId) => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            socket.emit('delete-post', { postId });
        }
    }

    useEffect(() => {
        if (!socket) return;

        socket.on("likeUpdated", () => {
            fetchPosts();
        });

        socket.on('userFollowed', ({ following }) => {
            localStorage.setItem('following', following);
            fetchPosts();
        });

        socket.on('post-deleted', ({ posts: updatedPosts }) => {
            setPosts(updatedPosts || []);
        });

        return () => {
            socket.off("likeUpdated");
            socket.off('userFollowed');
            socket.off('post-deleted');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket]);

    return (
        <div className='postsContainer'>
            {posts && posts.map((post) => {
                const isLikedByMe = post.likes.includes(currentUserId);
                const isMyPost = post.userId === currentUserId;
                const isFollowingAuthor = (localStorage.getItem('following') || '').split(',').includes(post.userId);

                return (
                    <div className="postCard" key={post._id}>
                        <div className="postCardHeader">
                            <div className="avatarWrapper" style={{ cursor: 'pointer' }} onClick={() => navigate(`/profile/${post.userId}`)}>
                                {renderAvatar(post.userName, post.userPic, "postAvatar")}
                            </div>
                            <div className="postHeaderDetails" onClick={() => navigate(`/profile/${post.userId}`)}>
                                <span className="postAuthorName">{post.userName}</span>
                                <span className="postAuthorHandle">@{post.userName?.toLowerCase()}</span>
                                {post.createdAt && (
                                    <span className="postTimestamp">
                                        · {new Date(post.createdAt).toLocaleDateString()}
                                    </span>
                                )}
                            </div>

                            {!isMyPost && !isFollowingAuthor && (
                                <button className="btn btn-sm btn-outline-primary followBtn" onClick={() => handleFollow(post.userId)}>
                                    <IoIosPersonAdd style={{ marginRight: '4px' }} /> Follow
                                </button>
                            )}

                            {isMyPost && (
                                <button className="btn-delete-post" onClick={() => handleDeletePost(post._id)}>
                                    <AiOutlineDelete />
                                </button>
                            )}
                        </div>

                        <div className="postCardBody">
                            <p className="postDescription">{post.description}</p>

                            {post.location && (
                                <div className="postLocationLabel">
                                    <FaGlobeAmericas className="locationIcon" />
                                    <span>{post.location}</span>
                                </div>
                            )}
                        </div>

                        <div className="postCardActions">
                            <div className="actionItem" onClick={() => isLikedByMe ? handleUnLike(post._id) : handleLike(post._id)}>
                                {isLikedByMe ? (
                                    <AiTwotoneHeart className="actionIcon liked" />
                                ) : (
                                    <AiOutlineHeart className="actionIcon" />
                                )}
                                <span className="actionCount">{post.likes.length}</span>
                            </div>

                            <div className="actionItem">
                                <BiCommentDetail className="actionIcon" />
                                <span className="actionCount">{post.comments.length}</span>
                            </div>
                        </div>

                        <div className="postCommentsSection">
                            <div className="commentComposer">
                                <input
                                    type="text"
                                    placeholder="Post your reply..."
                                    value={commentText[post._id] || ''}
                                    onChange={(e) => setCommentText(prev => ({ ...prev, [post._id]: e.target.value }))}
                                    onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
                                />
                                <button
                                    disabled={!(commentText[post._id] && commentText[post._id].trim())}
                                    onClick={() => handleCommentSubmit(post._id)}
                                    className="btn btn-primary btn-sm commentSubmitBtn"
                                >
                                    Reply
                                </button>
                            </div>

                            {post.comments.length > 0 && (
                                <div className="commentsList">
                                    {post.comments.map((comment, index) => (
                                        <div key={index} className="commentItem">
                                            <span className="commentUser">@{comment[0]?.toLowerCase()}</span>
                                            <span className="commentText">{comment[1]}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Post;