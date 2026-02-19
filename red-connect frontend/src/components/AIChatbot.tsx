import { useState, useRef, useEffect } from "react";
import { Heart, X, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import { useNavigate } from "react-router-dom";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const AIChatbot = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Hello! 👋 I am your RED+ blood donation assistant. Ask me anything about eligibility, safety, or the donation process.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await api.chat(text);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: response.answer ?? "I could not understand that question clearly, but I can help with blood donation topics.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const botMessage: Message = {
        id: (Date.now() + 2).toString(),
        type: "bot",
        content:
          "Sorry, I could not reach the support service right now. Please check your internet connection or try again in a moment.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isTyping) return;
    const value = inputValue;
    setInputValue("");
    void sendMessage(value);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickAction = (action: string) => {
    if (isTyping) return;

    if (action === "Find Blood Bank") {
      navigate("/blood-banks");
    } else if (action === "Donate Blood") {
      navigate("/donor-eligibility");
    } else if (action === "Check Eligibility") {
      navigate("/donor-eligibility");
    }

    setInputValue(action);
    void sendMessage(action);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen ? "rotate-0" : ""
        }`}
        style={{
          boxShadow: "0 4px 20px rgba(200, 16, 46, 0.4)",
        }}
        aria-label="Open AI Support Chat"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-25" />
        <span className="absolute inset-0 rounded-full bg-primary/50 animate-pulse" />
        
        {isOpen ? (
          <X className="w-7 h-7 relative z-10" />
        ) : (
          <div className="relative z-10 flex items-center justify-center">
            <Heart className="w-7 h-7 fill-current" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-primary" />
          </div>
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] rounded-2xl bg-card border border-border overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
        style={{
          boxShadow: "0 10px 40px rgba(0, 0, 0, 0.15)",
          maxHeight: "calc(100vh - 150px)",
        }}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">RED+ Support</h3>
            <p className="text-xs text-primary-foreground/80 flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Always here to help
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 rounded-full hover:bg-primary-foreground/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Container */}
        <div className="h-[350px] overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-card shadow-soft border border-border rounded-bl-md"
                }`}
              >
                <p className="text-sm leading-relaxed">{message.content}</p>
                <p
                  className={`text-[10px] mt-1 ${
                    message.type === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-card shadow-soft border border-border rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Actions */}
        <div className="px-4 py-2 bg-card border-t border-border flex gap-2 overflow-x-auto">
          {["Find Blood Bank", "Donate Blood", "Check Eligibility"].map((action) => (
            <button
              key={action}
              onClick={() => handleQuickAction(action)}
              className="flex-shrink-0 px-3 py-1.5 text-xs font-medium bg-secondary text-secondary-foreground rounded-full hover:bg-secondary/80 transition-colors"
            >
              {action}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 h-11 px-4 rounded-full bg-muted border border-border focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
              size="icon"
              className="w-11 h-11 rounded-full bg-primary hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
