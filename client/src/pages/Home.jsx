import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import Post from '../components/Post';
import CreatePost from '../components/CreatePost';
import axios from '../api/axios';
import '../styles/Home.css';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('/fetchAllPosts');
      setPosts(response.data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='homePageContainer'>
      <Sidebar />

      <div className="homeMainContent">
        <div className="homeHeader">
          <h2>Home</h2>
        </div>

        {/* Inline post composer */}
        <CreatePost onPostCreated={fetchPosts} />

        {isLoading && posts.length === 0 ? (
          <div className="loadingFeedState">
            <p>Loading your feed...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="emptyFeedState">
            <h3>Your feed is quiet</h3>
            <p>Be the first to share something with the SocialeX community.</p>
          </div>
        ) : (
          <Post posts={posts} setPosts={setPosts} fetchPosts={fetchPosts} />
        )}
      </div>

      <RightSidebar />
    </div>
  )
}

export default Home;