import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Bot, User } from "lucide-react";
import { getCookie } from "../utils/cookie";

interface Message {
  id: number;
  text: string;
  sender: "user" | "ai";
}

const StylistAI = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Olá! Sou sua IA de estilo. Vi que você tem roupas incríveis no armário. Para qual ocasião você precisa de um look hoje?",
      sender: "ai",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para a última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    // 1. Adiciona mensagem do usuário
    const userMsg: Message = { id: Date.now(), text: input, sender: "user" };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      // 2. Chama o Backend
      const response = await fetch("/api/stylist/chat/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCookie("csrftoken") || "",
        },
        body: JSON.stringify({ message: userMsg.text }),
      });

      const data = await response.json();

      // 3. Adiciona resposta da IA
      const aiMsg: Message = {
        id: Date.now() + 1,
        text: data.reply,
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: Date.now() + 1,
        text: "Erro ao conectar com o estilista.",
        sender: "ai",
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] max-w-4xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
      {/* Header */}
      <div className="bg-slate-900 p-6 flex items-center gap-3 shadow-md z-10">
        <div className="p-2 bg-purple-500 rounded-full">
          <Sparkles className="text-white" size={24} />
        </div>
        <div>
          <h2 className="text-white font-bold text-lg">Personal Stylist AI</h2>
          <p className="text-purple-200 text-xs">
            Conectado ao seu Guarda-Roupa
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 custom-scrollbar">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-4 ${
              msg.sender === "user" ? "flex-row-reverse" : ""
            }`}
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                msg.sender === "user" ? "bg-slate-200" : "bg-purple-100"
              }`}
            >
              {msg.sender === "user" ? (
                <User size={20} className="text-slate-600" />
              ) : (
                <Bot size={20} className="text-purple-600" />
              )}
            </div>

            <div
              className={`p-4 rounded-2xl max-w-[80%] text-sm leading-relaxed shadow-sm ${
                msg.sender === "user"
                  ? "bg-slate-800 text-white rounded-tr-none"
                  : "bg-white text-slate-700 border border-slate-200 rounded-tl-none"
              }`}
            >
              {/* Renderiza quebras de linha */}
              {msg.text.split("\n").map((line, i) => (
                <p key={i} className="min-h-[10px]">
                  {line}
                </p>
              ))}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
              <Bot size={20} className="text-purple-600" />
            </div>
            <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-200 flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2 max-w-3xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ex: Tenho um casamento de dia, o que usar?"
            className="flex-1 bg-slate-100 border-0 rounded-xl px-5 py-4 text-slate-700 focus:ring-2 focus:ring-purple-500 outline-none transition-all"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-200"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StylistAI;
