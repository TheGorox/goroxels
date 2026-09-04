import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export function createCanvasStore(canvasName) {
  if (!canvasName) {
    throw new Error('canvasName required for persistent store');
  }

  const storeName = `canvas-${canvasName}`;

  const initial = {
    primaryColor: -1,
    seconaryColor: -1,
    brushSize: 1,
    lastTool: 'brush',
  };

  return create(
    persist(
      (set) => ({
        ...initial,

        set: (partial) => set(partial),
        setMany: (updates) => set((state) => ({ ...state, ...updates })),
      }),
      {
        name: storeName,

        partialize: (state) => {
          const saved = {};
          for (const key in initial) {
            if (Object.hasOwn(initial, key)) {
              saved[key] = state[key];
            }
          }
          return saved;
        },
      }
    )
  );
}