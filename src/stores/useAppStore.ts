import { create } from 'zustand';

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  durationMs?: number;
}

interface AppState {
  selectedPatientId: string | null;
  selectedReportId: string | null;
  activeFindingId: string | null;
  isUploadModalOpen: boolean;
  isPatientModalOpen: boolean;
  searchQuery: string;
  toasts: ToastNotification[];

  setSelectedPatientId: (id: string | null) => void;
  setSelectedReportId: (id: string | null) => void;
  setActiveFindingId: (id: string | null) => void;
  setUploadModalOpen: (open: boolean) => void;
  setPatientModalOpen: (open: boolean) => void;
  setSearchQuery: (q: string) => void;
  addToast: (toast: Omit<ToastNotification, 'id'>) => void;
  removeToast: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedPatientId: 'pat-1',
  selectedReportId: 'rep-001',
  activeFindingId: 'find-001',
  isUploadModalOpen: false,
  isPatientModalOpen: false,
  searchQuery: '',
  toasts: [],

  setSelectedPatientId: (id) => set({ selectedPatientId: id }),
  setSelectedReportId: (id) => set({ selectedReportId: id }),
  setActiveFindingId: (id) => set({ activeFindingId: id }),
  setUploadModalOpen: (open) => set({ isUploadModalOpen: open }),
  setPatientModalOpen: (open) => set({ isPatientModalOpen: open }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  addToast: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
    set((state) => ({ toasts: [...state.toasts, { ...toast, id }] }));

    const duration = toast.durationMs ?? 4000;
    setTimeout(() => {
      set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
    }, duration);
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },
}));
