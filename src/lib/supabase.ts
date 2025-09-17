import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Check if environment variables are properly set
if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
  console.warn('⚠️ Supabase environment variables not found. Please create a .env.local file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// export default supabase
// Authentication functions
export const signUpWithEmail = async (email: string, password: string, metadata?: any) => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: metadata
    }
  });
};

export const signInWithEmail = async (email: string, password: string) => {
  return await supabase.auth.signInWithPassword({
    email,
    password
  });
};

export const signOut = async () => {
  return await supabase.auth.signOut();
};

export const resetPassword = async (email: string) => {
  return await supabase.auth.resetPasswordForEmail(email);
};

// Project submission functions
export const submitProject = async (projectData: any, userId: string) => {
  return await supabase
    .from('projects')
    .insert([
      { 
        ...projectData,
        user_id: userId,
        created_at: new Date().toISOString()
      }
    ]);
};

export const getProjectsByUser = async (userId: string) => {
  return await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);
};

export const getProjectById = async (projectId: string) => {
  return await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();
};

// Event functions
export const getEvents = async () => {
  return await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true });
};

export const getEventById = async (eventId: string) => {
  return await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
};

export const registerForEvent = async (eventId: string, userId: string, teamInfo?: any) => {
  return await supabase
    .from('event_registrations')
    .insert([{
      event_id: eventId,
      user_id: userId,
      team_info: teamInfo,
      registered_at: new Date().toISOString()
    }]);
};

export const getRegisteredEvents = async (userId: string) => {
  return await supabase
    .from('event_registrations')
    .select(`
      *,
      events:event_id(*)
    `)
    .eq('user_id', userId);
};

export const addEventToCalendar = async (userId: string, eventId: string) => {
  return await supabase
    .from('user_calendars')
    .insert([{
      user_id: userId,
      event_id: eventId,
      added_at: new Date().toISOString()
    }]);
};

export const removeEventFromCalendar = async (userId: string, eventId: string) => {
  return await supabase
    .from('user_calendars')
    .delete()
    .match({ user_id: userId, event_id: eventId });
};

export const getUserCalendarEvents = async (userId: string) => {
  return await supabase
    .from('user_calendars')
    .select(`
      *,
      events:event_id(*)
    `)
    .eq('user_id', userId);
};