chrome.storage.sync.get({value: false}, (data) => {
    if (data.value) {
        console.log('12345')
        // adding scripts to the page 
        const SCRIPT_NAMES = ['opencv.js', 'face-api.min.js']

        for (let i=0; i < SCRIPT_NAMES.length; i++) {
            let script = document.createElement('script');
            script.defer = true;
            script.src = chrome.runtime.getURL(`'js/${SCRIPT_NAMES[i]}'`);
            document.head.prepend(script)
        }

        const video = document.getElementsByTagName('video')
        console.log(video)
        // Promise.all([
        //     faceapi.nets.tinyFaceDetector.loadFromUri('../models'),
        //     faceapi.nets.faceLandmark68Net.loadFromUri('../models'),
        //     faceapi.nets.faceRecognitionNet.loadFromUri('../models'),
        //     faceapi.nets.faceExpressionNet.loadFromUri('../models')
        // ])
        console.log(video)
        video.addEventListener('playing', () => {
            console.log('--------------------------------')
            const canvas = faceapi.createCanvasFromMedia(video)
            canvas.classList.add('rec-canvas')
            video.after(canvas)
            const displaySize = { width: video.width, height: video.height }
            faceapi.matchDimensions(canvas, displaySize)
            setInterval(async () => {
                const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions()
                const resizedDetections = faceapi.resizeResults(detections, displaySize)
                canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height)
                faceapi.draw.drawDetections(canvas, resizedDetections)
                faceapi.draw.drawFaceExpressions(canvas, resizedDetections)
            }, 100)
        })
    }
})
