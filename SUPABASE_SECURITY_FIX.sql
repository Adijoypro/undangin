-- 1. Enable RLS for all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE guestbook ENABLE ROW LEVEL SECURITY;

-- 2. Clean up existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Public can view published invitations" ON invitations;
DROP POLICY IF EXISTS "Owners can view own invitations" ON invitations;
DROP POLICY IF EXISTS "Owners can insert own invitations" ON invitations;
DROP POLICY IF EXISTS "Owners can update own invitations" ON invitations;
DROP POLICY IF EXISTS "Anyone can view guestbook" ON guestbook;
DROP POLICY IF EXISTS "Anyone can post to guestbook" ON guestbook;
DROP POLICY IF EXISTS "Owners can moderate their guestbook" ON guestbook;

-- 3. Policies for PROFILES
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- 4. Policies for INVITATIONS
CREATE POLICY "Public can view published invitations" ON invitations FOR SELECT USING (status = 'published');
CREATE POLICY "Owners can view own invitations" ON invitations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Owners can insert own invitations" ON invitations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Owners can update own invitations" ON invitations FOR UPDATE USING (auth.uid() = user_id);

-- 5. Policies for GUESTBOOK
CREATE POLICY "Anyone can view guestbook" ON guestbook FOR SELECT USING (true);
CREATE POLICY "Anyone can post to guestbook" ON guestbook FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can moderate their guestbook" ON guestbook FOR ALL USING (
  EXISTS (
    SELECT 1 FROM invitations 
    WHERE invitations.id = guestbook.invitation_id 
    AND invitations.user_id = auth.uid()
  )
);
