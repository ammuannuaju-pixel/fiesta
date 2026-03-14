async function initAuth() {
  const { data: { session } } = await db.auth.getSession();
  if (session) {
    currentUser    = session.user;
    currentProfile = await loadProfile(session.user.id);
    updateNavForUser(currentProfile);
  } else {
    await signInAnonymously();
  }
}

async function signInAnonymously() {
  const { data, error } = await db.auth.signInAnonymously();
  if (error) { console.warn("Sign in failed:", error.message); return null; }
  currentUser = data.user;
  const autoUsername = "reader_" + data.user.id.slice(0, 4);
  currentProfile = await createProfile(data.user.id, autoUsername);
  updateNavForUser(currentProfile);
  return data.user;
}

async function createProfile(userId, username) {
  const { data, error } = await db
    .from("profiles")
    .upsert({ id: userId, username })
    .select()
    .single();
  if (error) { console.warn("Profile error:", error.message); return null; }
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

function updateNavForUser(profile) {
  const navUser = document.getElementById("navUser");
  if (!navUser || !profile) return;
  navUser.textContent = profile.username;
  navUser.style.display = "block";
}

db.auth.onAuthStateChange(async (event, session) => {
  if (event === "SIGNED_IN" && session) {
    currentUser    = session.user;
    currentProfile = await loadProfile(session.user.id);
    updateNavForUser(currentProfile);
  }
  if (event === "SIGNED_OUT") {
    currentUser    = null;
    currentProfile = null;
  }
});

document.addEventListener("DOMContentLoaded", initAuth);