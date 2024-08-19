import create from 'zustand';

interface UserState {
    userId: number | null;
    setUserId: (id: number) => void;
  }
  
  export const useUserStore = create<UserState>((set) => ({
    userId: null,
    setUserId: (id: number) => {
        console.log("Setting userId to:", id);
        set({ userId: id });
      },
  }));