document.addEventListener('DOMContentLoaded', () => {
  // Adjust dynamically the height of the hacker animation container
  function adjustHackerContainerHeight() {
    const hackerContainer = document.querySelector('.hacker-container');
    const produtosSection = document.querySelector('.produtos');
    if (hackerContainer && produtosSection) {
      const produtosTop = produtosSection.getBoundingClientRect().top + window.scrollY;
      hackerContainer.style.height = produtosTop + 'px';
    }
  }

  adjustHackerContainerHeight();
  window.addEventListener('resize', adjustHackerContainerHeight);

  // Elements for login/profile UI
  const loginButton = document.getElementById('loginButton');
  const logoutButton = document.getElementById('logoutButton');
  const profileSection = document.getElementById('profileSection');
  const profileName = document.getElementById('profileName');
  const toggleUsersListButton = document.getElementById('toggleUsersListButton');
  const usersListSection = document.querySelector('.registered-users');
  const usersList = document.getElementById('usersList');

  // Modals and forms
  const registrationModal = document.getElementById('registrationModal');
  const loginModal = document.getElementById('loginModal');
  const registrationForm = document.getElementById('registrationForm');
  const loginForm = document.getElementById('loginForm');
  const showLoginLink = document.getElementById('showLogin');
  const showRegisterLink = document.getElementById('showRegister');
  const notification = document.getElementById('notification');
  const loginError = document.getElementById('loginError');

  // User data storage (in-memory for demo)
  let registeredUsers = [];

  // Show registration modal
  loginButton.addEventListener('click', () => {
    registrationModal.style.display = 'block';
    loginModal.style.display = 'none';
    notification.style.display = 'none';
    loginError.style.display = 'none';
  });

  // Toggle between registration and login modals
  showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (registrationModal.style.display === 'block') {
      registrationModal.style.display = 'none';
      loginModal.style.display = 'block';
    }
    notification.style.display = 'none';
    loginError.style.display = 'none';
  });

  showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    if (loginModal.style.display === 'block') {
      loginModal.style.display = 'none';
      registrationModal.style.display = 'block';
    }
    notification.style.display = 'none';
    loginError.style.display = 'none';
  });

  // Register user
  registrationForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = registrationForm.name.value.trim();
    const email = registrationForm.email.value.trim().toLowerCase();

    if (!name || !email) {
      notification.textContent = 'Por favor, preencha todos os campos.';
      notification.style.display = 'block';
      notification.classList.add('show');
      return;
    }

    if (registeredUsers.some(user => user.email === email)) {
      notification.textContent = 'Este email já está cadastrado.';
      notification.style.display = 'block';
      notification.classList.add('show');
      return;
    }

    registeredUsers.push({ name, email });
    notification.textContent = 'Cadastro realizado com sucesso!';
    notification.style.display = 'block';
    notification.classList.add('show');
    registrationForm.reset();

    // After 3 seconds, hide notification and switch to login modal
    setTimeout(() => {
      notification.classList.remove('show');
      notification.style.display = 'none';
      registrationModal.style.display = 'none';
      loginModal.style.display = 'block';
    }, 3000);
  });

  // Restore logged-in user from localStorage on page load
  function restoreLogin() {
    const storedUser = localStorage.getItem('loggedInUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      loginButton.style.display = 'none';
      profileSection.style.display = 'flex';
      profileName.textContent = user.name;
      toggleUsersListButton.style.display = 'inline-block';
      updateUsersList();
    }
  }

  // Login user
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = loginForm.loginName.value.trim();
    const email = loginForm.loginEmail.value.trim().toLowerCase();

    const user = registeredUsers.find(u => u.name === name && u.email === email);
    if (user) {
      loginModal.style.display = 'none';
      loginError.style.display = 'none';
      loginButton.style.display = 'none';
      profileSection.style.display = 'flex';
      profileName.textContent = user.name;
      toggleUsersListButton.style.display = 'inline-block';
      updateUsersList();
      localStorage.setItem('loggedInUser', JSON.stringify(user));
    } else {
      loginError.textContent = 'Nome ou email incorretos.';
      loginError.style.display = 'block';
    }
  });

  // Logout user
  logoutButton.addEventListener('click', () => {
    profileSection.style.display = 'none';
    loginButton.style.display = 'inline-block';
    toggleUsersListButton.style.display = 'none';
    usersListSection.style.display = 'none';
    localStorage.removeItem('loggedInUser');
  });
  
  // Call restoreLogin on page load
  restoreLogin();

  // Toggle users list visibility
  toggleUsersListButton.addEventListener('click', () => {
    if (usersListSection.style.display === 'none' || usersListSection.style.display === '') {
      usersListSection.style.display = 'block';
      toggleUsersListButton.textContent = 'Ocultar Usuários Cadastrados';
    } else {
      usersListSection.style.display = 'none';
      toggleUsersListButton.textContent = 'Mostrar Usuários Cadastrados';
    }
  });

  // Update users list UI
  function updateUsersList() {
    usersList.innerHTML = '';
    registeredUsers.forEach(user => {
      const li = document.createElement('li');
      li.textContent = user.name + ' (' + user.email + ')';
      usersList.appendChild(li);
    });
  }

  // Close modals when clicking outside modal content
  window.addEventListener('click', (event) => {
    if (event.target === registrationModal) {
      registrationModal.style.display = 'none';
      notification.style.display = 'none';
    }
    if (event.target === loginModal) {
      loginModal.style.display = 'none';
      loginError.style.display = 'none';
    }
  });

  // Hacker animation on canvas
  const canvas = document.getElementById('hackerCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let columns;
  let drops;

  function setupCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.hacker-container').offsetHeight;
    columns = Math.floor(width / 20);
    drops = [];
    for (let x = 0; x < columns; x++) {
      drops[x] = Math.random() * height;
    }
  }

  function draw() {
    // Clear only the canvas area with a transparent background to avoid hiding other content
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#FF0000';
    ctx.font = '15pt monospace';

    for (let i = 0; i < drops.length; i++) {
      const text = String.fromCharCode(0x30A0 + Math.random() * 96);
      ctx.fillText(text, i * 20, drops[i]);

      if (drops[i] > height && Math.random() > 0.975) {
        drops[i] = 0;
      }

      drops[i] += 20;
    }
  }

  function animate() {
    draw();
    requestAnimationFrame(animate);
  }

  setupCanvas();
  animate();

  window.addEventListener('resize', () => {
    setupCanvas();
  });
});
