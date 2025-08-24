import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// --- SVG Icon Components ---
const MenuIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);
const SendIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="22" y1="2" x2="11" y2="13"></line>
    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
  </svg>
);
const PlusIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const LogoutIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);
const CloseIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const GeminiLogo = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3l8 4.5v9l-8 4.5l-8 -4.5v-9l8 -4.5" />
    <path d="M12 12l8 -4.5" />
    <path d="M12 12v9" />
    <path d="M12 12l-8 -4.5" />
    <path d="M16 5.25l-8 4.5" />
  </svg>
);
const TrashIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);
const CopyIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);
const CheckIcon = ({ className }) => (
  <svg
    className={className}
    stroke="currentColor"
    fill="none"
    strokeWidth="2"
    viewBox="0 0 24 24"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

// --- CodeBlock Component ---
const CodeBlock = ({ language, code }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-[#0d1117] rounded-xl overflow-hidden my-2 border border-white/10">
      <div className="flex justify-between items-center px-4 py-2 bg-gray-900/50">
        <p className="text-xs text-gray-400 font-sans">{language}</p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
          {isCopied ? (
            <CheckIcon className="w-4 h-4 text-green-500" />
          ) : (
            <CopyIcon className="w-4 h-4" />
          )}
          {isCopied ? "Copied!" : "Copy code"}
        </button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{ margin: 0, borderRadius: 0 }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

// --- Confirmation Modal ---
const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gray-900 border border-white/20 rounded-xl shadow-lg p-6 w-full max-w-sm"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-gray-400 mb-6">{message}</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-md text-sm font-semibold text-gray-300 bg-white/10 hover:bg-white/20 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 rounded-md text-sm font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors"
            >
              Confirm
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// --- Markdown Renderer (lists + text) ---
const renderMarkdown = (chunk, key) => {
  const lines = chunk.split("\n").filter((line) => line.trim() !== "");
  const listItems = [];
  const normalTexts = [];

  lines.forEach((line, idx) => {
    if (/^(\*|-|\d+\.)\s+/.test(line)) {
      listItems.push(line.replace(/^(\*|-|\d+\.)\s+/, ""));
    } else {
      normalTexts.push(
        <p key={`${key}-${idx}`} className="mb-1">
          {line}
        </p>
      );
    }
  });

  if (listItems.length > 0) {
    return (
      <div key={key} className="my-2">
        <ul className="list-disc list-inside space-y-1">
          {listItems.map((item, i) => (
            <li key={`${key}-li-${i}`} className="text-gray-200">
              {item}
            </li>
          ))}
        </ul>
        {normalTexts}
      </div>
    );
  }

  return normalTexts.length > 0 ? <div key={key}>{normalTexts}</div> : null;
};

// --- Main Home Component ---
export default function Home() {
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isDesktopSidebarOpen, setIsDesktopSidebarOpen] = useState(true);
  const messagesEndRef = useRef(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    onConfirm: () => {},
    title: "",
    message: "",
  });

  const api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  // --- Fetch Chats ---
  useEffect(() => {
    const fetchChats = async () => {
      if (!token) return;
      try {
        const response = await api.get("/chat");
        const fetchedChats = response.data.reverse();
        setChats(fetchedChats);
        if (fetchedChats.length > 0) {
          selectChat(fetchedChats[fetchedChats.length - 1]._id);
        } else {
          handleNewChat();
        }
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    };
    fetchChats();
  }, [token]);

  // --- AutoScroll ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Select Chat ---
  const selectChat = async (chatId) => {
    if (chatId === activeChatId) return;
    setActiveChatId(chatId);
    setIsMobileSidebarOpen(false);
    if (chatId === "new") {
      setMessages([]);
      return;
    }
    try {
      const response = await api.get(`/chat/${chatId}`);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error("Failed to fetch chat messages:", error);
    }
  };

  // --- Send Message ---
  const handleSend = async (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();
    if (!trimmedInput) return;
    const userMessage = { sender: "user", text: trimmedInput };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    try {
      let currentChatId = activeChatId;
      if (activeChatId === "new") {
        const chatResponse = await api.post("/chat/new", { title: trimmedInput });
        const newChat = chatResponse.data;
        setChats((prev) => [...prev, newChat]);
        setActiveChatId(newChat._id);
        currentChatId = newChat._id;
      }
      const messageResponse = await api.post(`/chat/${currentChatId}/message`, {
        message: trimmedInput,
      });
      if (messageResponse.data && messageResponse.data.reply) {
        const botMessage = { sender: "bot", text: messageResponse.data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        throw new Error("Invalid response format from server");
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Sorry, an error occurred. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- New Chat ---
  const handleNewChat = () => {
    setActiveChatId("new");
    setMessages([]);
    setIsMobileSidebarOpen(false);
  };

  // --- Delete Chat ---
  const handleDeleteChat = (chatIdToDelete) => {
    setModalState({
      isOpen: true,
      title: "Delete Chat?",
      message:
        "Are you sure you want to permanently delete this chat and all its messages?",
      onConfirm: async () => {
        try {
          await api.delete(`/chat/${chatIdToDelete}`);
          const updatedChats = chats.filter((c) => c._id !== chatIdToDelete);
          setChats(updatedChats);
          if (activeChatId === chatIdToDelete) {
            if (updatedChats.length > 0) {
              selectChat(updatedChats[updatedChats.length - 1]._id);
            } else {
              handleNewChat();
            }
          }
        } catch (error) {
          console.error("Failed to delete chat:", error);
        } finally {
          setModalState({ isOpen: false, onConfirm: () => {}, title: "", message: "" });
        }
      },
    });
  };

  // --- Logout ---
  const handleLogout = () => {
    setModalState({
      isOpen: true,
      title: "Confirm Logout",
      message: "Are you sure you want to log out?",
      onConfirm: async () => {
        try {
          await api.post("/logout");
        } catch (error) {
          console.error("Server logout failed, logging out client-side anyway.", error);
        } finally {
          logout();
          navigate("/");
          setModalState({ isOpen: false, onConfirm: () => {}, title: "", message: "" });
        }
      },
    });
  };

  // --- Render Message ---
  const renderMessageContent = (text) => {
    const codeBlockRegex = /``````/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(renderMarkdown(text.slice(lastIndex, match.index), lastIndex));
      }
      const language = match[1] || "plaintext";
      const code = match[2];
      parts.push(<CodeBlock key={match.index} language={language} code={code.trim()} />);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push(renderMarkdown(text.slice(lastIndex), lastIndex));
    }

    return parts.length > 0 ? parts : <p>{text}</p>;
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-black/30 backdrop-blur-xl border-r border-white/10">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <GeminiLogo className="w-7 h-7 text-indigo-400" />
          <h2 className="text-xl font-bold text-white tracking-wider">ChatFree</h2>
        </div>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden text-gray-300 hover:text-white"
        >
          <CloseIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-lg bg-indigo-600 text-white border border-indigo-500 shadow-lg hover:bg-indigo-500 transition-all duration-300 font-semibold"
        >
          <PlusIcon className="w-5 h-5" />New Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 space-y-2">
        <p className="text-xs text-gray-400 uppercase font-semibold px-2 pb-2">
          Recent Chats
        </p>
        {activeChatId === "new" && (
          <motion.div
            key="new"
            className="p-3 rounded-lg text-sm font-medium border bg-white/20 border-white/30 text-white shadow-md truncate"
          >
            New Conversation
          </motion.div>
        )}
        {chats.map((chat) => (
          <motion.div
            key={chat._id}
            whileHover={{ scale: 1.02 }}
            className={`group flex items-center justify-between p-3 rounded-lg cursor-pointer text-sm font-medium border truncate transition-all duration-200 ${
              activeChatId === chat._id
                ? "bg-white/20 border-white/30 text-white shadow-md"
                : "bg-transparent border-white/10 text-gray-300 hover:bg-white/10"
            }`}
          >
            <span onClick={() => selectChat(chat._id)} className="flex-1 truncate">
              {chat.title.length > 28
                ? `${chat.title.substring(0, 28)}...`
                : chat.title}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteChat(chat._id);
              }}
              className="ml-2 p-1 text-gray-400 rounded-md opacity-0 group-hover:opacity-100 hover:bg-red-500/20 hover:text-red-500 transition-all"
              title="Delete Chat"
            >
              <TrashIcon className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </div>
      <div className="p-4 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center font-bold text-white">
            {user?.username?.charAt(0).toUpperCase() || "?"}
          </div>
          <div>
            <p className="font-semibold text-sm text-white">
              {user?.username || "User"}
            </p>
            <p className="text-xs text-gray-400">{user?.email || "No email"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 rounded-lg hover:bg-white/10 hover:text-red-500 transition-colors"
          title="Logout"
        >
          <LogoutIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );

  const getChatTitle = () => {
    if (activeChatId === "new") return "New Conversation";
    return chats.find((c) => c._id === activeChatId)?.title || "Welcome!";
  };

  return (
    <div className="flex h-screen w-screen bg-[#050509] text-gray-200 font-sans overflow-hidden">
      <ConfirmationModal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, onConfirm: () => {}, title: "", message: "" })
        }
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
      />
      <AnimatePresence>
        {isDesktopSidebarOpen && (
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden lg:flex lg:w-72 fixed inset-y-0 left-0 z-20"
          >
            <SidebarContent />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/60 z-30 lg:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="fixed inset-y-0 left-0 w-72 z-40 flex flex-col lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <main
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isDesktopSidebarOpen ? "lg:ml-72" : "lg:ml-0"
        }`}
      >
        <header className="flex items-center p-4 border-b border-white/10 bg-[#050509]/50 backdrop-blur-sm sticky top-0 z-10">
          <button
            onClick={() => setIsDesktopSidebarOpen(!isDesktopSidebarOpen)}
            className="hidden lg:block p-2 rounded-md hover:bg-white/10 transition-colors mr-4"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-md hover:bg-white/10 transition-colors mr-4"
          >
            <MenuIcon className="w-6 h-6" />
          </button>
          <h2 className="font-semibold text-white truncate">{getChatTitle()}</h2>
        </header>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={msg._id || i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className={`flex items-start gap-3 ${
                  msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 ${
                    msg.sender === "user" ? "bg-blue-600" : "bg-indigo-600"
                  }`}
                >
                  {msg.sender === "user" ? (
                    user?.username?.charAt(0).toUpperCase() || "U"
                  ) : (
                    <GeminiLogo className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-2xl text-sm shadow-lg border border-white/10 backdrop-blur-xl max-w-lg ${
                    msg.sender === "user"
                      ? "bg-blue-600/80 text-white rounded-br-none"
                      : "bg-black/30 text-gray-200 rounded-bl-none"
                  }`}
                >
                  {renderMessageContent(msg.text)}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 flex-row"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 bg-indigo-600">
                  <GeminiLogo className="w-5 h-5 animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl text-sm shadow-lg border border-white/10 backdrop-blur-xl max-w-lg bg-black/30 text-gray-400 rounded-bl-none">
                  Thinking...
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
        <div className="px-6 pb-6">
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl p-2"
          >
            <input
              type="text"
              placeholder="Message Gemini..."
              className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none px-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              className="p-3 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={!input.trim() || isLoading}
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
