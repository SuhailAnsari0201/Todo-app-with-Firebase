// Listen for auth status change
auth.onAuthStateChanged((user) => {
  console.log("user>>", user);
  console.log("create time uid", auth.currentUser?.uid);

  if (user) {
    db.collection("users")
      .doc(user.uid)
      .collection("guides")
      .onSnapshot(
        (snapshot) => {
          setupGides(snapshot.docs);
          setupUI(user);
        },
        (error) => console.log(error.message)
      );
  } else {
    console.log("User Logged out");
    setupGides([]);
    setupUI();
  }
});

// Create new Guide
const createForm = document.querySelector("#create-form");
createForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (auth.currentUser?.uid) {
    db.collection("users")
      .doc(auth.currentUser?.uid)
      .collection("guides")
      .add({
        title: createForm["title"].value,
        content: createForm["content"].value,
      })
      .then(() => {
        const modal = document.querySelector("#modal-create");
        M.Modal.getInstance(modal).close();
        createForm.reset();
      })
      .catch((error) => alert(error.message));
  } else {
    console.log("invalid operation");
  }
});

// Signup
const signupForm = document.querySelector("#signup-form");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = signupForm["signup-email"].value;
  const password = signupForm["signup-password"].value;
  // signup the user
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((user) => {
      // user.user.updateProfile({
      //   displayName: signupForm["signup-username"].value,
      // });
      return db.collection("users").doc(user.user.uid).set({
        username: signupForm["signup-username"].value,
        bio: signupForm["signup-bio"].value,
      });
    })
    .then(() => {
      const modal = document.querySelector("#modal-signup");
      M.Modal.getInstance(modal).close();
      signupForm.reset();
    })
    .catch((error) => alert(error.message));
});

// Login
const loginForm = document.querySelector("#login-form");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = loginForm["login-email"].value;
  const password = loginForm["login-password"].value;
  // login the user
  auth
    .signInWithEmailAndPassword(email, password)
    .then((user) => {
      const modal = document.querySelector("#modal-login");
      M.Modal.getInstance(modal).close();
      loginForm.reset();
    })
    .catch((error) => alert(error.message));
});

// Logout
const logout = document.querySelector("#logout");
logout.addEventListener("click", (e) => {
  e.preventDefault();
  auth.signOut().then();
});

// video 17 on way
