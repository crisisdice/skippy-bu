export function getParent() {
  const parent = document.getElementById('app')
  if (!parent) throw new Error('Bad html')
  return parent
}

