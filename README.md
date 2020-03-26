# MediaStreamRecording Simple Project

## <a target='_blank' href="https://aeykeyzs.github.io/MediaStreamRecording/">Live Demo</a>

This is a sample project to do following functionalities:

1. Start Camera
2. Recording Stream
3. Play Recorded Stream
4. Download

You can use this repo and extend it further as per your requirement. Like:

1. Sending live streams
2. Upload stream to server or other platforms
3. Add filters, and a lot more

### TypeScript version ( can be used in angular )

1. Copy the file in "src/assets/" folder
2. Import the "initMR()" method in component from file
3. Declare the required variables

``` js
import { initMR } from "../../assets/js/mediarecorder";

declare var MediaRecorder: any;
declare global {
    interface Window {
        stream: any;
    }
}
window.stream = window.stream || {};
```

4. Call the "initMR()" method

``` js
ngOnInit() {
    initMR();
}
```

If you encounter a bug or problem with this sample code, please submit a new issue so we know about it and can fix it.

Code is adapted from WebRTC : https://github.com/webrtc/

Please see https://webrtc.org/bugs for general issues.

