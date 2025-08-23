const ChatMessage = ({ message }) => {
  return (
    <div className={`flex ${message.user === 'CurrentUser' ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`p-2 rounded-lg ${message.user === 'CurrentUser' ? 'bg-hat-blue text-white' : 'bg-gray-200'}`}>
        <strong>{message.user}: </strong>{message.text}
        <span className="text-xs ml-2">{new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ChatMessage;
