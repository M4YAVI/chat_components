// --- AI Chat Co-Pilot Component ---
import React, { useState, useCallback, useMemo, createContext, useContext, ReactNode, forwardRef, HTMLAttributes } from 'react';
import { Bot, X, RefreshCw, Save, Plus, Settings, Zap, Code, CookingPot, Brain, ChevronDown } from 'lucide-react';

// --- Shadcn-like Primitive Components (Simplified for this environment) ---

// Button Component
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { 
  variant?: 'default' | 'secondary' | 'outline' | 'ghost', 
  size?: 'default' | 'sm' | 'icon' 
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'default', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

    const variantStyles = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      outline: "border border-gray-300 bg-white hover:bg-gray-100 hover:text-gray-900",
      ghost: "hover:bg-gray-100 hover:text-gray-900",
    };

    const sizeStyles = {
      default: "h-10 py-2 px-4",
      sm: "h-9 px-3 rounded-md",
      icon: "h-10 w-10",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

// Badge Component
const Badge = ({ children, variant = 'default', className = '' }: { children: ReactNode, variant?: 'default' | 'secondary', className?: string }) => {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors";
  const variantStyles = {
    default: "bg-blue-600 text-white border-transparent",
    secondary: "bg-gray-100 text-gray-800 border-transparent",
  };
  return <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>{children}</div>;
};

// Input Component
const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

// Switch Component (Simplified)
const Switch = ({ checked, onChange, id }: { checked: boolean, onChange: (checked: boolean) => void, id: string }) => {
  return (
    <button
      role="switch"
      aria-checked={checked}
      id={id}
      onClick={() => onChange(!checked)}
      className={`${checked ? 'bg-blue-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
    >
      <span
        className={`${checked ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm`}
      />
    </button>
  );
};

// Progress Component (Simplified)
const Progress = ({ value, className = '' }: { value: number, className?: string }) => (
  <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
    <div
      className="h-full bg-blue-600 transition-all duration-500"
      style={{ width: `${value}%` }}
    />
  </div>
);

// Avatar Component (Simplified)
const Avatar = ({ children, className = '', onClick }: { children?: ReactNode, className?: string, onClick?: () => void }) => (
  <div onClick={onClick} className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-gray-200 items-center justify-center ${className}`}>
    {children}
  </div>
);

// Tooltip Component (Simplified)
const Tooltip = ({ children, content }: { children: ReactNode, content: string }) => (
    <div className="group relative inline-block">
        {children}
        <div className="absolute bottom-full left-1/2 z-20 mb-2 w-max -translate-x-1/2 transform rounded-md bg-gray-800 px-3 py-1.5 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none shadow-lg">
            {content}
            {/* Arrow */}
            <div className="absolute left-1/2 top-full -translate-x-1/2 border-t-8 border-t-gray-800 border-x-8 border-x-transparent" />
        </div>
    </div>
);


// Accordion Components (Simplified for single collapsible type)
const AccordionContext = createContext<{ activeValue: string | null, setActiveValue: (value: string) => void }>({ activeValue: null, setActiveValue: () => {} });
const AccordionItemContext = createContext<string>('');

const Accordion = ({ children, value, onValueChange, className = '' }: { children: ReactNode, value: string | null, onValueChange: (value: string) => void, className?: string }) => {
  return (
    <div className={`w-full ${className}`}>
      <AccordionContext.Provider value={{ activeValue: value, setActiveValue: onValueChange }}>
        {children}
      </AccordionContext.Provider>
    </div>
  );
};

const AccordionItemWrapper = ({ children, value, className = '' }: { children: ReactNode, value: string, className?: string }) => (
    <AccordionItemContext.Provider value={value}>
        <div className={`border-b ${className}`}>{children}</div>
    </AccordionItemContext.Provider>
);

const AccordionTrigger = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const { activeValue, setActiveValue } = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);
  const isOpen = activeValue === itemValue;

  const handleClick = () => {
    setActiveValue(isOpen ? '' : itemValue);
  };

  return (
    <h3 className='flex'>
        <button
        onClick={handleClick}
        className={`flex flex-1 items-center justify-between py-4 text-base font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className}`}
        aria-expanded={isOpen}
        data-state={isOpen ? 'open' : 'closed'}
        >
        {children}
        <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 ml-2" />
        </button>
    </h3>
  );
};

const AccordionContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const { activeValue } = useContext(AccordionContext);
  const itemValue = useContext(AccordionItemContext);
  const isOpen = activeValue === itemValue;

  // Note: A proper implementation would use height transitions or a library like framer-motion.
  // This uses max-height for a simple transition effect.
  return (
    <div
      data-state={isOpen ? 'open' : 'closed'}
      className={`overflow-hidden text-sm transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'}`}
    >
      <div className={`pb-4 ${className}`}>{children}</div>
    </div>
  );
};


// Sheet Components (Simplified)
const SheetContext = createContext<{ open: boolean, onOpenChange: (open: boolean) => void }>({ open: false, onOpenChange: () => {} });

const Sheet = ({ children, open, onOpenChange }: { children: ReactNode, open: boolean, onOpenChange: (open: boolean) => void }) => (
  <SheetContext.Provider value={{ open, onOpenChange }}>
    {children}
  </SheetContext.Provider>
);

const SheetTrigger = ({ children, asChild = false, onClick }: { children: ReactNode, asChild?: boolean, onClick: () => void }) => {
    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, { onClick });
    }
    return <div onClick={onClick}>{children}</div>;
};

const SheetContent = ({ children, className = '' }: { children: ReactNode, className?: string }) => {
  const { open, onOpenChange } = useContext(SheetContext);

  // Responsive design: Bottom sheet on mobile (sm, md), Right sheet on desktop (lg+)
  // This implements the requirement: side={window.innerWidth < 1024 ? 'bottom' : 'right'}
  const responsiveStyles = `
    fixed inset-x-0 bottom-0 h-[80vh] border-t
    lg:inset-y-0 lg:right-0 lg:h-full lg:w-96 lg:border-l lg:border-t-0
  `;

  const transitionStyles = `
    transition-transform duration-300 ease-in-out
    ${open ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'}
  `;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => onOpenChange(false)}
      />
      
      {/* Panel */}
      <div
        className={`fixed z-50 bg-white shadow-xl ${responsiveStyles} ${transitionStyles} ${className}`}
      >
        {children}
      </div>
    </>
  );
};

// --- End of Primitive Components ---


// --- Types and Mock Data ---

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  tags: string[]; // e.g., ['recipe', 'code', 'general']
}

interface Snippet {
  id: number;
  fullText: string;
  truncatedText: string;
}

interface Persona {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface ChatState {
  history: ChatMessage[];
  snippets: Snippet[];
  currentPersonaId: string;
  autoAdaptTone: boolean;
  isLoading: boolean;
  loadingProgress: number;
}

const PERSONAS: Persona[] = [
  { id: 'default', name: 'Assistant', description: 'Helpful and neutral', icon: Bot, color: 'bg-blue-500' },
  { id: 'coder', name: 'Dev Helper', description: 'Concise, technical answers', icon: Code, color: 'bg-purple-500' },
  { id: 'chef', name: 'Chef', description: 'Creative culinary guidance', icon: CookingPot, color: 'bg-orange-500' },
  { id: 'listener', name: 'Listener', description: 'Empathetic and supportive', icon: Brain, color: 'bg-green-500' },
];

const initialChatState: ChatState = {
  history: [
    { id: 1, text: "How do I make a simple lasagna?", sender: 'user', tags: ['recipe'] },
    { id: 2, text: "First, gather your ingredients: noodles, ricotta, mozzarella, parmesan, ground beef, and marinara sauce. Start by cooking the beef...", sender: 'ai', tags: ['recipe'] },
  ],
  snippets: [
    { id: 101, fullText: "Lasagna ingredients: noodles, ricotta, mozzarella, parmesan, beef, sauce.", truncatedText: "Lasagna ingredients list..." }
  ],
  currentPersonaId: 'chef',
  autoAdaptTone: true,
  isLoading: false,
  loadingProgress: 0,
};

// --- AI Chat Co-Pilot Component ---

const AIChatCoPilot = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Default open section
  const [activeSection, setActiveSection] = useState<string | null>('context'); 
  // Mocking ChatContext state
  const [chatState, setChatState] = useState<ChatState>(initialChatState);

  const currentPersona = useMemo(() => 
    PERSONAS.find(p => p.id === chatState.currentPersonaId) || PERSONAS[0]
  , [chatState.currentPersonaId]);

  // --- Handlers (Mock implementations) ---

  const generateSummary = useCallback((history: ChatMessage[], refresh = false) => {
    if (history.length === 0) return "No summary yet—start chatting!";
    // Mock AI summary generation based on tags
    if (history.some(m => m.tags.includes('recipe'))) {
        return "Discussing lasagna recipe steps and ingredients.";
    }
    if (history.some(m => m.tags.includes('code'))) {
        return "Reviewing React component structure.";
    }
    return "General conversation about daily tasks.";
  }, []);

  const addSnippet = useCallback((message: ChatMessage | undefined) => {
    if (!message) return;
    const newSnippet: Snippet = {
      id: Date.now(),
      fullText: message.text,
      truncatedText: message.text.substring(0, 30) + (message.text.length > 30 ? '...' : ''),
    };
    setChatState(prev => ({
      ...prev,
      snippets: [...prev.snippets, newSnippet],
    }));
  }, []);

  const deleteSnippet = useCallback((id: number) => {
    setChatState(prev => ({
        ...prev,
        snippets: prev.snippets.filter(s => s.id !== id),
    }));
  }, []);

  const updatePersona = useCallback((id: string) => {
    setChatState(prev => ({
      ...prev,
      currentPersonaId: id,
    }));
  }, []);

  const toggleAutoAdapt = useCallback((checked: boolean) => {
    setChatState(prev => ({
        ...prev,
        autoAdaptTone: checked,
    }));
  }, []);

  // Simulate an action that involves loading
  const handleMockAction = (actionName: string) => {
    if (chatState.isLoading) return;
    console.log(`Executing action: ${actionName}`);
    setChatState(prev => ({ ...prev, isLoading: true, loadingProgress: 0 }));
    
    // Simulate progress
    const interval = setInterval(() => {
        setChatState(prev => {
            const newProgress = prev.loadingProgress + 20;
            if (newProgress >= 100) {
                clearInterval(interval);
                return { ...prev, isLoading: false, loadingProgress: 100 };
            }
            return { ...prev, loadingProgress: newProgress };
        });
    }, 500);

    // Ensure the actions section is open to see the progress bar
    setActiveSection('actions');
  };

  const summary = useMemo(() => generateSummary(chatState.history), [chatState.history, generateSummary]);
  const lastMessage = chatState.history[chatState.history.length - 1];

  // Determine context-aware actions based on the last message
  const quickActions = useMemo(() => {
    if (!lastMessage) return [];
    if (lastMessage.tags.includes('recipe')) {
        return [
            { value: 'regenerate-ingredients', label: 'List Ingredients' },
            { value: 'scale-servings', label: 'Scale Servings (2→4)' },
            { value: 'save-recipe', label: 'Save Recipe' },
        ];
    }
    if (lastMessage.tags.includes('code')) {
        return [
            { value: 'explain-code', label: 'Explain Code' },
            { value: 'fix-bugs', label: 'Fix Bugs' },
            { value: 'copy-code', label: 'Copy' },
        ];
    }
    return [
        { value: 'elaborate', label: 'Elaborate' },
        { value: 'simplify', label: 'Simplify' },
    ];
  }, [lastMessage]);

  // --- Rendering ---

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Trigger Button (Sticky, Floating) */}
      <SheetTrigger asChild onClick={() => setIsOpen(true)}>
        <Button
          variant="default"
          size="icon"
          // Fixed position, high z-index, rounded full for FAB look
          className="fixed bottom-8 right-8 z-30 shadow-xl rounded-full h-14 w-14 hover:bg-blue-700 transition-transform hover:scale-105"
          aria-label="Open AI Co-Pilot"
        >
          {/* Using Bot icon for AI Co-Pilot */}
          <Bot className="h-6 w-6" />
        </Button>
      </SheetTrigger>

      {/* Co-Pilot Panel (Responsive Sheet) */}
      {/* SheetContent handles responsiveness (bottom on mobile, right on lg+) */}
      <SheetContent className="w-full flex flex-col p-0 overflow-y-auto">
        
        {/* Panel Header (Sticky) */}
        <div className="flex justify-between items-center p-6 pb-4 border-b sticky top-0 bg-white z-10 shadow-sm">
          <h3 className="font-semibold text-xl text-gray-900 flex items-center">
            <Zap className='w-5 h-5 text-blue-600 mr-3'/> AI Co-Pilot
          </h3>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close panel" className='text-gray-500 hover:text-gray-800'>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Accordion for Progressive Disclosure */}
        <Accordion
          value={activeSection}
          onValueChange={setActiveSection}
          className="flex-grow px-6"
        >
          {/* ------------------------------ */}
          {/* Section 1: Context Snippet Manager */}
          {/* ------------------------------ */}
          <AccordionItemWrapper value="context">
            <AccordionTrigger className="text-gray-800 hover:text-blue-600">
              <div className='flex items-center gap-3'>
                <Settings className='w-4 h-4 opacity-70'/>
                <span>Chat Context</span>
              </div>
              {chatState.snippets.length > 0 && (
                <Badge variant="secondary" className="text-xs mr-2">
                  {chatState.snippets.length}
                </Badge>
              )}
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              
              {/* AI-Generated Summary */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Key Takeaway (AI Summary)</label>
                <div className="text-sm p-4 rounded-lg bg-blue-50 border border-blue-200 text-gray-700 italic">
                    {summary}
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => {
                    // Mock refresh
                    alert("Refreshing summary (mock action)...");
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Refresh Summary
                </Button>
              </div>

              {/* Saved Snippets (User-Curated) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Saved Snippets</label>
                <div className="max-h-40 overflow-y-auto space-y-2 pr-2">
                  {chatState.snippets.map((snippet) => (
                    <Tooltip key={snippet.id} content={snippet.fullText}>
                      <div className="flex justify-between items-center bg-gray-100 p-3 rounded-lg text-sm hover:bg-gray-200 transition-colors">
                        <span className='text-gray-800 truncate flex-1 mr-2'>{snippet.truncatedText}</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => deleteSnippet(snippet.id)}
                          aria-label={`Delete snippet`}
                          className='h-6 w-6 text-gray-500 hover:text-red-500 hover:bg-transparent'
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </Tooltip>
                  ))}
                  {chatState.snippets.length === 0 && (
                    <p className="text-sm text-gray-500 p-3 bg-gray-50 rounded-lg italic">No saved snippets yet.</p>
                  )}
                </div>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => addSnippet(lastMessage)}
                  disabled={!chatState.history.length}
                >
                  <Save className="h-4 w-4 mr-2" /> Save Last Message
                </Button>
              </div>
            </AccordionContent>
          </AccordionItemWrapper>

          {/* ------------------------------ */}
          {/* Section 2: Smart Action Bar (Context-Aware) */}
          {/* ------------------------------ */}
          <AccordionItemWrapper value="actions">
            <AccordionTrigger className="text-gray-800 hover:text-blue-600">
                <div className='flex items-center gap-3'>
                    <Zap className='w-4 h-4 opacity-70'/>
                    <span>Quick Actions</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              
              {/* Context-Aware Actions (Using buttons instead of a complex Select implementation) */}
              <div className='space-y-3'>
                <label className="text-sm font-medium text-gray-700 block">Suggested Next Steps</label>
                <div className='flex flex-wrap gap-2'>
                    {quickActions.length > 0 ? (
                        quickActions.map(action => (
                            <Button key={action.value} variant="outline" size="sm" onClick={() => handleMockAction(action.label)} disabled={chatState.isLoading}>
                                {action.label}
                            </Button>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 italic">No actions available—start chatting!</p>
                    )}
                </div>
              </div>

              {/* Frequently Used Buttons */}
              <div className="space-y-3">
              <label className="text-sm font-medium text-gray-700 block">Standard Actions</label>
              <div className="flex flex-wrap w-full justify-start gap-3">
                <Button 
                  variant="default" 
                  onClick={() => handleMockAction("Regenerate")}
                  disabled={!chatState.history.length || chatState.isLoading}
                >
                  Regenerate
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleMockAction("Edit Prompt")}
                  disabled={!chatState.history.length || chatState.isLoading}
                >
                  Edit Prompt
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => alert("Share chat (mock action)")}
                  disabled={!chatState.history.length}
                >
                  Share
                </Button>
              </div>
              </div>

              {/* Progress Bar (For Loading States) */}
              {chatState.isLoading && (
                <div className="space-y-2 pt-4">
                  <Progress value={chatState.loadingProgress} className="h-2" />
                  <p className="text-sm text-gray-500 text-center">Generating response… {chatState.loadingProgress}%</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItemWrapper>

          {/* ------------------------------ */}
          {/* Section 3: Persona Switcher */}
          {/* ------------------------------ */}
          <AccordionItemWrapper value="personas">
            <AccordionTrigger className="text-gray-800 hover:text-blue-600">
              <div className="flex items-center gap-3">
                <Avatar className={`h-6 w-6 ${currentPersona.color} text-white`}>
                    {React.createElement(currentPersona.icon, {className: "h-4 w-4"})}
                </Avatar>
                <span>Persona ({currentPersona.name})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-6 pt-2">
              
              {/* Saved Personas (Avatar Grid) */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Switch Persona</label>
                <div className="flex flex-wrap gap-4">
                  {PERSONAS.map((persona) => {
                    const isActive = persona.id === currentPersona.id;
                    return (
                      <Tooltip 
                        key={persona.id} 
                        content={`${persona.name}: ${persona.description}`}
                      >
                        <Avatar
                          onClick={() => updatePersona(persona.id)}
                          className={`h-12 w-12 cursor-pointer transition-all ${persona.color} text-white ${
                            isActive ? 'ring-4 ring-blue-600 ring-offset-2' : 'hover:opacity-80'
                          }`}
                          aria-label={`Switch to ${persona.name} persona`}
                        >
                            {React.createElement(persona.icon, {className: "h-6 w-6"})}
                        </Avatar>
                      </Tooltip>
                    );
                  })}
                  {/* Add New Persona Button */}
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => alert("Open persona creation modal (mock action)")}
                    aria-label="Add new persona"
                    className='h-12 w-12 border-2 border-dashed border-gray-300 text-gray-500 hover:bg-gray-100'
                  >
                    <Plus className='h-6 w-6'/>
                  </Button>
                </div>
              </div>

              {/* Auto-Adapt Tone Toggle */}
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                <div className='flex flex-col'>
                    <label htmlFor="auto-adapt-tone" className="text-sm font-medium text-gray-800 cursor-pointer">Auto-Adapt Tone</label>
                    <span className="text-xs text-gray-500">AI adjusts tone based on context</span>
                </div>
                <Switch 
                  id="auto-adapt-tone" 
                  checked={chatState.autoAdaptTone} 
                  onChange={toggleAutoAdapt}
                  aria-label="Auto-adapt AI tone to chat context"
                />
              </div>
            </AccordionContent>
          </AccordionItemWrapper>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
};

// Main App Component (Wrapper to display the Co-Pilot and a mock chat interface)
const MockChatInterface = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-4 lg:p-8">
            <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">
                <header className='p-6 border-b'>
                    <h1 className="text-2xl font-bold text-gray-800">AI Chat Application</h1>
                </header>
                
                {/* Mock Chat History */}
                <div className="space-y-4 h-96 overflow-y-auto p-6 bg-gray-50">
                    
                    <div className="flex justify-end">
                        <div className="bg-blue-600 text-white p-3 rounded-lg max-w-xs shadow-md rounded-br-sm">
                            How do I make a simple lasagna?
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-white text-gray-800 p-3 rounded-lg max-w-md shadow-md border rounded-bl-sm">
                            First, gather your ingredients: noodles, ricotta, mozzarella, parmesan, ground beef, and marinara sauce. Start by cooking the beef...
                        </div>
                    </div>
                    <div className='text-center text-sm text-gray-500 pt-10'>
                        (Use the Co-Pilot <Bot className='inline w-4 h-4'/> button on the bottom right to manage context, actions, or personas)
                    </div>
                </div>

                {/* Mock Input Area */}
                <div className="p-6 border-t flex items-center bg-white">
                    <Input placeholder="Type your message..." className="flex-1 mr-4"/>
                    <Button>Send</Button>
                </div>
            </div>
            
            {/* The Co-Pilot Component */}
            <AIChatCoPilot />
        </div>
    );
}

export default MockChatInterface;
