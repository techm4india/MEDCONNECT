import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Bot, X, Send, Sparkles, Loader2 } from 'lucide-react'

// Static fake AI responses
const FAKE_AI_RESPONSES: Record<string, string[]> = {
  default: [
    "I'm your AI academic assistant! I can help you with medical concepts, study planning, and more. What would you like to know?",
    "I'm here to help you understand medical concepts, create study plans, and provide learning support. Ask me anything!",
  ],
  greeting: [
    "Hello! I'm your AI academic assistant. How can I help you today?",
    "Hi there! Ready to learn? Ask me about any medical topic!",
    "Welcome! I can help explain concepts, create mnemonics, or plan your studies.",
  ],
  anatomy: [
    "The cardiovascular system consists of the heart, blood vessels, and blood. The heart pumps blood through arteries (away from heart) and veins (back to heart). Key components include: atria (receiving chambers), ventricles (pumping chambers), and valves that prevent backflow.",
    "The respiratory system includes the nose, pharynx, larynx, trachea, bronchi, and lungs. It facilitates gas exchange: oxygen enters the bloodstream while carbon dioxide is removed. The diaphragm is the primary muscle for breathing.",
    "The nervous system has two main parts: Central Nervous System (brain and spinal cord) and Peripheral Nervous System (nerves). Neurons transmit signals using electrical and chemical signals.",
  ],
  study: [
    "Here's a study plan for this week:\n\nMonday: Cardiovascular System (2 hours)\nTuesday: Respiratory System (2 hours)\nWednesday: Review & Practice Questions (1.5 hours)\nThursday: Nervous System (2 hours)\nFriday: Clinical Cases (1.5 hours)\n\nRemember to take breaks every 45 minutes!",
    "For effective studying:\n1. Use active recall - test yourself\n2. Spaced repetition - review regularly\n3. Create mind maps for complex topics\n4. Practice with clinical scenarios\n5. Teach concepts to others",
  ],
  mnemonic: [
    "Here's a mnemonic for cranial nerves:\n\n'On Old Olympus Towering Tops, A Finn And German Viewed Some Hops'\n\nOlfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Auditory, Glossopharyngeal, Vagus, Spinal Accessory, Hypoglossal",
    "For the layers of the skin:\n'Come, Let's Get Sun Burned'\n\nCorneum, Lucidum, Granulosum, Spinosum, Basale",
  ],
  concept: [
    "Let me explain the difference:\n\n**Similarities:**\n- Both involve cellular processes\n- Both are essential for body function\n\n**Differences:**\n- One is active, one is passive\n- Energy requirements differ\n- Mechanisms vary significantly",
  ],
  help: [
    "I can help you with:\n\n📚 Medical Concepts - Explain any topic\n📖 Study Planning - Create personalized schedules\n🧠 Mnemonics - Memory aids for difficult topics\n🔍 Concept Comparison - Compare related topics\n📊 Progress Tracking - Monitor your learning\n\nJust ask me anything!",
    "Here's what I can do:\n\n• Explain medical concepts clearly\n• Create study plans tailored to you\n• Generate helpful mnemonics\n• Compare and contrast topics\n• Identify weak areas\n• Provide study tips\n\nWhat would you like help with?",
  ],
  weak: [
    "Based on your progress, I've identified these areas that need attention:\n\n1. Digestive System (65% completion)\n2. Renal System (70% completion)\n\n**Recommendations:**\n• Spend extra time on these modules\n• Use 3D models for better understanding\n• Practice with clinical scenarios\n• Review daily for 30 minutes",
  ],
}

function getAIResponse(query: string): string {
  const lowerQuery = query.toLowerCase()
  
  if (lowerQuery.includes('hello') || lowerQuery.includes('hi') || lowerQuery.includes('hey')) {
    return FAKE_AI_RESPONSES.greeting[Math.floor(Math.random() * FAKE_AI_RESPONSES.greeting.length)]
  }
  
  if (lowerQuery.includes('anatomy') || lowerQuery.includes('cardiovascular') || lowerQuery.includes('respiratory') || lowerQuery.includes('nervous')) {
    return FAKE_AI_RESPONSES.anatomy[Math.floor(Math.random() * FAKE_AI_RESPONSES.anatomy.length)]
  }
  
  if (lowerQuery.includes('study') || lowerQuery.includes('plan') || lowerQuery.includes('schedule')) {
    return FAKE_AI_RESPONSES.study[Math.floor(Math.random() * FAKE_AI_RESPONSES.study.length)]
  }
  
  if (lowerQuery.includes('mnemonic') || lowerQuery.includes('remember') || lowerQuery.includes('memory')) {
    return FAKE_AI_RESPONSES.mnemonic[Math.floor(Math.random() * FAKE_AI_RESPONSES.mnemonic.length)]
  }
  
  if (lowerQuery.includes('compare') || lowerQuery.includes('difference') || lowerQuery.includes('vs')) {
    return FAKE_AI_RESPONSES.concept[0]
  }
  
  if (lowerQuery.includes('help') || lowerQuery.includes('what can you') || lowerQuery.includes('capabilities')) {
    return FAKE_AI_RESPONSES.help[Math.floor(Math.random() * FAKE_AI_RESPONSES.help.length)]
  }
  
  if (lowerQuery.includes('weak') || lowerQuery.includes('improve') || lowerQuery.includes('struggling')) {
    return FAKE_AI_RESPONSES.weak[0]
  }
  
  // Default responses
  const responses = [
    "That's an interesting question! Based on NMC curriculum standards, I'd recommend reviewing the core concepts first, then applying them to clinical scenarios.",
    "Great question! Let me help you understand this. The key points are: 1) Understanding the basic mechanism, 2) Clinical applications, 3) Common variations. Would you like me to elaborate on any specific aspect?",
    "I can help with that! This topic is important for your medical education. The main concepts include understanding the pathophysiology, clinical presentation, and management principles.",
    "Excellent question! This relates to several important medical concepts. I suggest breaking it down into: anatomy, physiology, pathology, and clinical correlation.",
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

export function AIBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI academic assistant. I can help you with medical concepts, study planning, mnemonics, and more. What would you like to know?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    // Simulate AI thinking
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: getAIResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000 + Math.random() * 1000) // 1-2 second delay
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 shadow-2xl">
      <Card className="border-2 h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b pb-3">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Academic Assistant
            </span>
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg px-4 py-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          <div className="border-t p-3 bg-muted/50">
            <p className="text-xs font-medium text-muted-foreground mb-2">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('Explain cardiovascular system')
                  setTimeout(() => handleSend(), 100)
                }}
                className="text-xs"
              >
                Explain Concept
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('Create study plan')
                  setTimeout(() => handleSend(), 100)
                }}
                className="text-xs"
              >
                Study Plan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('Give me a mnemonic')
                  setTimeout(() => handleSend(), 100)
                }}
                className="text-xs"
              >
                Mnemonic
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setInput('What are my weak areas?')
                  setTimeout(() => handleSend(), 100)
                }}
                className="text-xs"
              >
                Weak Areas
              </Button>
            </div>
          </div>

          {/* Input */}
          <div className="border-t p-4">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about medical concepts..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              AI Assistant • Powered by MedConnect
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

