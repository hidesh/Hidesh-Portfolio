-- ============================================
-- Clarity Analytics Storage Schema
-- ============================================
-- Run this SQL in Supabase SQL Editor

-- Table to store Clarity analytics snapshots
CREATE TABLE IF NOT EXISTS clarity_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data JSONB NOT NULL,
  fetched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_clarity_analytics_fetched_at 
ON clarity_analytics(fetched_at DESC);

-- Table to track API usage
CREATE TABLE IF NOT EXISTS clarity_api_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  request_count INTEGER DEFAULT 0,
  last_request_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(date)
);

-- Function to get latest analytics
CREATE OR REPLACE FUNCTION get_latest_clarity_analytics()
RETURNS JSONB AS $$
DECLARE
  latest_data JSONB;
BEGIN
  SELECT data INTO latest_data
  FROM clarity_analytics
  ORDER BY fetched_at DESC
  LIMIT 1;
  
  RETURN latest_data;
END;
$$ LANGUAGE plpgsql;

-- Function to increment API usage
CREATE OR REPLACE FUNCTION increment_api_usage()
RETURNS INTEGER AS $$
DECLARE
  current_count INTEGER;
BEGIN
  INSERT INTO clarity_api_usage (date, request_count, last_request_at)
  VALUES (CURRENT_DATE, 1, NOW())
  ON CONFLICT (date) 
  DO UPDATE SET 
    request_count = clarity_api_usage.request_count + 1,
    last_request_at = NOW()
  RETURNING request_count INTO current_count;
  
  RETURN current_count;
END;
$$ LANGUAGE plpgsql;

-- Function to get today's API usage
CREATE OR REPLACE FUNCTION get_todays_api_usage()
RETURNS TABLE(requests_today INTEGER, requests_remaining INTEGER, last_request TIMESTAMP WITH TIME ZONE) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(request_count, 0)::INTEGER as requests_today,
    GREATEST(10 - COALESCE(request_count, 0), 0)::INTEGER as requests_remaining,
    last_request_at
  FROM clarity_api_usage
  WHERE date = CURRENT_DATE;
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT 0::INTEGER, 10::INTEGER, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Enable Row Level Security (optional - for production)
ALTER TABLE clarity_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE clarity_api_usage ENABLE ROW LEVEL SECURITY;

-- Allow service role to do anything (for API routes)
CREATE POLICY "Service role can do anything on clarity_analytics"
ON clarity_analytics
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

CREATE POLICY "Service role can do anything on clarity_api_usage"
ON clarity_api_usage
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to read (for CMS)
CREATE POLICY "Authenticated users can read clarity_analytics"
ON clarity_analytics
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Authenticated users can read clarity_api_usage"
ON clarity_api_usage
FOR SELECT
TO authenticated
USING (true);
