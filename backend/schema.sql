-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Conversations table for chatbot
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    session_id TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Messages table for chat history
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    conversation_id UUID REFERENCES conversations (id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (
        role IN ('user', 'assistant', 'system')
    ),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    session_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    page_path TEXT,
    section_name TEXT,
    user_agent TEXT,
    ip_address TEXT,
    country TEXT,
    city TEXT,
    referrer TEXT,
    device_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'unread' CHECK (
        status IN ('unread', 'read', 'replied')
    ),
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages (conversation_id);

CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_session_id ON analytics_events (session_id);

CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type);

CREATE INDEX IF NOT EXISTS idx_contact_status ON contact_messages (status);

CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_messages (created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_conversations_updated_at
    BEFORE UPDATE ON conversations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust as needed)
CREATE POLICY "Allow public read access to conversations" ON conversations FOR
SELECT USING (true);

CREATE POLICY "Allow public read access to messages" ON messages FOR
SELECT USING (true);

CREATE POLICY "Allow public read access to analytics" ON analytics_events FOR
SELECT USING (true);

-- Insert policies (service role only for security)
CREATE POLICY "Allow service role to insert conversations" ON conversations FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow service role to insert messages" ON messages FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow service role to insert analytics" ON analytics_events FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow service role to insert contact messages" ON contact_messages FOR INSERT
WITH
    CHECK (true);

CREATE POLICY "Allow service role to update contact messages" ON contact_messages
FOR UPDATE
    USING (true);