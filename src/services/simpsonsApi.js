export function cdnUrl(imagePath, kind = 'character', size = 500) {
  if (!imagePath) return ''
  let p = String(imagePath).trim()
  if (/^https?:\/\//i.test(p)) return p
  if (!p.includes('/')) p = `/${kind}/${p}`
  if (!p.startsWith('/')) p = '/' + p
  return `https://cdn.thesimpsonsapi.com/${size}${p}`
}

export function resolveImage(obj, kind = 'character', size = 500) {
  const byKind = {
    character: ['portrait_path', 'portrait', 'image', 'imageUrl', 'image_url', 'images?.portrait'],
    episode: ['image_path', 'thumbnail_path', 'poster_path'],
    location: ['image_path', 'thumbnail_path', 'map_path']
  }

  const candidates = (byKind[kind] || [])
    .map(k => k.includes('?.') ? obj?.[k.split('?.')[0]]?.[k.split('?.')[1]] : obj?.[k])
    .filter(Boolean)

  if (!candidates.length) return ''
  return cdnUrl(candidates[0], kind, size)
}

export async function fetchPaged(endpoint, apiPage) {
  const url = `https://thesimpsonsapi.com/api/${endpoint}?page=${apiPage}`
  const res = await fetch(url, { cache: 'no-store' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const json = await res.json()

  const data = Array.isArray(json?.results) ? json.results : []
  const apiPages = Number(json?.pages) || 1
  const totalItems = Number(json?.count) || (apiPages * 20)

  return { data, apiPages, totalItems }
}
