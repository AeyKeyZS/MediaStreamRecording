// This code is adapted from
// WebRTC Sample Projects
// https://rawgit.com/Miguelao/demos/master/mediarecorder.html

'use strict';

declare var MediaRecorder: any;
declare global {
    interface Window { stream: any; }
}
window.stream = window.stream || {};

export function initMR() {

    console.log("Hii from MediaRecorder.js")

    const mediaSource: any = new MediaSource();
    mediaSource.addEventListener('sourceopen', handleSourceOpen, false);
    let mediaRecorder: any;
    let recordedBlobs: any;
    let sourceBuffer: any;

    const errorMsgElement: any = document.querySelector('span#errorMsg');
    const recordedVideo: any = document.querySelector('video#recorded');
    const recordButton: any = document.querySelector('button#record');
    recordButton.addEventListener('click', () => {
        if (recordButton.textContent === 'Start Recording') {
            startRecording();
        } else {
            stopRecording();
            recordButton.textContent = 'Start Recording';
            recordButton.style.backgroundColor = "#292929";
            playButton.disabled = false;
            downloadButton.disabled = false;
        }
    });

    const playButton: any = document.querySelector('button#play');
    playButton.addEventListener('click', () => {
        const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' });
        recordedVideo.src = null;
        recordedVideo.srcObject = null;
        recordedVideo.src = window.URL.createObjectURL(superBuffer);
        recordedVideo.controls = true;
        recordedVideo.play();
    });

    const downloadButton: any = document.querySelector('button#download');
    downloadButton.addEventListener('click', () => {
        const blob = new Blob(recordedBlobs, { type: 'video/webm' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'test.webm';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 100);
    });

    function handleSourceOpen(event) {
        console.log('MediaSource opened');
        sourceBuffer = mediaSource.addSourceBuffer('video/webm; codecs="vp8"');
        console.log('Source buffer: ', sourceBuffer);
    }

    function handleDataAvailable(event) {
        console.log('handleDataAvailable', event);
        if (event.data && event.data.size > 0) {
            recordedBlobs.push(event.data);
        }
    }

    function startRecording() {
        recordedBlobs = [];
        let options = { mimeType: 'video/webm;codecs=vp9' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
            console.error(`${options.mimeType} is not Supported`);
            errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
            options = { mimeType: 'video/webm;codecs=vp8' };
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                console.error(`${options.mimeType} is not Supported`);
                errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
                options = { mimeType: 'video/webm' };
                if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                    console.error(`${options.mimeType} is not Supported`);
                    errorMsgElement.innerHTML = `${options.mimeType} is not Supported`;
                    options = { mimeType: '' };
                }
            }
        }

        try {
            mediaRecorder = new MediaRecorder(window.stream, options);
        } catch (e) {
            console.error('Exception while creating MediaRecorder:', e);
            errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
            return;
        }

        console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        recordButton.textContent = 'Stop Recording';
        recordButton.style.backgroundColor = "#d1383d";
        playButton.disabled = true;
        downloadButton.disabled = true;
        mediaRecorder.onstop = (event) => {
            console.log('Recorder stopped: ', event);
            console.log('Recorded Blobs: ', recordedBlobs);
        };
        mediaRecorder.ondataavailable = handleDataAvailable;
        mediaRecorder.start(10); // collect 10ms of data
        console.log('MediaRecorder started', mediaRecorder);
    }

    function stopRecording() {
        mediaRecorder.stop();
    }

    function handleSuccess(stream) {
        recordButton.disabled = false;
        console.log('getUserMedia() got stream:', stream);
        window.stream = stream;

        const gumVideo: any = document.querySelector('video#gum');
        gumVideo.srcObject = stream;
    }

    async function init(constraints) {
        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            handleSuccess(stream);
        } catch (e) {
            console.error('navigator.getUserMedia error:', e);
            errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
        }
    }

    document.querySelector('button#start').addEventListener('click', async () => {
        const hasEchoCancellationElem: any = document.querySelector('#echoCancellation');
        const hasEchoCancellation = hasEchoCancellationElem.checked;
        const constraints = {
            audio: {
                echoCancellation: { exact: hasEchoCancellation }
            },
            video: {
                width: 1280, height: 720
            }
        };
        console.log('Using media constraints:', constraints);
        await init(constraints);
    });
}