// modal.js — Username and account creation flow

let modalShown = false;

function showAuthModal() {
  if (modalShown) return;
  // Only show if user has not set a custom username yet
  if (currentProfile && !currentProfile.username.startsWith("reader_")) return;
  modalShown = true;
  document.getElementById("authModal").classList.remove("hidden");
}

function hideAuthModal() {
  document.getElementById("authModal").classList.add("hidden");
}

function showModalError(msg) {
  const el = document.getElementById("modalError");
  el.textContent = msg;
  el.classList.remove("hidden");
}

function hideModalError() {
  document.getElementById("modalError").classList.add("hidden");
}

// Show password field when email is entered
document.getElementById("emailInput").addEventListener("input", function () {
  const hasEmail = this.value.trim().length > 0;
  document.getElementById("passwordInput").style.display  = hasEmail ? "block" : "none";
  document.getElementById("passwordLabel").style.display  = hasEmail ? "block" : "none";
});

// Validate username format
function isValidUsername(username) {
  return /^[a-zA-Z0-9_]{3,24}$/.test(username);
}

// Submit handler
document.getElementById("modalSubmit").addEventListener("click", async () => {
  const username = document.getElementById("usernameInput").value.trim();
  const email    = document.getElementById("emailInput").value.trim();
  const password = document.getElementById("passwordInput").value;
  const btn      = document.getElementById("modalSubmit");

  hideModalError();

  // Validate username
  if (!username) {
    showModalError("Please choose a username to continue.");
    return;
  }
  if (!isValidUsername(username)) {
    showModalError("Username can only contain letters, numbers, and underscores. Minimum 3 characters.");
    return;
  }

  // Validate password if email provided
  if (email && password.length < 8) {
    showModalError("Password must be at least 8 characters.");
    return;
  }

  btn.textContent = "Saving...";
  btn.disabled = true;

  // Check if username is taken
  const { data: existing } = await db
    .from("profiles")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (existing && existing.id !== currentUser?.id) {
    showModalError("That username is already taken. Please choose another.");
    btn.textContent = "Save My Identity";
    btn.disabled = false;
    return;
  }

  // Update username in profiles table
  const { error: profileError } = await db
    .from("profiles")
    .update({ username })
    .eq("id", currentUser.id);

  if (profileError) {
    showModalError("Could not save username. Please try again.");
    btn.textContent = "Save My Identity";
    btn.disabled = false;
    return;
  }

  // If email provided, upgrade anonymous account
  if (email && password) {
    const { error: upgradeError } = await db.auth.updateUser({ email, password });
    if (upgradeError) {
      showModalError("Username saved but email registration failed: " + upgradeError.message);
      btn.textContent = "Save My Identity";
      btn.disabled = false;
      return;
    }
  }

  // Update local profile
  currentProfile = await loadProfile(currentUser.id);
  updateNavForUser(currentProfile);

  btn.textContent = "Saved";
  setTimeout(() => hideAuthModal(), 800);
});

// Skip button
document.getElementById("modalSkip").addEventListener("click", () => {
  hideAuthModal();
});

// Show modal after quiz is completed and books are rendered
// Called from script.js after fetchBooks completes
function triggerAuthModalIfNeeded() {
  setTimeout(() => {
    if (!currentProfile || currentProfile.username.startsWith("reader_")) {
      showAuthModal();
    }
  }, 2500);
}