// fetch("api.github.com/users/wesbos")
//   .then(res => {
//     return res.json();
//   })
//   .then(res => {
//     console.log(res);
//   })
//   .catch(err => {
//     console.error("OH NOO!!!!!!!");
//     console.error(err);
//   });

// getUserMedia is promise based, there is also a getUserAudio
const video = document.querySelector(".handsome");
navigator.mediaDevices
  .getUserMedia({ video: true })
  .then(mediaStream => {
    video.srcObject = mediaStream;
    video.load();
    video.play();
  })
  .catch(err => {
    console.log(err);
  });
