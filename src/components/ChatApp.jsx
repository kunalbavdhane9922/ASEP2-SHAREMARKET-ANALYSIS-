import { useState } from "react";
import Navbar from "./Navbar";
const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const formatText = (text) => {
    text = text.replace(/\*(.*?)\*/g, "<strong>$1</strong>");
    text = text.replace(/_(.*?)_/g, "<em>$1</em>");
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
        { sender: "bot", text: "⚠️ Something went wrong. Try again." },
      ]);
      console.error("Error:", err);
    } finally {
      setInput("");
    }
  };

  return (
    <>
    <Navbar></Navbar>
      <div
        style={{
          ...styles.container,
          textAlign: "center",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        <div style={styles.chatBox}>
          <div style={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  ...styles.msgText,
                  ...styles[msg.sender],
                  borderRadius: "15px",
                  padding: "10px",
                  marginBottom: "10px",
                }}
              >
                <strong>{msg.sender}:</strong>{" "}
                <span dangerouslySetInnerHTML={{ __html: msg.text }} />
              </div>
            ))}
          </div>
          <div style={styles.inputContainer}>
            <input
              style={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask for stock insights..."
            />
            <button style={styles.button} onClick={sendMessage}>
              Predict 📈
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f7fa",
    padding: "20px",
  },
  chatBox: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#ffffff",
    borderRadius: "15px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    height: "80vh",
  },
  messages: {
    flex: 1,
    overflowY: "auto",
    marginBottom: "20px",
    padding: "10px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "inset 0 0 5px rgba(0, 0, 0, 0.1)",
    maxHeight: "calc(80% - 20px)",
  },
  msgText: {
    fontSize: "14px",
    color: "#333",
    marginBottom: "10px",
    lineHeight: "1.5",
  },
  user: {
    backgroundColor: "#c8e6c9",
    color: "#388e3c",
    alignSelf: "flex-end",
  },
  bot: {
    backgroundColor: "#e3f2fd",
    color: "#1e88e5",
    alignSelf: "flex-start",
  },
  inputContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  input: {
    width: "80%",
    padding: "12px",
    borderRadius: "30px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "16px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  button: {
    backgroundColor: "#4caf50",
    color: "#ffffff",
    border: "none",
    padding: "12px 20px",
    fontSize: "16px",
    borderRadius: "30px",
    cursor: "pointer",
    transition: "background-color 0.3s",
    fontWeight: "bold",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  buttonHover: {
    backgroundColor: "#388e3c",
  },
};

export default ChatApp;
    