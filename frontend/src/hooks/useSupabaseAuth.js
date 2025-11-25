import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const ALLOWED_TLDS = [
  "com",
  "org",
  "net",
  "edu",
  "gov",
  "io",
  "ai",
  "app",
  "dev",
];

function isEmailDomainAllowed(email) {
  if (!email) return false;

  const trimmed = email.trim().toLowerCase();
  const atIndex = trimmed.lastIndexOf("@");

  if (atIndex === -1 || atIndex === trimmed.length - 1) return false;

  const domain = trimmed.slice(atIndex + 1);
  const parts = domain.split(".");

  if (parts.length < 2) return false;

  const tld = parts[parts.length - 1]; 

  return ALLOWED_TLDS.includes(tld);
}

export function useSupabaseAuth() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function getInitialUser() {
      const { data } = await supabase.auth.getUser();
      if (!mounted) return;
      setUser(data?.user ?? null);
      setAuthLoading(false);
    }

    getInitialUser();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      mounted = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  async function signUp(email, password) {
    if (!isEmailDomainAllowed(email)) {
      throw new Error(
        "Please use an email address from a supported domain (e.g., .com, .org, .net, .edu, .io)."
      );
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) throw error;
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return { user, authLoading, signUp, signIn, signOut };
}
