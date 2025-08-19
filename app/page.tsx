import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  // Check if user is authenticated
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    // Redirect to login if not authenticated
    redirect('/login');
  } else {
    // Redirect to chat if authenticated
    redirect('/chat');
  }
}

