-- "character voice studio" bucket'ı için anon key ile yükleme/okuma izni

create policy "public upload character voice studio"
on storage.objects for insert
to public
with check (bucket_id = 'character voice studio');

create policy "public read character voice studio"
on storage.objects for select
to public
using (bucket_id = 'character voice studio');
