const API_BASE_URL = 'http://localhost:3000';

async function fetchJson(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export const api = {
  get: (endpoint) => fetchJson(endpoint),
  
  post: (endpoint, data) => fetchJson(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  put: (endpoint, data) => fetchJson(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  
  delete: (endpoint) => fetchJson(endpoint, {
    method: 'DELETE',
  }),
};

// GET all users
async function getUsers() {
    try {
      const users = await api.get('/users');
      console.log(users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  }
  
  // POST a new user
  async function createUser(userData) {
    try {
      const newUser = await api.post('/users', userData);
      console.log('New user created:', newUser);
    } catch (error) {
      console.error('Error creating user:', error);
    }
  }
  
  // PUT (update) a user
  async function updateUser(id, userData) {
    try {
      const updatedUser = await api.put(`/users/${id}`, userData);
      console.log('User updated:', updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  }
  
  // DELETE a user
  async function deleteUser(id) {
    try {
      await api.delete(`/users/${id}`);
      console.log('User deleted');
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  }

  
  


