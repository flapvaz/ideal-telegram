document.addEventListener('DOMContentLoaded', async function () {
  const copyTextBtn = document.getElementById('copy-text-btn')
  const copyImgBtn = document.getElementById('copy-img-btn')
  const canWriteEl = document.getElementById('can-write')
  const textarea = document.querySelector('textarea')
  const img = document.querySelector('img')
  const errorEl = document.getElementById('errorMsg')

  async function askWritePermission() {
    try {
      const { state } = await navigator.permissions.query({ name: 'clipboard-write', allowWithoutGesture: false })
      return state === 'granted'
    } catch (error) {
      errorEl.textContent = `Compatibility error (ONLY CHROME > V66): ${error.message}`
      console.log(error)
      return false
    }
  }

  const canWrite = await askWritePermission()

  canWriteEl.textContent = canWrite
  canWriteEl.style.color = canWrite ? 'green' : 'red'

  copyImgBtn.disabled = copyTextBtn.disabled = !canWrite

  const setToClipboard = blob => {
    const data = [new ClipboardItem({ [blob.type]: blob })]
    return navigator.clipboard.write(data)
  }

  /**
   * @param Blob - The ClipboardItem takes an object with the MIME type as key, and the actual blob as the value.
   */

  copyTextBtn.addEventListener('click', async () => {
    try {
      const blob = new Blob([textarea.value], { type: 'text/plain' })
      await setToClipboard(blob)
    } catch (error) {
      console.error('Something wrong happened')
    }
  })

  copyImgBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(img.src)
      const blob = await response.blob()
      await setToClipboard(blob)
    } catch (error) {
      console.error('Something wrong happened')
      console.error(error)
    }
  })
})
