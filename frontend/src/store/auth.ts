import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserData, BusinessData } from "../types/api";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserData | null;
  business: BusinessData | null;
  rehydrated: boolean;
  setAuth: (token: string, refreshToken: string, user: UserData, business?: BusinessData) => void;
  setBusiness: (business: BusinessData) => void;
  updateToken: (token: string) => void;
  updateTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  businessId: () => number | null;
  userRole: () => number | null;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      refreshToken: null,
      user: null,
      business: null,
      rehydrated: false,

      setAuth: (token: string, refreshToken: string, user: UserData, business?: BusinessData) =>
        set({ 
          token, 
          refreshToken, 
          user, 
          business: business || null 
        }),

      setBusiness: (business: BusinessData) =>
        set({ business }),

      updateToken: (token: string) =>
        set({ token }),

      updateTokens: (token: string, refreshToken: string) =>
        set({ token, refreshToken }),

      clearAuth: () =>
        set({ 
          token: null, 
          refreshToken: null, 
          user: null,
          business: null
        }),

      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.user;
      },

      businessId: () => {
        const state = get();
        const businessId = state.user?.business_id || state.business?.id;
        return businessId ? Number(businessId) : null;
      },

      userRole: () => {
        const state = get();
        return state.user?.role_id || null;
      },
    }),
    {
      name: "auth-storage",

      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        user: state.user,
        business: state.business,
      }),

      onRehydrateStorage: () => {
        return () => {
          setTimeout(() => {
            useAuth.setState({ rehydrated: true });
          }, 0);
        };
      },
    }
  )
);
