
import Chats from './models/Chats.js';
import Post from './models/Post.js'
import Stories from './models/Stories.js';
import User from './models/Users.js'

const toIdString = (id) => String(id);

const SocketHandler = (socket) => {

    const validateChatMembership = async (chatId) => {
        if (!chatId || typeof chatId !== 'string' || !/^[a-fA-F0-9]{48}$/.test(chatId)) {
            socket.emit('error', { message: 'Invalid chat identifier structure' });
            return null;
        }

        try {
            const participantA = chatId.substring(0, 24);
            const participantB = chatId.substring(24);

            if (socket.user.id !== participantA && socket.user.id !== participantB) {
                socket.emit('authorization-error', {
                    message: 'Access denied to this conversation'
                });
                return null;
            }

            let chat = await Chats.findById(chatId);
            if (!chat) {
                const otherUserId = socket.user.id === participantA ? participantB : participantA;
                const otherUser = await User.findById(otherUserId);

                if (!otherUser) {
                    socket.emit('error', { message: 'User not found' });
                    return null;
                }

                chat = await new Chats({ _id: chatId, messages: [] }).save();
            }

            return chat;
        } catch (error) {
            if (error?.code === 11000) {
                const existingChat = await Chats.findById(chatId);
                if (existingChat) return existingChat;
            }
            console.error('validateChatMembership error:', error.message);
            socket.emit('error', { message: 'Server error validating chat access' });
            return null;
        }
    };
  
    socket.on('postLiked', async ({postId}) =>{
        const userId = socket.user.id;
        await Post.updateOne({_id: postId}, {$addToSet: {likes: userId}});

        socket.emit("likeUpdated");
    })

    socket.on('postUnLiked', async ({postId}) =>{
        const userId = socket.user.id;
        await Post.updateOne({_id: postId}, {$pull: {likes: userId}});
        socket.emit("likeUpdated");
    })

    socket.on("fetch-profile", async({_id})=>{
        const user = await User.findOne({_id}).select('-password');
        socket.emit("profile-fetched", {profile: user})
    })

    
    socket.on('updateProfile', async ({profilePic, username, about})=>{
        const userId = socket.user.id;
        const user = await User.updateOne({_id: userId}, {profilePic: profilePic, username: username, about:about})
        socket.emit("profile-fetched", {profile: user})
    })

    socket.on('user-search', async({username})=>{
        const user = await User.findOne({username:username});
        socket.emit('searched-user', {user});
    })

    socket.on('followUser', async({followingUserId})=>{
        const ownId = socket.user.id;
        await User.updateOne({_id: ownId}, {$addToSet: {following: followingUserId}});
        await User.updateOne({_id: followingUserId}, {$addToSet: {followers: ownId}});

        const user1 = await User.findOne({_id: ownId});
        socket.emit('userFollowed', {following: user1.following});

    });

    socket.on('unFollowUser', async({followingUserId})=>{
        const ownId = socket.user.id;
        await User.updateOne({_id: ownId}, {$pull: {following: followingUserId}});
        await User.updateOne({_id: followingUserId}, {$pull: {followers: ownId}});

        const user = await User.findOne({_id: ownId});
        socket.emit('userUnFollowed', {following: user.following});
    });


    socket.on('makeComment', async({postId, comment})=>{
        const user = await User.findById(socket.user.id);
        if (!user) {
            socket.emit('authentication-error', {
                message: 'User account no longer exists'
            });
            return;
        }
        const username = user.username;
        await Post.updateOne({_id: postId}, { $push: { comments: [ username, comment]  } });
    });

    socket.on('fetch-friends', async () =>{
        const userId = toIdString(socket.user.id);
        const escapedId = userId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        const chats = await Chats.find({
            $or: [
                { _id: { $regex: `^${escapedId}` } },
                { _id: { $regex: `${escapedId}$` } }
            ]
        });

        const friendsData = [];

        for (const chat of chats) {
            const participantA = chat._id.substring(0, 24);
            const participantB = chat._id.substring(24);
            const otherUserId = userId === participantA ? participantB : participantA;

            const user = await User.findById(otherUserId, { _id: 1, username: 1, profilePic: 1 });
            if (!user) continue;

            const messages = chat.messages || [];
            const lastMessage = messages[messages.length - 1];

            friendsData.push({
                _id: user._id,
                username: user.username,
                profilePic: user.profilePic,
                lastMessage,
                chatId: chat._id
            });
        }

        friendsData.sort((a, b) => {
            const dateA = a.lastMessage?.date ? new Date(a.lastMessage.date).getTime() : 0;
            const dateB = b.lastMessage?.date ? new Date(b.lastMessage.date).getTime() : 0;
            return dateB - dateA;
        });

        socket.emit("friends-data-fetched", {friendsData});
    })


    socket.on('fetch-messages', async ({chatId}) =>{
        const chat = await validateChatMembership(chatId);
        if (!chat) return;
       
        await socket.join(chatId);

        await socket.emit('messages-updated', {chat: chat});

    }) 

    socket.on('update-messages', async ({ chatId }) => {
        try {
          const chat = await validateChatMembership(chatId);
          if (!chat) return;
          socket.emit('messages-updated', { chat });
        } catch (error) {
          console.error('Error updating messages:', error);
        }
      });
      
      socket.on('new-message', async ({ chatId, id, text, file, date }, ack) => {
        try {
          const chat = await validateChatMembership(chatId);
          if (!chat) {
            if (typeof ack === 'function') ack({ ok: false, error: 'Chat validation failed' });
            return;
          }
          if (!text || typeof text !== 'string' || !text.trim()) {
            if (typeof ack === 'function') ack({ ok: false, error: 'Message text is required' });
            return;
          }
          const senderId = socket.user.id;
          const updatedChat = await Chats.findOneAndUpdate(
            { _id: chatId },
            { $push: { messages: { id, text: text.trim(), file, senderId, date } } },
            { new: true }
          );

          if (!updatedChat) {
            if (typeof ack === 'function') ack({ ok: false, error: 'Chat not found' });
            return;
          }

          socket.emit('messages-updated', { chat: updatedChat });
          socket.broadcast.to(chatId).emit('message-from-user');
          if (typeof ack === 'function') ack({ ok: true });
        } catch (error) {
          console.error('Error adding new message:', error);
          if (typeof ack === 'function') ack({ ok: false, error: 'Server error adding message' });
        }
      });


      socket.on('chat-user-searched', async ({username})=>{
        const query = (username || '').trim();
        if (!query) {
          socket.emit('no-searched-chat-user', { reason: 'empty' });
          return;
        }

        const ownId = socket.user.id;
        const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escaped, 'i');
        const users = await User.find(
          { username: regex, _id: { $ne: ownId } },
          { _id: 1, username: 1, profilePic: 1 }
        ).limit(10);

        if (users.length > 0) {
          socket.emit('searched-chat-users', { users });
        } else {
          socket.emit('no-searched-chat-user', { reason: 'not_found' });
        }
      });


      socket.on('fetch-all-posts', async()=>{
        const posts = await Post.find();
        socket.emit('all-posts-fetched', {posts});
      })


      socket.on('delete-post', async ({postId}) =>{
        if (!postId) {
          socket.emit('error', { message: 'Post ID is required' });
          return;
        }

        try {
          const post = await Post.findById(postId);
          if (!post) {
            socket.emit('error', { message: 'Post not found' });
            return;
          }

          if (post.userId !== socket.user.id) {
            socket.emit('authorization-error', {
              message: 'Unauthorized to delete this post'
            });
            return;
          }

          await Post.deleteOne({_id: postId});
          const posts = await Post.find();
          socket.emit('post-deleted', {posts});
        } catch (error) {
          console.error('Error deleting post:', error);
          socket.emit('error', { message: 'Server error during post deletion' });
        }
      });


      socket.on('create-new-story', async({fileType, file, text})=>{
        const userId = socket.user.id;
        const user = await User.findById(userId);
        if (!user) {
            socket.emit('authentication-error', {
                message: 'User account no longer exists'
            });
            return;
        }
        const username = user.username;
        const userPic = user.profilePic;
        const newStory = new Stories({userId, username, userPic, fileType, file, text});
        await newStory.save();
      })

      socket.on('fetch-stories', async()=>{
        const stories = await Stories.find();
        socket.emit('stories-fetched', {stories});
      });

      socket.on('story-played', async ({storyId})=>{
        const userId = socket.user.id;
        await Stories.updateOne({_id: storyId}, {$addToSet: {viewers: userId}});
        
      })
}

export default SocketHandler;
