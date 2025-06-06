import { useState } from "react";
import "./chatbot.css"; // Assuming you have some CSS for styling
import Header from "./Header";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const formatText = (text) => {
    // Bold text: *text*
    text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    // Italic text: _text_
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");
    // Code text: `text`
    text = text.replace(/`(.*?)`/g, "<code>$1</code>");
    return text;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      setMessages([
        ...messages,
        { sender: "user", text: formatText(input) },
        { sender: "bot", text: formatText(data.reply) },
      ]);
    } catch (err) {
      setMessages([
        ...messages,
        { sender: "user", text: formatText(input) },
        { sender: "bot", text: "Oops! Something went wrong. Try again." },
      ]);
      console.error("Error:", err);
    } finally {
      setInput("");
    }
  };

  return (
    <>
      <Header />
      <center>
        <div className="chat-box">
          <div className="messages">
            {messages.map((msg, index) => (
              <div key={index} className={msg.sender}>
                <strong>{msg.sender}:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
          </div>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      </center>
    </>
  );
};

export default Chatbot;
