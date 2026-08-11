import React, { useContext, useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import RightSidebar from '../components/RightSidebar'
import { AiOutlineHeart, AiTwotoneHeart, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { BiCommentDetail, BiLogOut } from "react-icons/bi";
import { FaGlobeAmericas } from "react-icons/fa";
import { IoIosPersonAdd } from 'react-icons/io';
import { AuthenticationContext } from '../context/AuthenticationContextProvider'
import { GeneralContext } from '../context/GeneralContextProvider'
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import { renderAvatar } from '../utils/avatar';
import '../styles/ProfilePage.css';

const Profile = () => {
    const { logout } = useContext(AuthenticationContext);
    const { socket, dispatch } = useContext(GeneralContext);
    const navigate = useNavigate();

    const { id } = useParams();
    const currentUserId = localStorage.getItem("userId");

    const [userProfile, setUserProfile] = useState({});
    const [updateProfilePic, setUpdateProfilePic] = useState('');
    const [updateProfileUsername, setUpdateProfileUsername] = useState('');
    const [updateProfileAbout, setUpdateProfileAbout] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);

    const [posts, setPosts] = useState([]);
    const [commentText, setCommentText] = useState({});

    useEffect(() => {
        if (!socket) return;
        socket.emit("fetch-profile", { _id: id });
    }, [id, socket]);

    const fetchPosts = async () => {
        try {
            const response = await axios.get('/fetchAllPosts');
            setPosts(response.data || []);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleUpdate = async () => {
        socket.emit('updateProfile', {
            profilePic: updateProfilePic,
            username: updateProfileUsername,
            about: updateProfileAbout
        });
        setIsUpdating(false);
        if (id === currentUserId) {
            localStorage.setItem('profilePic', updateProfilePic);
            localStorage.setItem('username', updateProfileUsername);
        }
        setTimeout(() => {
            window.location.reload();
        }, 150);
    }

    const handleLike = (postId) => {
        socket.emit('postLiked', { postId });
    }

    const handleUnLike = (postId) => {
        socket.emit('postUnLiked', { postId });
    }

    const handleFollow = (userId) => {
        socket.emit('followUser', { followingUserId: userId });
    }

    const handleUnFollow = (userId) => {
        socket.emit('unFollowUser', { followingUserId: userId });
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

        socket.on("profile-fetched", ({ profile }) => {
            if (profile) {
                setUserProfile(profile);
                setUpdateProfilePic(profile.profilePic);
                setUpdateProfileUsername(profile.username);
                setUpdateProfileAbout(profile.about);
            }
        });

        socket.on("likeUpdated", () => {
            fetchPosts();
        });

        socket.on('userFollowed', ({ following }) => {
            localStorage.setItem('following', following);
            fetchPosts();
            socket.emit("fetch-profile", { _id: id });
        });

        socket.on('userUnFollowed', ({ following }) => {
            localStorage.setItem('following', following);
            fetchPosts();
            socket.emit("fetch-profile", { _id: id });
        });

        socket.on('post-deleted', ({ posts: updatedPosts }) => {
            setPosts(updatedPosts || []);
        });

        return () => {
            socket.off("profile-fetched");
            socket.off("likeUpdated");
            socket.off('userFollowed');
            socket.off('userUnFollowed');
            socket.off('post-deleted');
        };
    }, [socket, id]);

    const handleLogoutClick = async () => {
        await logout();
        navigate('/landing');
    };

    const userPosts = posts.filter(post => post.userId === userProfile._id);
    const followingList = (localStorage.getItem('following') || '').split(',');
    const isFollowing = followingList.includes(userProfile._id);

    return (
        <div className='profilePageContainer'>
            <Sidebar />

            <div className="profileMainContent">
                <div className="profileHeader">
                    <h2>{userProfile.username}'s Profile</h2>
                </div>

                {!isUpdating ? (
                    <div className="profileInfoCard">
                        <div className="profileInfoTop">
                            {renderAvatar(userProfile.username, userProfile.profilePic, "profileDetailAvatar")}

                            <div className="profileInfoActions">
                                {userProfile._id === currentUserId ? (
                                    <div className="profileOwnerActions">
                                        <button className="btn btn-outline-secondary btn-sm" onClick={() => setIsUpdating(true)}>
                                            <AiOutlineEdit style={{ marginRight: '4px' }} /> Edit Profile
                                        </button>
                                        <button className="btn btn-outline-danger btn-sm" onClick={handleLogoutClick}>
                                            <BiLogOut style={{ marginRight: '4px' }} /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="profileVisitorActions">
                                        {isFollowing ? (
                                            <button className="btn btn-danger btn-sm" onClick={() => handleUnFollow(userProfile._id)}>Unfollow</button>
                                        ) : (
                                            <button className="btn btn-primary btn-sm" onClick={() => handleFollow(userProfile._id)}>
                                                <IoIosPersonAdd style={{ marginRight: '4px' }} /> Follow
                                            </button>
                                        )}
                                        <button
                                            className="btn btn-outline-primary btn-sm"
                                            onClick={() => {
                                                dispatch({
                                                    type: 'CHANGE_USER',
                                                    payload: {
                                                        _id: userProfile._id,
                                                        username: userProfile.username,
                                                        profilePic: userProfile.profilePic
                                                    }
                                                });
                                                navigate('/chat');
                                            }}
                                        >
                                            Message
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="profileInfoDetails">
                            <h3>{userProfile.username}</h3>
                            <span className="profileDetailHandle">@{userProfile.username?.toLowerCase()}</span>
                            {userProfile.about && <p className="profileDetailAbout">{userProfile.about}</p>}
                        </div>

                        <div className="profileFollowCounts">
                            <div className="followCountItem">
                                <span className="countNumber">{userProfile.following ? userProfile.following.length : 0}</span>
                                <span className="countLabel">Following</span>
                            </div>
                            <div className="followCountItem">
                                <span className="countNumber">{userProfile.followers ? userProfile.followers.length : 0}</span>
                                <span className="countLabel">Followers</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="profileEditCard">
                        <h3>Edit Profile</h3>
                        <div className="mb-3">
                            <label className="form-label">Profile Image URL</label>
                            <input type="text" className="form-control" onChange={(e) => setUpdateProfilePic(e.target.value)} value={updateProfilePic} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Username</label>
                            <input type="text" className="form-control" onChange={(e) => setUpdateProfileUsername(e.target.value)} value={updateProfileUsername} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">About / Bio</label>
                            <textarea className="form-control" rows="3" onChange={(e) => setUpdateProfileAbout(e.target.value)} value={updateProfileAbout}></textarea>
                        </div>
                        <div className="editActions">
                            <button className='btn btn-primary btn-sm' onClick={handleUpdate}>Save</button>
                            <button className='btn btn-outline-secondary btn-sm' onClick={() => setIsUpdating(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="profileTimelineDivider">
                    <h4>Posts</h4>
                </div>

                <div className="profileTimeline">
                    {userPosts.length > 0 ? (
                        userPosts.map((post) => {
                            const isLikedByMe = post.likes.includes(currentUserId);
                            const isMyPost = post.userId === currentUserId;

                            return (
                                <div className="postCard" key={post._id}>
                                    <div className="postCardHeader">
                                        {renderAvatar(post.userName, post.userPic, "postAvatar")}
                                        <div className="postHeaderDetails">
                                            <span className="postAuthorName">{post.userName}</span>
                                            <span className="postAuthorHandle">@{post.userName?.toLowerCase()}</span>
                                            {post.createdAt && (
                                                <span className="postTimestamp">
                                                    · {new Date(post.createdAt).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>

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
                        })
                    ) : (
                        <div className="emptyTimelineState">
                            <p>No posts yet from this user.</p>
                        </div>
                    )}
                </div>
            </div>

            <RightSidebar />
        </div>
    );
};

export default Profile;