
async function loadModels() {
    const url = chrome.runtime.getURL('../models')
    Promise.all([
        await faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
        // await faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
        await faceapi.nets.faceExpressionNet.loadFromUri('../models')
    ])
}


async function main() {
    chrome.storage.sync.get({value: false}, (data) => {
        if (data.value) { 
            
            const videoList = document.getElementsByTagName('video')
            if (videoList.length) {
                const video = videoList[0]
                loadModels();

                video.addEventListener('playing', () => {
                    const canvas = faceapi.createCanvasFromMedia(video)
                    canvas.style.position = "absolute"
                    video.after(canvas)
                    const displaySize = { width: video.width, height: video.height }
                    faceapi.matchDimensions(canvas, displaySize)
                    setInterval(async () => {
                        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceExpressions()
                        const resizedDetections = faceapi.resizeResults(detections, displaySize)
                        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                        faceapi.draw.drawDetections(canvas, resizedDetections)
                        faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
                    }, 100)
                })
            }
        }
    })
}

main()