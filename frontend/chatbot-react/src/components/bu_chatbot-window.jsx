'use client';
import { useState } from "react"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ChatbotWindow({botName="Chatbot Assistant", initMessage="Hello! How can I assist you today?"}) {
  const [messages, setMessages] = useState([
    { id: 1, content: initMessage, sender: 'bot' }
  ])
  const [input, setInput] = useState("")

  const handleSend = () => {
    if (input.trim()) {
      const newMessage = { id: messages.length + 1, content: input, sender: 'user' }
      setMessages(prevMessages => [...prevMessages, newMessage])
      setInput("")
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = { id: messages.length + 2, content: "Thank you for your message. How else can I help you?", sender: 'bot' }
        setMessages(prevMessages => [...prevMessages, botResponse])
      }, 1000)
    }
  }

  return (
    (<Card className="w-full max-w mx-auto">
      <CardHeader>
        <CardTitle>{botName}</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div
                className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback>{message.sender === 'user' ? 'U' : 'B'}</AvatarFallback>
                  <AvatarImage
                    src={message.sender === 'user' ? "/placeholder.svg?height=32&width=32" : "/placeholder.svg?height=32&width=32"} />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)} />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>)
  );
}