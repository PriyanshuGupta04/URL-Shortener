import { customAlphabet } from 'nanoid/non-secure'
import { readLocal, writeLocal } from './storage.js'
import { isAlnum } from './validator.js'

const URLS_KEY = 'am_urls'
const clicksKey = code => `am_clicks_${code}`
const nano = customAlphabet('0123456789abcdefghijklmnopqrstuvwxyz', 6)

export function getAllUrls() {
  return readLocal(URLS_KEY, [])
}

export function saveAllUrls(list) {
  writeLocal(URLS_KEY, list)
}

export function existsCode(code) {
  const list = getAllUrls()
  return list.some(x => x.code.toLowerCase() === code.toLowerCase())
}

export function genUniqueCode() {
  let tries = 0
  while (tries < 1000) {
    const c = nano()
    if (!existsCode(c)) return c
    tries++
  }
  throw new Error('Could not generate unique shortcode')
}

export function createShort({ longUrl, minutes=30, customCode }) {
  // Validate code
  let code = customCode?.trim()
  if (code) {
    if (!isAlnum(code) || code.length > 20) {
      return { ok: false, error: 'Invalid shortcode. Use alphanumeric up to 20 chars.' }
    }
    if (existsCode(code)) {
      return { ok: false, error: 'Shortcode already exists. Choose another.' }
    }
  } else {
    code = genUniqueCode()
  }

  const now = Date.now()
  const expiresAt = now + minutes*60*1000
  const item = { code, longUrl, createdAt: now, expiresAt, clicks: 0 }

  const list = getAllUrls()
  list.unshift(item)
  saveAllUrls(list)
  return { ok: true, data: item }
}

export function getClicks(code) {
  return readLocal(clicksKey(code), [])
}

export function addClick(code, click) {
  const list = getClicks(code)
  list.push(click)
  writeLocal(clicksKey(code), list)
  // update total count in main list
  const urls = getAllUrls()
  const idx = urls.findIndex(u => u.code.toLowerCase() === code.toLowerCase())
  if (idx >= 0) {
    urls[idx] = { ...urls[idx], clicks: list.length }
    saveAllUrls(urls)
  }
}

export function findByCode(code) {
  const list = getAllUrls()
  return list.find(x => x.code.toLowerCase() === code.toLowerCase())
}
