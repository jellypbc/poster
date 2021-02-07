export function autogrow() {
  document.querySelectorAll('[data-autogrow]').forEach(function (element: any) {
    element.style.boxSizing = 'border-box'
    const offset = element.offsetHeight - element.clientHeight
    console.log('offset', offset)
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto'
      event.target.style.height = event.target.scrollHeight + offset + 'px'
    })
    element.removeAttribute('data-autogrow')
  })
}
