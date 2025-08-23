// controllers/chatController.js

const User = require('../models/User');
const axios = require('axios');

// Function 1: Get all chats for a user
exports.getChats = async (req, res) => {
  // --- YOUR LOGIC HERE ---
  // Example:
  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user.chats);
};

// Function 2: Create a new chat
exports.createNewChat = async (req, res) => {
  // --- YOUR LOGIC HERE ---
  // Example:
  const { title } = req.body;
  const user = await User.findById(req.user.userId);
  const newChat = { title, messages: [] };
  user.chats.push(newChat);
  await user.save();
  // Return the last chat added, which is the new one
  res.status(201).json(user.chats[user.chats.length - 1]);
};

// Function 3: Get a specific chat by its ID
exports.getChatById = async (req, res) => {
    // --- YOUR LOGIC HERE ---
    const user = await User.findById(req.user.userId);
    const chat = user.chats.id(req.params.chatId);
    if (!chat) return res.status(404).json({ message: "Chat not found" });
    res.json(chat);
};

// Function 4: Add a message (This is the code you already have)
exports.addMessageToChat = async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ message: "Message is required." });

  const user = await User.findById(req.user.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const chat = user.chats.id(req.params.chatId);
  if (!chat) return res.status(404).json({ message: "Chat not found" });

  chat.messages.push({ sender: "user", text: message, timestamp: new Date() });
  
  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: message }] }] },
      { headers: { "Content-Type": "application/json" } }
    );

    const reply = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    
    chat.messages.push({ sender: "bot", text: reply, timestamp: new Date() });
    await user.save();

    res.json({ reply, chatId: chat._id });
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message || err);
    res.status(500).json({ message: "Error communicating with Gemini API" });
  }
};

// Function 5: chatWithGemini (You might not need this if addMessageToChat handles it)
exports.chatWithGemini = async (req, res) => {
    // --- YOUR LOGIC HERE ---
    // This route might be redundant. If so, you can remove it from chatRoutes.js
    res.json({ message: "This route is not yet implemented." });
};




exports.deleteChat = async (req, res) => {
  try {
    const { userId } = req.user;
    const { chatId } = req.params;

    // Use the atomic $pull operator to remove the chat from the user's chats array
    const result = await User.updateOne(
      { _id: userId }, // Find the correct user
      { $pull: { chats: { _id: chatId } } } // Pull the chat with the matching _id from the chats array
    );

    // The result object contains information about the update operation.
    // If modifiedCount is 0, it means no chat was found with that ID to delete.
    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Chat not found" });
    }

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    res.status(500).json({ message: "Server error while deleting chat" });
  }
};