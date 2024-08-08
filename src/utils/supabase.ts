import { createClient } from "@supabase/supabase-js";

const DB_PROJECT_URL = process.env.NEXT_PUBLIC_DB_PROJECT_URL as string;
const DB_API_KEY = process.env.NEXT_PUBLIC_DB_API_KEY as string;

const supabase = createClient(DB_PROJECT_URL, DB_API_KEY);

export default supabase;
