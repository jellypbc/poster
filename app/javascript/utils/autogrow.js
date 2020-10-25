export function autogrow() {
  document.querySelectorAll('[data-autogrow]').forEach(function (element) {
    element.style.boxSizing = 'border-box'
    var offset = element.offsetHeight - element.clientHeight
    console.log('offset', offset)
    element.addEventListener('input', function (event) {
      event.target.style.height = 'auto'
      event.target.style.height = event.target.scrollHeight + offset + 'px'
    })
    element.removeAttribute('data-autogrow')
  })
}
