import { useState, useRef } from 'react';
import { Send, Mic, MicOff, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export function ChatAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AgriGenie assistant. Ask me anything about farming, crops, soil health, or market prices. I can also help with crop disease identification!',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Which crop is best for my soil?',
    'Why are my leaves turning yellow?',
    'What fertilizer should I use?',
    'When should I irrigate?',
  ];

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const responses: Record<string, string> = {
        'soil': 'Based on your soil analysis, your soil pH of 6.8 is ideal for most crops. The nitrogen levels are good, but phosphorus is slightly low. I recommend adding bone meal or rock phosphite before planting.',
        'yellow': 'Yellow leaves can indicate several issues: nitrogen deficiency, overwatering, or pest attack. Check your soil moisture and look for any pests on the underside of leaves. If soil is waterlogged, improve drainage.',
        'fertilizer': 'Given your current NPK levels, I recommend a balanced 10-20-10 fertilizer. Apply 50kg per acre before sowing. For better results, add organic compost to improve soil structure.',
        'irrigate': 'Your soil moisture is at 42%. Based on the weather forecast showing no rain for 2 days, I recommend irrigating tomorrow morning. Avoid evening irrigation to prevent fungal diseases.',
      };

      const lowerInput = userMessage.content.toLowerCase();
      let response = 'I can help you with that! Based on your farm data, I\'ll analyze the best approach. Could you provide more details about your specific situation?';
      
      for (const [key, value] of Object.entries(responses)) {
        if (lowerInput.includes(key)) {
          response = value;
          break;
        }
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Would integrate with Web Speech API here
  };

  return (
    <div className="card-agri flex flex-col h-[500px]">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center gap-3">
        <div className="w-10 h-10 rounded-full gradient-hero flex items-center justify-center">
          <Bot className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-foreground">AgriGenie Assistant</h3>
          <p className="text-xs text-muted-foreground">Ask me anything about farming</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              message.role === 'assistant' ? 'gradient-hero' : 'bg-secondary'
            }`}>
              {message.role === 'assistant' ? (
                <Bot className="w-4 h-4 text-primary-foreground" />
              ) : (
                <User className="w-4 h-4 text-secondary-foreground" />
              )}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl ${
              message.role === 'assistant' 
                ? 'bg-muted text-foreground rounded-tl-md' 
                : 'bg-primary text-primary-foreground rounded-tr-md'
            }`}>
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full gradient-hero flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4 text-primary-foreground" />
            </div>
            <div className="bg-muted p-3 rounded-2xl rounded-tl-md">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length < 3 && (
        <div className="px-4 pb-2">
          <p className="text-xs text-muted-foreground mb-2">Try asking:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => setInput(q)}
                className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Button
            variant={isListening ? 'default' : 'ghost'}
            size="icon"
            onClick={toggleListening}
            className={isListening ? 'animate-pulse' : ''}
          >
            {isListening ? (
              <MicOff className="w-5 h-5" />
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </Button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask a farming question..."
            className="flex-1 h-11 px-4 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button onClick={handleSend} disabled={!input.trim() || isLoading}>
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
