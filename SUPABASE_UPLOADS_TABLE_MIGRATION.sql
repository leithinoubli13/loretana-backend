-- Create uploads table for tracking customized images with short codes
CREATE TABLE IF NOT EXISTS uploads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(10) UNIQUE NOT NULL,
  session_id VARCHAR(255),
  image_url TEXT NOT NULL,
  original_image_url TEXT,
  shaped_image_url TEXT,
  product_id VARCHAR(255),
  product_name VARCHAR(255),
  product_image_url TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create index on code for fast lookups
CREATE INDEX IF NOT EXISTS uploads_code_idx ON uploads(code);

-- Create index on session_id for queries
CREATE INDEX IF NOT EXISTS uploads_session_id_idx ON uploads(session_id);

-- Create index on created_at for time-based queries
CREATE INDEX IF NOT EXISTS uploads_created_at_idx ON uploads(created_at DESC);

-- Enable Row Level Security
ALTER TABLE uploads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access (for QR scanning)
CREATE POLICY "Allow public read access on uploads"
  ON uploads FOR SELECT
  USING (true);

-- Create policy to allow authenticated inserts
CREATE POLICY "Allow authenticated inserts"
  ON uploads FOR INSERT
  WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_uploads_updated_at BEFORE UPDATE ON uploads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add comment to table
COMMENT ON TABLE uploads IS 'Stores customized image uploads with short codes for QR code mapping';
COMMENT ON COLUMN uploads.code IS 'Short unique code (6-8 chars) for URL: loretana.com/view/{code}';
COMMENT ON COLUMN uploads.session_id IS 'Original session ID from customizer';
COMMENT ON COLUMN uploads.image_url IS 'URL of the customized/shaped image';
COMMENT ON COLUMN uploads.metadata IS 'Additional data like zoom, x, y, shape, etc.';
