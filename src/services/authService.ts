import { User, UserRole } from '@/types';
import { MOCK_USERS } from '@/data';

class AuthService {
  private currentUser: User = MOCK_USERS[0]; // Default: Clinician Dr. Vivek Sharma

  async getCurrentUser(): Promise<User> {
    return new Promise((resolve) => {
      setTimeout(() => resolve({ ...this.currentUser }), 50);
    });
  }

  async switchRole(role: UserRole): Promise<User> {
    return new Promise((resolve) => {
      const match = MOCK_USERS.find((u) => u.role === role) || MOCK_USERS[0];
      this.currentUser = { ...match };
      setTimeout(() => resolve({ ...this.currentUser }), 100);
    });
  }

  async login(email: string, role?: UserRole): Promise<User> {
    return new Promise((resolve) => {
      const match = MOCK_USERS.find((u) => u.email === email) ||
        (role ? MOCK_USERS.find((u) => u.role === role) : undefined) ||
        MOCK_USERS[0];
      this.currentUser = { ...match };
      setTimeout(() => resolve({ ...this.currentUser }), 150);
    });
  }

  async logout(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 50);
    });
  }
}

export const authService = new AuthService();
