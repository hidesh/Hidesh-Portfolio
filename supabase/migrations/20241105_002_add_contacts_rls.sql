-- Enable RLS on contacts table
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Policy: Allow authenticated users to read all contacts
CREATE POLICY "Authenticated users can read contacts"
ON contacts
FOR SELECT
TO authenticated
USING (true);

-- Policy: Allow authenticated users to update contacts (for marking as handled)
CREATE POLICY "Authenticated users can update contacts"
ON contacts
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Policy: Allow authenticated users to delete contacts
CREATE POLICY "Authenticated users can delete contacts"
ON contacts
FOR DELETE
TO authenticated
USING (true);

-- Policy: Allow anyone to insert contacts (for contact form submissions)
CREATE POLICY "Anyone can insert contacts"
ON contacts
FOR INSERT
TO anon, authenticated
WITH CHECK (true);
