import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const FavoritesContext = createContext(null);
const LS_KEY = 'rentora_favs_v1';

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  const isFavorited = (id) => favorites.some(f => f._id === id);
  const addFavorite = (item) => {
    setFavorites((prev) => (isFavorited(item._id) ? prev : [...prev, item]));
  };
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter(f => f._id !== id));
  };
  const toggleFavorite = (item) => {
    if (isFavorited(item._id)) removeFavorite(item._id); else addFavorite(item);
  };

  const value = useMemo(() => ({ favorites, isFavorited, addFavorite, removeFavorite, toggleFavorite }), [favorites]);
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export const useFavorites = () => useContext(FavoritesContext);


