const BASE = 'https://thesimpsonsapi.com/api';

export async function fetchCharacters(page = 1) {
  const res = await fetch(`${BASE}/characters?page=${page}`);
  if (!res.ok) throw new Error('Error al cargar personajes');
  return res.json();
}

export async function fetchCharacterById(id) {
  const res = await fetch(`${BASE}/characters/${id}`);
  if (!res.ok) throw new Error('Personaje no encontrado');
  return res.json();
}

export function resolvePortrait(path) {
  if (!path) return '';

  return `https://thesimpsonsapi.com${path}`;
}


