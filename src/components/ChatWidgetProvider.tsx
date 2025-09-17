'use client';

import { useState } from 'react';
import ChatWidget from './ChatWidget';

interface ChatWidgetProviderProps {
  children: React.ReactNode;
}

export default function ChatWidgetProvider({ children }: ChatWidgetProviderProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      {children}
      <ChatWidget isOpen={isChatOpen} onToggle={toggleChat} />
    </>
  );
}