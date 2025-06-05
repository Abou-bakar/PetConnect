import { useState, useEffect } from "react";

export default function Messages() {
  const [conversations, setConversations] = useState([
    {
      id: 1,
      user: "DogLover99",
      lastMessage: "See you tomorrow at the park!",
      unread: 2,
      avatar: "https://via.placeholder.com/40",
      messages: [
        {
          text: "See you tomorrow at the park!",
          sender: "them",
          timestamp: new Date().toISOString(),
        },
      ],
    },
    {
      id: 2,
      user: "CatLady42",
      lastMessage: "Thanks for the treats!",
      unread: 0,
      avatar: "https://via.placeholder.com/40",
      messages: [
        {
          text: "Thanks for the treats!",
          sender: "them",
          timestamp: new Date().toISOString(),
        },
      ],
    },
  ]);

  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState("");

  // Update active conversation when conversations change
  useEffect(() => {
    if (activeConversation) {
      const updatedConv = conversations.find(
        (c) => c.id === activeConversation.id
      );
      setActiveConversation(updatedConv);
    }
  }, [conversations]);

  const handleSendMessage = () => {
    if (newMessage.trim() && activeConversation) {
      const updatedConversations = conversations.map((conv) => {
        if (conv.id === activeConversation.id) {
          const newMsg = {
            text: newMessage.trim(),
            sender: "me",
            timestamp: new Date().toISOString(),
          };
          return {
            ...conv,
            lastMessage: newMsg.text,
            messages: [...conv.messages, newMsg],
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Conversations List */}
      <div className="w-1/3 border-r">
        <div className="p-4 bg-gray-100">
          <h2 className="text-xl font-bold">Messages</h2>
        </div>
        <div className="overflow-y-auto">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => setActiveConversation(conversation)}
              className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b ${
                activeConversation?.id === conversation.id ? "bg-blue-50" : ""
              }`}
            >
              <img
                src={conversation.avatar}
                alt={conversation.user}
                className="w-12 h-12 rounded-full"
              />
              <div className="ml-4 flex-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">{conversation.user}</h3>
                  {conversation.unread > 0 && (
                    <span className="bg-blue-500 text-white rounded-full px-2 py-1 text-xs">
                      {conversation.unread}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 text-sm truncate">
                  {conversation.lastMessage}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeConversation ? (
          <>
            <div className="p-4 border-b flex items-center">
              <img
                src={activeConversation.avatar}
                alt={activeConversation.user}
                className="w-10 h-10 rounded-full"
              />
              <h3 className="ml-4 font-semibold">{activeConversation.user}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {activeConversation.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.sender === "me" ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-xs p-3 rounded-lg ${
                      message.sender === "me"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <div className="flex">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 p-2 border rounded-l-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-colors duration-200 disabled:opacity-50"
                  disabled={!newMessage.trim()}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
         
    </div>
  );
}
