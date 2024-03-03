const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const webrtc = require("wrtc");
const fs = require("fs");
const spawn = require("child_process").spawnSync;
const ws = require("ws");

let senderStream;

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/consumer", async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    senderStream.getTracks().forEach(track => peer.addTrack(track, senderStream));
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

app.post('/broadcast', async ({ body }, res) => {
    const peer = new webrtc.RTCPeerConnection({
        iceServers: [
            {
                urls: "stun:stun.stunprotocol.org"
            }
        ]
    });
    peer.ontrack = (e) => handleTrackEvent(e, peer);
    const desc = new webrtc.RTCSessionDescription(body.sdp);
    await peer.setRemoteDescription(desc);
    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);
    const payload = {
        sdp: peer.localDescription
    }

    res.json(payload);
});

function handleTrackEvent(e, peer) {
    senderStream = e.streams[0];
};

const httpsServer = require("https").createServer({key: fs.readFileSync("ssl/key.pem"), cert: fs.readFileSync("ssl/cert.pem")}, app);
const wss = new ws.WebSocketServer({ server: httpsServer });
wss.on("connection", (ws) => {
    ws.on("error", console.error);

    let poll = null;
    ws.on("message", (data) => {
        if (data === "HELLO") {
            poll = setInterval(() => {
                var child = spawn("python3", ["python/sensors.py"]);
                console.log("STDOUT:", child.stdout);
                ws.send(child.stdout);
            }, 1000);
        } else if (data === "GOODBYE") {
            clearInterval(poll);
        }
    });
});


httpsServer.listen(5000, () => console.log('server started'));
