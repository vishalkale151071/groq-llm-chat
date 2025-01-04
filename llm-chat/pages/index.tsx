import { useState, ChangeEvent, FormEvent } from "react";

// Type definitions for the chat entry and the message response
type ChatEntry = {
  sender: string;
  text: string;
};

export default function Home() {
  const [username, setUsername] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [chat, setChat] = useState<ChatEntry[]>([]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      const newMessage = { sender: username, text: message };
      setChat((prevChat) => [...prevChat, newMessage]);

      // Send the message to the API and get a response
      try {
        const formData = new FormData();
        formData.append("name", username);
        formData.append("query", message);

        const res = await fetch("http://127.0.0.1:8000/generate-query", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (data.success) {
          const apiMessage = data.data;
          setChat((prevChat) => [
            ...prevChat,
            { sender: "Assistant", text: JSON.stringify(apiMessage) },
          ]);
        } else {
          const apiMessage = data.message;
          setChat((prevChat) => [
            ...prevChat,
            { sender: "Assistant", text: apiMessage },
          ]);
        }
      } catch (error) {
        console.error("Error sending message:", error);
        setChat((prevChat) => [
          ...prevChat,
          { sender: "API", text: "Error: Could not connect to the API." },
        ]);
      }

      setMessage("");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setChat([]);
    setMessage("");
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <h1>Enter Your Name</h1>
          <input
            type="text"
            placeholder="Your name"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            required
            style={{
              padding: "0.5rem",
              fontSize: "1rem",
              marginBottom: "1rem",
              width: "100%",
            }}
          />
          <button
            type="submit"
            style={{
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#0070f3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Start Chatting
          </button>
        </form>
      ) : (
        <div>
          <h1>Chat with the API</h1>
          <div
            style={{
              border: "1px solid #ccc",
              padding: "1rem",
              marginBottom: "1rem",
              height: "300px",
              overflowY: "auto",
              backgroundColor: "#f9f9f9",
            }}
          >
            {chat.map((entry, index) => (
              <div key={index} style={{ marginBottom: "1rem" }}>
                <strong>{entry.sender}:</strong> <span>{entry.text}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message"
              value={message}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
              required
              style={{
                padding: "0.5rem",
                fontSize: "1rem",
                marginBottom: "1rem",
                width: "100%",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "1rem",
                backgroundColor: "#0070f3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </form>
          <button
            onClick={handleLogout}
            style={{
              marginTop: "1rem",
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              backgroundColor: "#ff4d4f",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
