-- Create waitlist_submissions table
CREATE TABLE public.waitlist_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  country TEXT NOT NULL,
  describes TEXT NOT NULL,
  protection TEXT NOT NULL,
  phishing_experience TEXT NOT NULL,
  interest TEXT NOT NULL,
  subscription TEXT NOT NULL,
  features TEXT[] NOT NULL,
  join_waitlist TEXT NOT NULL,
  consent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waitlist_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (public waitlist form)
CREATE POLICY "Anyone can submit to waitlist"
  ON public.waitlist_submissions
  FOR INSERT
  WITH CHECK (true);