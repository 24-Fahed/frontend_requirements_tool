export function encodeDragPayload(payload) {
  return JSON.stringify(payload)
}

export function decodeDragPayload(rawValue) {
  if (!rawValue) {
    return null
  }

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}
