
export function getInput(id: string, text: string) {
  const label = document.createElement('label')
  const input = document.createElement('input')
  input.setAttribute('type', 'text')
  input.setAttribute('id', id)
  label.innerHTML = text
  label.appendChild(input)
  return label
}

export function getButton(text: string, callback: (this: HTMLButtonElement, ev: MouseEvent) => any) {
  const button = document.createElement('button')
  button.setAttribute('class', 'styled')
  button.setAttribute('type', 'submit')
  button.addEventListener('click', callback, false)
  button.innerHTML = text
  return button
}

