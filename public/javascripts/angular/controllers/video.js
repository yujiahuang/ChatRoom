app.controller('video', function ($scope, $state, $stateParams, $location) {

// grab the room from the URL
var room = location.search && location.search.split('?')[1];

  // create our webrtc connection
  var webrtc = new SimpleWebRTC({
      // the id/element dom element that will hold "our" video
      localVideoEl: 'localVideo',
      // the id/element dom element that will hold remote videos
      remoteVideosEl: '',
      // immediately ask for camera access
      autoRequestMedia: true,
      media: {
        audio: true,
        video: false
      },
      debug: false,
      detectSpeakingEvents: false, // true or false, which one is better???
      autoAdjustMic: false
    });

  // when it's ready, join if we got a room from the URL
  webrtc.on('readyToCall', function () {
      // you can name it anything
      webrtc.joinRoom("Unknown_Room6");
    });

  function showVolume(el, volume) {
    if (!el) return;
      if (volume < -45) { // vary between -45 and -20
        el.style.height = '0px';
      } else if (volume > -20) {
        el.style.height = '100%';
      } else {
        el.style.height = '' + Math.floor((volume + 100) * 100 / 25 - 220) + '%';
      }
    }
    webrtc.on('channelMessage', function (peer, label, data) {
      if (data.type == 'volume') {
        showVolume(document.getElementById('volume_' + peer.id), data.volume);
      }
    });
    webrtc.on('videoAdded', function (video, peer) {
      console.log('video added', peer);
      var remotes = document.getElementById('remotes');
      if (remotes) {
        var d = document.createElement('div');
        d.className = 'videoContainer';
        d.id = 'container_' + webrtc.getDomId(peer);
        d.appendChild(video);
        var vol = document.createElement('div');
        vol.id = 'volume_' + peer.id;
        vol.className = 'volume_bar';
        video.onclick = function () {
          video.style.width = video.videoWidth + 'px';
          video.style.height = video.videoHeight + 'px';
        };
        d.appendChild(vol);
        remotes.appendChild(d);
      }
    });
    webrtc.on('videoRemoved', function (video, peer) {
      console.log('video removed ', peer);
      var remotes = document.getElementById('remotes');
      var el = document.getElementById('container_' + webrtc.getDomId(peer));
      if (remotes && el) {
        remotes.removeChild(el);
      }
    });
    webrtc.on('volumeChange', function (volume, treshold) {
      //console.log('own volume', volume);
      showVolume(document.getElementById('localVolume'), volume);
    });

  // Since we use this twice we put it here
  function setRoom(name) {
    
  }

  if (room) {
    setRoom(room);
  } else {
    
  }

  var button = null,
  setButton = function (bool) {
    button.text(bool ? 'share screen' : 'stop sharing');
  };
  webrtc.on('localScreenRemoved', function () {
    setButton(true);
  });

  setButton(true);

  button.click(function () {
    if (webrtc.getLocalScreen()) {
      webrtc.stopScreenShare();
      setButton(true);
    } else {
      webrtc.shareScreen(function (err) {
        if (err) {
          setButton(true);
        } else {
          setButton(false);
        }
      });

    }
  });

});