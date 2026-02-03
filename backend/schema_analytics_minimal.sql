-- Simple analytics counter table (minimal storage)
CREATE TABLE IF NOT EXISTS analytics_counters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    counter_name VARCHAR(50) UNIQUE NOT NULL,
    counter_value BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial counters
INSERT INTO
    analytics_counters (counter_name, counter_value)
VALUES ('total_page_views', 0)
ON CONFLICT (counter_name) DO NOTHING;

-- Active sessions table (for live visitor tracking - auto-cleanup)
CREATE TABLE IF NOT EXISTS active_sessions (
    session_id VARCHAR(100) PRIMARY KEY,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster cleanup
CREATE INDEX IF NOT EXISTS idx_active_sessions_last_seen ON active_sessions (last_seen);