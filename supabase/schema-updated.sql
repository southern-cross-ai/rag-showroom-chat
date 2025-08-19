-- Updated Schema for RAG Showroom Chat
-- Drop existing tables if they exist (be careful in production!)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS conversations_v2 CASCADE;

-- Create conversations table
CREATE TABLE conversations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL DEFAULT 'New Conversation',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Create messages table to store UIMessage format
CREATE TABLE messages (
  id TEXT PRIMARY KEY, -- Use text to match AI SDK message IDs
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'data')),
  content JSONB NOT NULL, -- Store the full UIMessage content structure
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  message_index INTEGER NOT NULL -- To maintain message order
);

-- Add indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(user_id, updated_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id, message_index);
CREATE INDEX idx_messages_created_at ON messages(created_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on conversations
CREATE TRIGGER update_conversations_updated_at 
    BEFORE UPDATE ON conversations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
