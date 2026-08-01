"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  suggestedQuestions: string[];
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, content: string) => void;
  setStreaming: (isStreaming: boolean) => void;
  clear: () => void;
}

export const DEFAULT_SUGGESTIONS = [
  "Create a beginner workout plan for weight loss",
  "What should I eat before a morning workout?",
  "How do I increase my bench press?",
  "Help me fix my squat form",
  "Design a 7-day meal plan for muscle gain",
  "How much water should I drink daily?",
];

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      messages: [],
      isStreaming: false,
      suggestedQuestions: DEFAULT_SUGGESTIONS,
      addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
      updateMessage: (id, content) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, content, isStreaming: false } : m
          ),
        })),
      setStreaming: (isStreaming) => set({ isStreaming }),
      clear: () => set({ messages: [] }),
    }),
    {
      name: "titan-ai-chat",
    }
  )
);
