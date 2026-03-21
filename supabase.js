// supabase.js — Supabase client initialization

const SUPABASE_URL      = "https://cfnhtevtdgintewvofhc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNmbmh0ZXZ0ZGdpbnRld3ZvZmhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4ODQzMTIsImV4cCI6MjA4ODQ2MDMxMn0.LEIiCqimSN5EzJ50pYIKfA6Zw6o3p-G_g8l6QRBPV2c";

const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession:     true,
    autoRefreshToken:   true,
    detectSessionInUrl: true,
    lockAcquireTimeout: 10000,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  global: {
    headers: {
      "x-application-name": "fiesta",
    },
  },
});

let currentUser    = null;
let currentProfile = null;