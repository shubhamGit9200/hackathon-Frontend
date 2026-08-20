import { create } from 'zustand';
import { User, UserRole } from '@/types';
import { authService } from '@/services';
import { MOCK_USERS } from '@/data';

interface AuthState {
  user: User;
  activeRole: UserRole;
  isLoading: boolean;
  initialize: () => Promise<void>;
  switchRole: (role: UserRole) => Promise<void>;
  login: (email: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: MOCK_USERS[0], // Dr. Vivek Sharma, MD (Clinician)
  activeRole: 'CLINICIAN',
  isLoading: false,

  initialize: async () => {
    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ user, activeRole: user.role, isLoading: false });
    } catch (err) {
      set({ isLoading: false });
    }
  },

  switchRole: async (role: UserRole) => {
    set({ isLoading: true });
    const user = await authService.switchRole(role);
    set({ user, activeRole: role, isLoading: false });
  },

  login: async (email: string, role?: UserRole) => {
    set({ isLoading: true });
    const user = await authService.login(email, role);
    set({ user, activeRole: user.role, isLoading: false });
  },

  logout: async () => {
    set({ isLoading: true });
    await authService.logout();
    set({ user: MOCK_USERS[0], activeRole: 'CLINICIAN', isLoading: false });
  },
}));
