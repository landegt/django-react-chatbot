"use client";
import { useState, useEffect } from "react";
import { Send } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Recommendations() {
  const botName = "Chatbot Assistant";
  const initMessages = [
    { id: 1, content: "Hello! How can I assist you today?", sender: "bot" },
  ];
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    try {
      const response = await fetch("http://localhost:8000/reset-session/", {
        method: "POST",
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setMessages(initMessages);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: prevMessages.length + 1,
          content: "Sorry, there was an error processing your request.",
          sender: "bot",
        },
      ]);
    }
  };

  useEffect(() => {
    // Reset on initial load
    handleReset();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage = {
        id: messages.length + 1,
        content: input,
        sender: "user",
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInput("");
      setIsLoading(true);

      try {
        const response = await fetch("http://localhost:8000/chatbot/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_input: input }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        const botResponse = {
          id: messages.length + 2,
          content: data.response,
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, botResponse]);
      } catch (error) {
        console.error("Error:", error);
        const errorMessage = {
          id: messages.length + 2,
          content: "Sorry, there was an error processing your request.",
          sender: "bot",
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full flex-col justify-center mb-5">
      <Card className="w-full max-w mx-auto">
        <CardHeader>
          <CardTitle>{botName}</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                <div
                  className={`flex items-start ${
                    message.sender === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback>
                      {message.sender === "user" ? "U" : "B"}
                    </AvatarFallback>
                    <AvatarImage
                      src={
                        message.sender === "user"
                          ? "/placeholder.svg?height=32&width=32"
                          : "/placeholder.svg?height=32&width=32"
                      }
                    />
                  </Avatar>
                  <div
                    className={`mx-2 p-3 rounded-lg ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
        <CardFooter>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex w-full items-center space-x-2"
          >
            <Input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <Button type="submit" size="icon" disabled={isLoading}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
      <Button className="mt-2" onClick={handleReset}>
        Reset Chat
      </Button>
    </div>
  );
}
