/*
  # Create Academic Resources Database Schema

  1. New Tables
    - `academic_resources`
      - `id` (text, part of composite primary key)
      - `user_id` (text, part of composite primary key)
      - `title` (text, required)
      - `authors` (text array)
      - `type` (text)
      - `category` (text)
      - `tags` (text array)
      - `abstract` (text)
      - `published_year` (integer)
      - `publisher` (text)
      - `citations` (integer)
      - `availability` (text)
      - `location` (text)
      - `isbn` (text)
      - `doi` (text)
      - `rating` (double precision)
      - `review_count` (integer)
      - `language` (text)
      - `page_count` (integer)
      - `thumbnail` (text)
      - `related_topics` (text array)
      - `url` (text)
      - `digital_url` (text)
      - `library_system` (jsonb)
      - `full_text_keywords` (text array)
      - `source` (text)
      - `date_added` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `sync_metadata`
      - `user_id` (text, primary key)
      - `last_sync` (timestamptz)
      - `sync_count` (integer)
      - `last_operation` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Allow anonymous users to manage data using device IDs
*/

-- Drop tables if they exist to ensure clean recreation
DROP TABLE IF EXISTS public.academic_resources CASCADE;
DROP TABLE IF EXISTS public.sync_metadata CASCADE;

-- Create academic_resources table with composite primary key
CREATE TABLE public.academic_resources (
    id text NOT NULL,
    user_id text NOT NULL,
    title text NOT NULL,
    authors text[] DEFAULT '{}',
    type text,
    category text,
    tags text[] DEFAULT '{}',
    abstract text DEFAULT '',
    published_year integer,
    publisher text DEFAULT '',
    citations integer DEFAULT 0,
    availability text,
    location text,
    isbn text,
    doi text,
    rating double precision DEFAULT 0,
    review_count integer DEFAULT 0,
    language text DEFAULT 'en',
    page_count integer,
    thumbnail text DEFAULT '',
    related_topics text[] DEFAULT '{}',
    url text,
    digital_url text,
    library_system jsonb,
    full_text_keywords text[] DEFAULT '{}',
    source text DEFAULT 'unknown',
    date_added timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    PRIMARY KEY (id, user_id)
);

-- Create sync_metadata table
CREATE TABLE public.sync_metadata (
    user_id text PRIMARY KEY,
    last_sync timestamptz NOT NULL DEFAULT now(),
    sync_count integer NOT NULL DEFAULT 0,
    last_operation text,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.academic_resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_metadata ENABLE ROW LEVEL SECURITY;

-- Create policies for academic_resources
CREATE POLICY "Users can insert their own resources"
    ON public.academic_resources
    FOR INSERT
    WITH CHECK (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

CREATE POLICY "Users can view their own resources"
    ON public.academic_resources
    FOR SELECT
    USING (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

CREATE POLICY "Users can update their own resources"
    ON public.academic_resources
    FOR UPDATE
    USING (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

CREATE POLICY "Users can delete their own resources"
    ON public.academic_resources
    FOR DELETE
    USING (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

-- Create policies for sync_metadata
CREATE POLICY "Users can insert their own sync metadata"
    ON public.sync_metadata
    FOR INSERT
    WITH CHECK (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

CREATE POLICY "Users can view their own sync metadata"
    ON public.sync_metadata
    FOR SELECT
    USING (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

CREATE POLICY "Users can update their own sync metadata"
    ON public.sync_metadata
    FOR UPDATE
    USING (
        (auth.uid()::text = user_id) OR 
        (auth.uid() IS NULL AND user_id LIKE 'device_%')
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_academic_resources_user_id ON public.academic_resources(user_id);
CREATE INDEX IF NOT EXISTS idx_academic_resources_title ON public.academic_resources(title);
CREATE INDEX IF NOT EXISTS idx_academic_resources_type ON public.academic_resources(type);
CREATE INDEX IF NOT EXISTS idx_academic_resources_category ON public.academic_resources(category);
CREATE INDEX IF NOT EXISTS idx_academic_resources_created_at ON public.academic_resources(created_at);
CREATE INDEX IF NOT EXISTS idx_sync_metadata_user_id ON public.sync_metadata(user_id);