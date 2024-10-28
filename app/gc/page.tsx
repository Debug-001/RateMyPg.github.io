"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { db } from "@/context/Firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface Message {
  id?: string;
  userId: string;
  userName: string;
  userPhoto: string;
  text: string;
  timestamp: any;
}

const Chat: React.FC = () => {
  const { user, loading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null); 
  const emojiPickerRef = useRef<HTMLDivElement | null>(null); 

  useEffect(() => {
    const messagesRef = collection(db, "messages");
    const messagesQuery = query(messagesRef, orderBy("timestamp", "asc")); 
    const unsubscribe = onSnapshot(messagesQuery, async (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Message[];
      if (fetchedMessages.length > 100) {
        const excessMessages = fetchedMessages.slice(0, fetchedMessages.length - 100);
        await Promise.all(excessMessages.map((msg) => deleteDoc(doc(db, "messages", msg.id!))));
      }
      setMessages(fetchedMessages.slice(-100));
    });

    return unsubscribe;
  }, []);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user) {
      const messagesRef = collection(db, "messages");
      await addDoc(messagesRef, {
        userId: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        text: newMessage,
        timestamp: new Date(),
      });
      setNewMessage("");
    }
  };

  const onEmojiClick = (emojiObject: EmojiClickData) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
  };

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useEffect(() => {
  //   scrollToBottom(); // Scroll to the bottom when messages update
  // }, [messages]);

  const handleClickOutside = (event: MouseEvent) => {
    if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside); 
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <Navbar />
      <div className="container my-5">
        {loading ? (
          <div className="alert alert-info">Loading...</div>
        ) : user ? (
          <div className="card p-3" style={{ maxHeight: "500px" }}>
            <div className="card-header">
              <h5>Chat Room</h5>
            </div>
            <div
              className="card-body"
              style={{
                height: "400px",
                overflowY: "auto",
              }}
            >
              {messages.map((msg) => (
                <div key={msg.id} className="d-flex mb-3">
                  <img
                    src={msg.userPhoto}
                    alt={msg.userName}
                    className="rounded-circle me-3"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div>
                    <div className="fw-bold">{msg.userName}</div>
                    <div>{msg.text}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="card-footer">
              <div className="d-flex">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage();
                    }
                  }}
                />
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setShowEmojiPicker((prev) => !prev)} 
                >
                  😊
                </button>
                <button
                  className="btn btn-primary ms-2"
                  onClick={handleSendMessage}
                >
                  Send
                </button>
              </div>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef} 
                  style={{
                    position: "absolute",
                    zIndex: 10,
                    bottom: "50px", 
                    right: "0",
                  }}
                >
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="alert alert-warning">
            Please sign in to chat with others.
          </div>
        )}
      </div>

      <Footer />
    </>
  );
};

export default Chat;
