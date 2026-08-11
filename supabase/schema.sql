-- Character Voice Studio tabloları
-- Mevcut Supabase projesine ekleniyor, prefix (cvs_) ile diğer tablolarla çakışma önleniyor.

create table if not exists cvs_characters (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  personality text not null,
  appearance text not null,
  voice text not null,
  image_url text,
  created_at timestamptz not null default now()
);

create table if not exists cvs_voice_recordings (
  id uuid primary key default gen_random_uuid(),
  character_id uuid not null references cvs_characters(id) on delete cascade,
  text text not null,
  emotion text not null,
  audio_url text,
  created_at timestamptz not null default now()
);

-- RLS: bu proje herkese açık kullanılacaksa (login yok) okuma/yazma serbest bırakılıyor.
-- Diğer tablolarını etkilemez, sadece bu iki tabloya uygulanır.
alter table cvs_characters enable row level security;
alter table cvs_voice_recordings enable row level security;

create policy "public read cvs_characters" on cvs_characters
  for select using (true);
create policy "public insert cvs_characters" on cvs_characters
  for insert with check (true);

create policy "public read cvs_voice_recordings" on cvs_voice_recordings
  for select using (true);
create policy "public insert cvs_voice_recordings" on cvs_voice_recordings
  for insert with check (true);
