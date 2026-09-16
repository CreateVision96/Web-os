const videoData = [
  "videos/chaerxyy.mp4",
  "videos/eli0.ae.mp4",
  "videos/kaizen.k8.mp4",
  "videos/vid1.mp4",
  "videos/crumleymemes.mp4",
  "videos/mcaupybugs.mp4",
  "videos/sebby.tv.mp4",
  "videos/w1nter.amy.mp4",
  "videos/ulqquiiorra.mp4",
  "videos/acvinylcollection.mp4",
  "videos/e.yrds.mp4",
  "videos/beamngkyu.mp4",
  "videos/cornschlawg.mp4",
];

export function initVid() {
  const feed = document.getElementById("vidFeed");
  const muteButton = document.getElementById("vidMute");

  const counter = document.createElement("div");
  counter.className = "vid-counter";
  counter.textContent = `1/${videoData.length}`;

  if (!feed || !muteButton) return;

  feed.innerHTML = "";
  feed.parentElement.appendChild(counter);

  videoData.forEach(function (src) {
    const item = document.createElement("div");
    item.className = "vid-item";

    const video = document.createElement("video");

    video.src = src;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = "metadata";

    video.addEventListener("click", function () {
      if (video.paused) {
        video.dataset.userPaused = "false";
        video.play().catch(function () {});
        item.classList.remove("paused");
      } else {
        video.dataset.userPaused = "true";
        video.pause();
        item.classList.add("paused");
      }
    });

    item.appendChild(video);
    feed.appendChild(item);
  });

  const videos = feed.querySelectorAll("video");

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        const video = entry.target;

        if (entry.isIntersecting) {
          videos.forEach(function (otherVideo) {
            if (otherVideo !== video) {
              otherVideo.pause();
              otherVideo.parentElement.classList.remove("paused");
            }
            const index = [...videos].indexOf(video);
            counter.textContent = `${index + 1} / ${videos.length}`;
          });

          if (video.dataset.userPaused !== "true") {
            video.parentElement.classList.remove("paused");
            video.play().catch(function () {});
          }
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.7,
    },
  );

  videos.forEach(function (video) {
    observer.observe(video);
  });

  muteButton.addEventListener("click", function () {
    let currentVideo = null;

    videos.forEach(function (video) {
      const rect = video.getBoundingClientRect();
      const visibleHeight =
        Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);

      if (visibleHeight > rect.height * 0.5) {
        currentVideo = video;
      }
    });

    if (!currentVideo) return;

    const muted = !currentVideo.muted;

    videos.forEach(function (video) {
      video.muted = muted;
    });

    muteButton.classList.toggle("unmuted", !muted);
  });
}
