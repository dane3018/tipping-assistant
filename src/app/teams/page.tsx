import { createClient } from '@/utils/supabase/server';

export default async function Teams() {
  const supabase = await createClient();
  const { data: instruments } = await supabase.from("teams").select();

  return <pre>{JSON.stringify(instruments, null, 2)}</pre>
}