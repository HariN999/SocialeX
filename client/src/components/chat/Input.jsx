import React, { useContext, useState } from 'react'
import { GeneralContext } from '../../context/GeneralContextProvider'
import { v4 as uuid } from 'uuid';
import { BiSend } from 'react-icons/bi';

const Input = () => {
    const { socket, chatData } = useContext(GeneralContext);
    const [text, setText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        const trimmedText = text.trim();
        if (!trimmedText || isSending) return;
        if (!chatData?.chatId || chatData.chatId === 'null') {
            console.error('No active chat selected');
            return;
        }

        try {
            if (!socket.connected) {
                const token = localStorage.getItem('userToken');
                if (token) {
                    socket.auth = { token };
                    socket.connect();
                }
            }

            setIsSending(true);
            const payload = {
                chatId: chatData.chatId,
                id: uuid(),
                text: trimmedText,
                file: '',
                date: new Date()
            };

            socket.timeout(5000).emit('new-message', payload, (err, response) => {
                setIsSending(false);

                if (err || !response?.ok) {
                    console.error('Error sending message:', err || response?.error || 'Message was not accepted');
                    return;
                }

                setText('');
            });
        } catch (err) {
            setIsSending(false);
            console.error('Error sending message:', err);
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        }
    }

    return (
        <div className='input-box-container'>
            <input
                type="text"
                placeholder='Type a message...'
                onChange={e => setText(e.target.value)}
                value={text}
                onKeyDown={handleKeyDown}
            />
            <div className="send-action">
                <button onClick={handleSend} disabled={!text.trim() || isSending} className="send-msg-btn">
                    <span>Send</span>
                    <BiSend />
                </button>
            </div>
        </div>
    )
}

export default Input;
