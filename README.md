# EcoGenius
The EcoGenius Smart Compost Monitor


Run `npm install` to install dependencies, and create a directory in the root of this repository called `ssl`.
Add your SSL cert and key files to the `ssl` directory, making sure they're named `key.pem` and `cert.pem`

Then, `npm start` to start the server.


Server runs on port 5000 by default.

On the serverside, visit https://localhost and start the video stream,
and on the viewer end, visit viewer.html to access the live video feed and sensor data.
