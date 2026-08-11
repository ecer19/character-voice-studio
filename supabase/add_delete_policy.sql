create policy "public delete cvs_characters" on cvs_characters
  for delete using (true);

create policy "public delete cvs_voice_recordings" on cvs_voice_recordings
  for delete using (true);

create policy "public delete character voice studio" on storage.objects
  for delete using (bucket_id = 'character voice studio');
