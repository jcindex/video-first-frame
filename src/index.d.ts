
export const VideoFirstFrame = {

    /**
     * 获取视频首帧图片
     * @param urlOrEl 文件或Video DOM对象
     * @param returnBlob 是否返回Blob对象，默认为true
     * @param {number} quality 输出图片质量，0-1，默认为1
     */
    get(urlOrEl: HTMLVideoElement | File, returnBlob: boolean, quality: number): Promise<Blob | string>

}