
export class VideoFirstFrame {

    /**
     * 获取视频首帧图片
     * @param urlOrEl 文件或Video DOM对象
     * @param returnBlob 是否返回Blob对象
     */
    static get(urlOrEl: HTMLVideoElement | File, returnBlob: boolean): Promise<Blob | string>

}