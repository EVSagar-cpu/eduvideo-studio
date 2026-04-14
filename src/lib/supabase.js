import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'

export const supabase = (!demoMode && supabaseUrl && supabaseKey)
  ? createClient(supabaseUrl, supabaseKey)
  : null

export const isDemoMode = demoMode || !supabaseUrl || !supabaseKey

// ─── Video CRUD ───────────────────────────────────────────────
export async function getVideos() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function upsertVideo(video) {
  if (!supabase) return video
  const { data, error } = await supabase
    .from('videos')
    .upsert(video)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateVideoStatus(id, updates) {
  if (!supabase) return updates
  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

/* ── Supabase Schema (run in SQL editor) ──────────────────────

create table videos (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  subject text,
  grade int,
  school text,
  raw_path text,
  transcript_path text,
  duration int,
  resolution text,
  audio_snr numeric,
  quality_score int default 0,
  route text default 'pending' check (route in ('enhance','recreate','review','pending')),
  status text default 'pending' check (status in ('pending','processing','done','failed','review')),
  clean_transcript text,
  scenes jsonb default '[]',
  output_path text,
  final_duration int,
  created_at timestamptz default now(),
  processed_at timestamptz
);

alter table videos enable row level security;
create policy "Allow all" on videos for all using (true);

──────────────────────────────────────────────────────────────── */
