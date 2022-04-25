//jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { getMessages, createMessage } from '../api';

export const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = { message: message, userId: user._id };
      createNewMessage(requestBody);
    } catch (error) {
      console.log('Something went wrong while trying to add new post =>', error);
    }
  };

  const createNewMessage = async (message) => {
    await createMessage(message);

    getAllMessages();
    setMessage('');
  };

  const getAllMessages = async () => {
    let response = await getMessages();
    setMessages(response.data);
  };

  useEffect(() => {
    getAllMessages();
  }, []);
  return (
    <div>
      ChatPage
      <div id='messages'>
        {messages &&
          messages.map((oneMessage) => {
            return (
              <div>
                <img src={oneMessage.userId.imageUrl} alt={oneMessage.userId.username} style={{ width: '30px' }} /> <span>{oneMessage.userId.username}</span>
                <p>{oneMessage.message}</p>
              </div>
            );
          })}
      </div>
      <form onSubmit={handleSubmit}>
        <h6>Send Message</h6>
        <img src={user.imageUrl} alt={user.username} style={{ width: '30px' }} /> <span>{user.username}</span>
        <br />
        <textarea id='message' placeholder='Your Message Here' value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
        <br />
        <button type='submit' id='send'>
          Send
        </button>
      </form>
    </div>
  );
};
