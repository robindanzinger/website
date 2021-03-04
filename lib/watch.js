import fs from 'fs'

export async function watch (directories, onChangeHandler, options) {
  let waitForUpdate = false
  directories.forEach(p => {

    console.log('watch dir:', p)
    fs.watch(p, async(evt, filename) => {
      if (waitForUpdate) {
        return
      }
      if (watchFileType(filename, options.filetypes)) {
        console.log('run update for file:', filename)
        waitForUpdate = true
        await onChangeHandler(filename)
        setTimeout(() => {
          waitForUpdate = false
        }, options.sleep || 1);
      }
    })
  })
}

function watchFileType(filename, filetypes = ['js']) {
  const ftstring = filetypes.join('|')
  return new RegExp(`.*\.(?:${ftstring})$`).test(filename)
}
