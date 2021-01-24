import '@tensorflow/tfjs-core';

import * as faceapi from 'face-api.js';

const results = await faceapi
    .detectAllFaces(referenceImage)
    .withFaceLandmarks()
    .withFaceDescriptors()

if (!results.length) {
    return
}

// create FaceMatcher with automatically assigned labels
// from the detection results for the reference image
const faceMatcher = new faceapi.FaceMatcher(results)