import React, { useState, useRef, useEffect, FormEvent } from "react";

import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Message = {
  id: number;
  text: string;
  sender: "user" | "ai";
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hi, how can I help you today?", sender: "ai" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const simulateAIResponse = (userText: string) => {
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          text: `You said: "${userText}". I am still learning...`,
          sender: "ai",
        },
      ]);
    }, 1000);
  };

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newMessage: Message = {
      id: messages.length + 1,
      text: trimmed,
      sender: "user",
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    simulateAIResponse(trimmed);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === "user";
    const baseStyles =
      "mb-3 p-3 rounded-lg text-sm md:text-base max-w-xs sm:max-w-sm md:max-w-md";
    const userStyles = "self-end bg-blue-600 text-white";
    const aiStyles = "self-start bg-gray-200 text-gray-900";

    return (
      <div key={message.id} className={`${baseStyles} ${isUser ? userStyles : aiStyles}`}>
        {message.text}
      </div>
    );
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="border-b">
          <h2 className="text-xl font-bold">AI Chat</h2>
        </CardHeader>

        <CardContent className="flex flex-col h-80 overflow-y-auto bg-white">
          {messages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </CardContent>

        <CardFooter className="border-t">
          <form className="w-full flex gap-2" onSubmit={handleSend}>
            <Input
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">Send</Button>
          </form>
        </CardFooter>
      </Card>
    </main>
  );
}
