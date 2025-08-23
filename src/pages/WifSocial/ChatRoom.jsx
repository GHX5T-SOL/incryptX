import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import useMockData from '../../hooks/useMockData';
import ChatMessage from '../../components/ChatMessage';
import Input from '../../components/Input';
import Button from '../../components/Button';

const ChatRoom = () => {
  const { id } = useParams();
  const chats = useMockData('mock-chats.json');
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const found = chats.find(c => c.id === id);
    setChat(found);
    setMessages(found?.messages || []);
    const interval = setInterval(() => {
      // Mock new message
      setMessages(m => [...m, { user: 'Bot', text: 'Hello!' }]);
    }, 10000);
    return () => clearInterval(interval);
  }, [id, chats]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    setMessages([...messages, { user: 'CurrentUser', text: newMessage }]);
    setNewMessage('');
  };

  if (!chat) return <div>Loading...</div>;

  return (
    <div className="p-4">
      <h1>{chat.name}</h1>
      <div className="h-96 overflow-y-scroll border p-2 mb-4">
        {messages.map((msg, i) => <ChatMessage key={i} message={msg} />)}
        <div ref={messagesEndRef} />
      </div>
      <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Type message..." />
      <Button onClick={handleSend}>Send</Button>
      <Button>Report</Button>
      <Button>Vote</Button>
    </div>
  );
};

export default ChatRoom;
