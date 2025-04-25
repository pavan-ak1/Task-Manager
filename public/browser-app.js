// Configure axios defaults
axios.defaults.withCredentials = true;

const tasksDOM = document.querySelector('.tasks')
const loadingDOM = document.querySelector('.loading-text')
const formDOM = document.querySelector('.task-form')
const taskInputDOM = document.querySelector('.task-input')
const formAlertDOM = document.querySelector('.form-alert')
const logoutBtn = document.querySelector('.logout-btn')
const authAlert = document.querySelector('.auth-alert')

// Check if user is logged in
const checkAuth = () => {
  const user = localStorage.getItem('user');
  if (!user) {
    window.location.href = '/login.html';
    return false;
  }
  // Show logout button if user is logged in
  if (logoutBtn) {
    logoutBtn.style.display = 'block';
  }
  return true;
};

// Check auth when page loads
if (!checkAuth()) {
  // Stop execution if not authenticated
  throw new Error('Not authenticated');
}

// Load tasks from /api/tasks
const showTasks = async () => {
  if (!tasksDOM || !loadingDOM) return;
  
  loadingDOM.style.visibility = 'visible'
  try {
    const {
      data: { tasks },
    } = await axios.get('/api/v1/tasks')
    if (!tasks || tasks.length < 1) {
      tasksDOM.innerHTML = '<h5 class="empty-list">No tasks in your list</h5>'
      loadingDOM.style.visibility = 'hidden'
      return
    }
    const allTasks = tasks
      .map((task) => {
        const { completed, _id: taskID, name } = task
        return `<div class="single-task ${completed ? 'task-completed' : ''}">
          <div class="task-content">
            <input type="checkbox" class="task-checkbox" data-id="${taskID}" ${completed ? 'checked' : ''}>
            <h5 class="task-name">${name}</h5>
          </div>
          <div class="task-links">
            <button type="button" class="edit-btn" data-id="${taskID}">
              <i class="fas fa-edit"></i> Edit
            </button>
            <button type="button" class="delete-btn" data-id="${taskID}">
              <i class="fas fa-trash"></i> Delete
            </button>
          </div>
        </div>`
      })
      .join('')
    tasksDOM.innerHTML = allTasks

    // Add event listeners for checkboxes
    const checkboxes = tasksDOM.querySelectorAll('.task-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', async (e) => {
        const taskId = e.target.dataset.id;
        try {
          await axios.patch(`/api/v1/tasks/${taskId}`, {
            completed: e.target.checked
          });
          showTasks();
        } catch (error) {
          console.error('Error updating task:', error);
          e.target.checked = !e.target.checked; // Revert the checkbox
        }
      });
    });

  } catch (error) {
    console.error('Error fetching tasks:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login.html';
    } else {
      tasksDOM.innerHTML =
        '<h5 class="empty-list">There was an error, please try later....</h5>'
    }
  }
  loadingDOM.style.visibility = 'hidden'
}

if (tasksDOM) {
  showTasks()
}

// Handle all task-related clicks (edit, delete)
if (tasksDOM) {
  tasksDOM.addEventListener('click', async (e) => {
    const target = e.target;
    const taskElement = target.closest('.single-task');
    
    if (!taskElement) return;

    // Handle delete
    if (target.closest('.delete-btn')) {
      loadingDOM.style.visibility = 'visible';
      const id = target.closest('.delete-btn').dataset.id;
      try {
        await axios.delete(`/api/v1/tasks/${id}`);
        showTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('user');
          window.location.href = '/login.html';
        }
      }
      loadingDOM.style.visibility = 'hidden';
    }

    // Handle edit
    if (target.closest('.edit-btn')) {
      const id = target.closest('.edit-btn').dataset.id;
      const taskName = taskElement.querySelector('.task-name').textContent;
      const taskContent = taskElement.querySelector('.task-content');
      const originalContent = taskContent.innerHTML;

      // Create edit form
      const editForm = document.createElement('form');
      editForm.className = 'edit-form';
      editForm.innerHTML = `
        <input type="text" class="edit-input" value="${taskName}">
        <button type="submit" class="save-btn">Save</button>
        <button type="button" class="cancel-btn">Cancel</button>
      `;

      // Replace task content with edit form
      taskContent.innerHTML = '';
      taskContent.appendChild(editForm);

      // Focus the input
      const editInput = editForm.querySelector('.edit-input');
      editInput.focus();
      editInput.select();

      // Handle form submission
      editForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newName = editInput.value.trim();
        if (newName) {
          try {
            await axios.patch(`/api/v1/tasks/${id}`, { name: newName });
            showTasks();
          } catch (error) {
            console.error('Error updating task:', error);
            taskContent.innerHTML = originalContent;
          }
        }
      });

      // Handle cancel
      editForm.querySelector('.cancel-btn').addEventListener('click', () => {
        taskContent.innerHTML = originalContent;
      });

      // Handle escape key
      editInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          taskContent.innerHTML = originalContent;
        }
      });
    }
  });
}

// form
if (formDOM) {
  formDOM.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = taskInputDOM.value.trim()

    if (!name) {
      formAlertDOM.style.display = 'block'
      formAlertDOM.textContent = 'Please provide a task name'
      formAlertDOM.style.color = 'red'
      return
    }

    try {
      const res = await axios.post('/api/v1/tasks', { name })
      if (res.data.task) {
        showTasks()
        taskInputDOM.value = ''
        formAlertDOM.style.display = 'block'
        formAlertDOM.textContent = `Success, task added`
        formAlertDOM.style.color = 'green'
        formAlertDOM.classList.add('text-success')
      } else {
        throw new Error('Task creation failed')
      }
    } catch (error) {
      console.error('Error creating task:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('user');
        window.location.href = '/login.html';
      } else {
        formAlertDOM.style.display = 'block'
        formAlertDOM.textContent = error.response?.data?.msg || 'Error, please try again'
        formAlertDOM.style.color = 'red'
      }
    }
    setTimeout(() => {
      formAlertDOM.style.display = 'none'
      formAlertDOM.classList.remove('text-success')
    }, 3000)
  })
}

const loginForm = document.querySelector('.login-form')

// LOGIN
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault()
    const email = loginForm.email.value
    const password = loginForm.password.value

    try {
      const res = await axios.post('/api/v1/auth/login', { email, password })
      authAlert.textContent = `Welcome, ${res.data.user.name}`
      authAlert.style.color = 'green'
      logoutBtn.style.display = 'block'
      loginForm.reset()
    } catch (error) {
      console.error('Login error:', error);
      authAlert.textContent = error.response?.data?.msg || 'Login failed'
      authAlert.style.color = 'red'
    }
  })
}

// LOGOUT
if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await axios.get('/api/v1/auth/logout');
      localStorage.removeItem('user');
      if (authAlert) {
        authAlert.textContent = 'Logged out successfully';
        authAlert.style.color = 'green';
      }
      if (logoutBtn) {
        logoutBtn.style.display = 'none';
      }
      setTimeout(() => {
        window.location.href = '/login.html';
      }, 1000);
    } catch (error) {
      console.error('Logout error:', error);
      if (authAlert) {
        authAlert.textContent = 'Logout failed';
        authAlert.style.color = 'red';
      }
    }
  });
}
