"use client"
import { useLocalStorage } from "./use-local-storage"

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

export function useAuth() {
  const [authState, setAuthState] = useLocalStorage<AuthState>("auth", {
    user: null,
    token: null,
    isAuthenticated: false,
  })

  const [users, setUsers] = useLocalStorage<User[]>("users", [])

  const login = (email: string, password: string, rememberMe = false) => {
    // Find user in localStorage or create demo user
    let user = users.find((u) => u.email === email)

    if (!user) {
      // Create demo user for any email/password combination
      user = {
        id: Date.now().toString(),
        name: email.split("@")[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
      }
      setUsers([...users, user])
    }

    const token = `token_${Date.now()}`
    const newAuthState = {
      user,
      token,
      isAuthenticated: true,
    }

    setAuthState(newAuthState)

    if (rememberMe) {
      localStorage.setItem("rememberMe", "true")
    }

    return true
  }

  const signup = (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
    }

    setUsers([...users, newUser])
    return true
  }

  const logout = () => {
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
    })
    localStorage.removeItem("rememberMe")
  }

  const updateProfile = (updates: Partial<User>) => {
    if (authState.user) {
      const updatedUser = { ...authState.user, ...updates }
      setAuthState({
        ...authState,
        user: updatedUser,
      })

      // Update in users array
      const updatedUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u))
      setUsers(updatedUsers)
    }
  }

  return {
    ...authState,
    login,
    signup,
    logout,
    updateProfile,
    users,
  }
}
