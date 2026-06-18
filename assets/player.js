import { H as Hls } from './hlsjs-dru42stk.js';

var video = document.getElementById('movie-player');
var layer = document.getElementById('play-layer');
var manifestUrl = window.__mediaManifest || '';
var hls = null;
var ready = false;

function bindManifest() {
    if (!video || !manifestUrl || ready) {
        return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = manifestUrl;
        ready = true;
        return;
    }

    if (Hls && Hls.isSupported()) {
        hls = new Hls({
            enableWorker: true,
            lowLatencyMode: false
        });
        hls.loadSource(manifestUrl);
        hls.attachMedia(video);
        ready = true;
    }
}

function startPlayback() {
    if (!video) {
        return;
    }
    bindManifest();
    if (layer) {
        layer.classList.add('is-hidden');
    }
    var playAction = video.play();
    if (playAction && typeof playAction.catch === 'function') {
        playAction.catch(function() {
            if (layer) {
                layer.classList.remove('is-hidden');
            }
        });
    }
}

if (layer) {
    layer.addEventListener('click', startPlayback);
}

if (video) {
    video.addEventListener('click', function() {
        if (!ready) {
            startPlayback();
        }
    });
    video.addEventListener('play', function() {
        if (layer) {
            layer.classList.add('is-hidden');
        }
    });
    video.addEventListener('ended', function() {
        if (layer) {
            layer.classList.remove('is-hidden');
        }
    });
}

window.addEventListener('pagehide', function() {
    if (hls) {
        hls.destroy();
        hls = null;
    }
});
