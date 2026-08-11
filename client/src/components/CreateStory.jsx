import React, { useContext } from 'react';
import '../styles/CreatePosts.css'
import { GeneralContext } from '../context/GeneralContextProvider';
import { RxCross2 } from 'react-icons/rx';

const CreateStory = () => {
    const { isCreateStoryOpen, setIsCreateStoryOpen } = useContext(GeneralContext);

    return (
        <div className="createPostModalBg" style={isCreateStoryOpen ? { display: 'contents' } : { display: 'none' }}>
            <div className="createPostContainer">
                <RxCross2 className='closeCreatePost' onClick={() => setIsCreateStoryOpen(false)} />
                <h2 className="createPostTitle">Create Story</h2>
                <hr className="createPostHr" />
                <div className="createPostBody">
                    <p style={{ textAlign: 'center', color: '#657786' }}>
                        {/* TODO: Phase 3 — restore media uploads and Stories */}
                        Stories feature is temporarily disabled.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CreateStory;