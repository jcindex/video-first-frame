const defer = function () {
  const obj = {};
  obj.promise = new Promise(function (resolve, reject) {
    obj.resolve = resolve;
    obj.reject = reject;
  });
  return obj;
};

function video2canvas(video, returnBlob, quality, done) {
  const canvas = document.createElement("canvas")
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext("2d")
  ctx.drawImage(video, 0, 0)
  if (!returnBlob) {
    done(canvas.toDataURL("image/png", 1))
    return
  }
  canvas.toBlob(
    function (blob) {
      const rname = Math.random().toString(16).slice(2)
      const file = new window.File([blob], `first-frame-${rname}.png`, {
        type: "image/png"
      })
      done(file)
      URL.revokeObjectURL(blob) // 释放Blob
    },
    "image/png",
    quality
  )
}

export const VideoFirstFrame = {
  /**
   * 获取视频首帧
   * @param {HTMLVideoElement} urlOrEl
   * @param {boolean} returnBlob
   * @param {number} quality 输出图片质量,0-1
   */
  get(urlOrEl, returnBlob = true, quality = 1) {
    if (!(urlOrEl instanceof HTMLVideoElement)) {
      let url = urlOrEl
      if (url instanceof File) {
        url = URL.createObjectURL(url)
      }
      urlOrEl = document.createElement("video")
      urlOrEl.src = url
      urlOrEl.volume = 0
      urlOrEl.playsInline = true
      urlOrEl.setAttribute("x5-video-player-type", "h5")
      urlOrEl.setAttribute("playsinline", "true")
      urlOrEl.setAttribute("webkit-playsinline", "true")
      urlOrEl.onplay = function () {
        if (typeof urlOrEl.webkitExitFullscreen === "function") {
          urlOrEl.webkitExitFullscreen()
        }
        if (typeof urlOrEl.mozExitFullscreen === "function") {
          urlOrEl.mozExitFullscreen()
        }
        if (typeof urlOrEl.exitFullscreen === "function") {
          urlOrEl.exitFullscreen()
        }
      }
      urlOrEl.style.cssText = `position: absolute;left: -100000px;top: -1000000px;`
      document.body.appendChild(urlOrEl)
      urlOrEl.play()
    }
    const defered = defer()
    urlOrEl.oncanplay = function (e) {
      setTimeout(() => {
        // 延时100ms，解决ios下首屏为白屏问题
        video2canvas(e.target, returnBlob, quality, defered.resolve)
      }, 100)
    }
    urlOrEl.onerror = function (e) {
      defered.reject(e)
    }
    return defered.promise.then(function (res) {
      // 移除元素
      document.body.removeChild(urlOrEl)
      return res
    })
  }
}