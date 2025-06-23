drop policy "Enable insert for authenticated users only" on "public"."games";

alter table "public"."games" enable row level security;

alter table "public"."settings" enable row level security;

create policy "Enable read access for all users"
on "public"."models"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."settings"
as permissive
for select
to public
using (true);



