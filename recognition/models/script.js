$(document).ready(function() {
    start()
})
async function start() {
    // load the models
    await faceapi.loadMtcnnModel('/models')
    await faceapi.loadFaceRecognitionModel('/models')

    const videoEl = document.getElementById('inputVideo')
    navigator.getUserMedia({ video: {} },
        stream => videoEl.srcObject = stream,
        err => console.error(err)
    )

    const mtcnnResults = await faceapi.mtcnn(document.getElementById('inputVideo'), mtcnnForwardParams)

    //   faceapi.drawDetection('overlay', mtcnnResults.map(res => res.faceDetection), { withScore: false })
    //   faceapi.drawLandmarks('overlay', mtcnnResults.map(res => res.faceLandmarks), { lineWidth: 4, color: 'red' })

    const options = new faceapi.MtcnnOptions(mtcnnParams)
    const input = document.getElementById('inputVideo')
    const fullFaceDescriptions = await faceapi.detectAllFaces(input, options).withFaceLandmarks().withFaceDescriptors()

    const labels = ['arif']
    const labeledFaceDescriptors = await Promise.all(
        labels.map(async label => {
            const img = await faceapi.fetchImage(
                'https://github.com/ahmedarifhasan/adasd/blob/master/Test.jpg'
            )
            const fullFaceDescription = await faceapi.detectAllFaces(img).withFaceLandmarks().withFaceDescriptors()
            if (!fullFaceDescription) {
                throw new Error(`no faces detected for ${label}`)
            }
            return new faceapi.LabeledFaceDescriptors(label, fullFaceDescription)
        })
    )
    const maxDescriptorDistance = 0.6
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, maxDescriptorDistance)

    const results = fullFaceDescription.map(fd => faceMatcher.findBestMatch(fd.descriptor))
    results.forEach((bestMatch, i) => {
        const box = fullFaceDescriptions[i].detection.box
        const text = bestMatch.toString()
        const drawBox = new faceapi.draw.DrawBox(box, { label: text })
        drawBox.draw(canvas)
    })

}

async function onPlay(videoEl) {
    start()
    setTimeout(() => onPlay(videoEl))
}
const mtcnnParams = {
    // number of scaled versions of the input image passed through the CNN
    // of the first stage, lower numbers will result in lower inference time,
    // but will also be less accurate
    maxNumScales: 10,
    // scale factor used to calculate the scale steps of the image
    // pyramid used in stage 1
    scaleFactor: 0.709,
    // the score threshold values used to filter the bounding
    // boxes of stage 1, 2 and 3
    scoreThresholds: [0.6, 0.7, 0.7],
    // mininum face size to expect, the higher the faster processing will be,
    // but smaller faces won't be detected
    minFaceSize: 20
}


const mtcnnForwardParams = {
    // number of scaled versions of the input image passed through the CNN
    // of the first stage, lower numbers will result in lower inference time,
    // but will also be less accurate
    maxNumScales: 10,
    // scale factor used to calculate the scale steps of the image
    // pyramid used in stage 1
    scaleFactor: 0.709,
    // the score threshold values used to filter the bounding
    // boxes of stage 1, 2 and 3
    scoreThresholds: [0.6, 0.7, 0.7],
    // mininum face size to expect, the higher the faster processing will be,
    // but smaller faces won't be detected
    minFaceSize: 20
}