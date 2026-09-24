import { create } from 'zustand';

export const useCompareStore = create((set, get) => ({
  compareList: [], // array of project objects (up to 3)

  addToCompare: (project) => {
    const { compareList } = get();
    if (compareList.some(p => p._id === project._id)) {
      set({ compareList: compareList.filter(p => p._id !== project._id) });
      return;
    }
    if (compareList.length >= 3) {
      alert('You can compare up to 3 projects at a time.');
      return;
    }
    set({ compareList: [...compareList, project] });
  },

  removeFromCompare: (projectId) => {
    set({ compareList: get().compareList.filter(p => p._id !== projectId) });
  },

  clearCompare: () => {
    set({ compareList: [] });
  }
}));
