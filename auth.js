async function initAuth() {
  try {
    // Check if session already exists
    const { data: { session } } = await db.auth.getSession();

    if (session) {
      currentUser    = session.user;
      currentProfile = await loadProfile(session.user.id);
      window.currentProfile = currentProfile;
      updateNavForUser(currentProfile);
      return;
    }

    // No session — sign in
    await signInAnonymously();

  } catch (err) {
    console.warn("Auth init error:", err.message);
  }
}

// ─── ANONYMOUS SIGN IN WITH GUEST FALLBACK ─────

async function signInAnonymously() {
  try {
    // First try proper anonymous sign-in
    const { data, error } = await db.auth.signInAnonymously();

    if (!error && data?.user) {
      currentUser = data.user;
      const autoUsername = "reader_" + data.user.id.slice(0, 4);
      currentProfile = await createProfile(data.user.id, autoUsername);
      window.currentProfile = currentProfile;
      updateNavForUser(currentProfile);
      return data.user;
    }

    console.warn("Anonymous sign-in failed:", JSON.stringify(error, null, 2));
    console.warn("Trying guest email fallback...");

    // Fallback: create a persistent guest account using a device fingerprint
    const guestId  = localStorage.getItem("fiesta_guest_id") || crypto.randomUUID();
    localStorage.setItem("fiesta_guest_id", guestId);
    const email    = `guest_${guestId.slice(0, 8)}@fiesta.guest`;
    const password = `fiesta_${guestId}`;

    // Try signing in first in case account already exists
    const { data: signInData, error: signInError } = await db.auth.signInWithPassword({
      email, password
    });

    if (!signInError && signInData?.user) {
      currentUser    = signInData.user;
      currentProfile = await loadProfile(signInData.user.id);
      if (!currentProfile) {
        const autoUsername = "reader_" + signInData.user.id.slice(0, 4);
        currentProfile = await createProfile(signInData.user.id, autoUsername);
      }
      window.currentProfile = currentProfile;
      updateNavForUser(currentProfile);
      return signInData.user;
    }

    // Sign up if sign in failed
    const { data: signUpData, error: signUpError } = await db.auth.signUp({
      email, password
    });

    if (signUpError) {
      console.warn("Guest signup failed:", signUpError.message);
      return null;
    }

    currentUser    = signUpData.user;
    const autoUsername = "reader_" + signUpData.user.id.slice(0, 4);
    currentProfile = await createProfile(signUpData.user.id, autoUsername);
    window.currentProfile = currentProfile;
    updateNavForUser(currentProfile);
    return signUpData.user;

  } catch (err) {
    console.warn("Sign in exception:", err.message);
    return null;
  }
}

// ─── UPGRADE TO FULL ACCOUNT ───────────────────

async function upgradeAccount(email, password, username) {
  // Check if username is taken
  const { data: existing } = await db
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing && existing.id !== currentUser?.id) {
    return { error: { message: "That username is already taken." } };
  }

  const { data, error } = await db.auth.updateUser({ email, password });
  if (error) return { error };

  const { error: profileError } = await db
    .from("profiles")
    .update({ username })
    .eq("id", data.user.id);

  if (profileError) return { error: profileError };

  currentProfile = await loadProfile(data.user.id);
  window.currentProfile = currentProfile;
  return { data };
}

// ─── PROFILE MANAGEMENT ────────────────────────

async function createProfile(userId, username) {
  const { data, error } = await db
    .from("profiles")
    .upsert({ id: userId, username })
    .select()
    .single();

  if (error) {
    console.warn("Profile creation failed:", error.message);
    return null;
  }
  return data;
}

async function loadProfile(userId) {
  const { data } = await db
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();
  return data || null;
}

// ─── NAV UPDATE ────────────────────────────────

async function updateNavForUser(profile) {
  const navUser   = document.getElementById("navUser");
  const navStreak = document.getElementById("navStreak");

  if (navUser && profile) {
    navUser.textContent   = profile.username;
    navUser.style.display = "block";
  }

  if (navStreak && typeof getStreak === "function") {
    try {
      const streak = await getStreak();
      if (streak && streak.current > 0) {
        navStreak.textContent   = `${streak.current} day streak`;
        navStreak.style.display = "block";
      }
    } catch (e) { /* silent */ }
  }
}

// ─── AUTH STATE LISTENER ───────────────────────

db.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    currentUser    = session.user;
    currentProfile = await loadProfile(session.user.id);
    window.currentProfile = currentProfile;
    updateNavForUser(currentProfile);
  }

  if (event === "SIGNED_OUT") {
    currentUser    = null;
    currentProfile = null;
    window.currentProfile = null;
    const navUser = document.getElementById("navUser");
    if (navUser) navUser.style.display = "none";
  }

  if (event === "TOKEN_REFRESHED") {
    console.log("Session token refreshed silently");
  }
});

// ─── RUN ON LOAD ───────────────────────────────

document.addEventListener("DOMContentLoaded", initAuth);