
const defer = () => {
    const obj = {}
    obj.promise = new Promise((resolve, reject) => {
        obj.resolve = resolve
        obj.reject = reject
    })
    return obj
}

module.exports = class VideoFirstFrame {
  /**
   * 获取视频首帧
   * @param {HTMLVideoElement} urlOrEl
   * @param {boolean} returnBlob
   */
  static get(urlOrEl, returnBlob = true) {
    if (!(urlOrEl instanceof HTMLVideoElement)) {
      let url = urlOrEl
      if (url instanceof File) {
        url = URL.createObjectURL(url)
      }
      urlOrEl = document.createElement("video")
      urlOrEl.src = url
      urlOrEl.volume = 0
      urlOrEl.style.cssText = `position: absolute;left: -100000px;top: -1000000px;`
      document.body.appendChild(urlOrEl)
      urlOrEl.play()
    }
    const defered = defer()
    urlOrEl.oncanplay = (e) => {
      VideoFirstFrame.#video2canvas(e.target, returnBlob, defered.resolve)
    }
    urlOrEl.onerror = function (e) {
      defered.reject(e)
    }
    return defered.promise.then((res) => {
      // 移除元素
      document.body.removeChild(urlOrEl)
      return res
    })
  }

  /**
   *
   * @param {HTMLVideoElement} video
   */
  static #video2canvas(video, returnBlob, done) {
    const canvas = document.createElement("canvas")
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    ctx.drawImage(video, 0, 0)
    if(!returnBlob) {
        done(canvas.toDataURL("image/png", 1))
        return
    }
    canvas.toBlob(
      (blob) => {
        const rname = Math.random().toString(16).slice(2)
        const file = new window.File([blob], `first-frame-${rname}.png`, {
          type: "image/png"
        })
        done(file)
        URL.revokeObjectURL(blob) // 释放Blob
      },
      "image/png",
      1
    )
  }
}
