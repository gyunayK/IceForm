export function copyToClipboard(text: string, context: any) {
  navigator.clipboard.writeText(text)
  context.copied = true
  setTimeout(() => {
    context.copied = false
  }, 2000)
}
