const musicData = [
  {
    title: "Aishite Aishite Aishite",
    artist: "Ado",
    audio: "music/Aishite Aishite Aishite - Ado.mp3",
    artwork: "music/Aishite.jpg",
  },
  {
    title: "BIRDBRAIN",
    artist: "JaimeP",
    audio: "music/BIRDBRAIN - JaimeP.mp3",
    artwork: "music/Birdbrain.jpg",
  },
  {
    title: "Chicago",
    artist: "MJ",
    audio: "music/Chicago - MJ.mp3",
    artwork: "music/Chicago.jpg",
  },
  {
    title: "Duvet",
    artist: "Bôa",
    audio: "music/Duvet - Bôa.mp3",
    artwork: "music/Duvet.jpg",
  },
  {
    title: "FIRE!!!",
    artist: "Vane & JamieP",
    audio: "music/FIRE!!!  - Vane & JamieP.mp3",
    artwork: "music/FIRE!!!.jpg",
  },
  {
    title: "Flatline",
    artist: "Justin Bieber",
    audio: "music/Flatline - Justin Bieber.mp3",
    artwork: "music/Flatline.jpg",
  },
  {
    title: "Heaven Can Wait",
    artist: "MJ",
    audio: "music/Heaven Can Wait - MJ.mp3",
    artwork: "music/HEaven.jpg",
  },
  {
    title: "House Of Balloons",
    artist: "The Weeknd",
    audio: "music/House Of Balloons - The Weeknd.mp3",
    artwork: "music/baloons.jpg",
  },
  {
    title: "Les",
    artist: "Childish Gambino",
    audio: "music/Les - Childish Gambino.mp3",
    artwork: "music/Les.jpg",
  },
  {
    title: "Machine Love",
    artist: "JaimeP",
    audio: "music/Machine Love - JaimeP.mp3",
    artwork: "music/Machine love.jpg",
  },
  {
    title: "No Pole",
    artist: "Don Toliver",
    audio: "music/No Pole - Don Toliver.mp3",
    artwork: "music/No pole.jpg",
  },
  {
    title: "NIGHTS LIKE THIS",
    artist: "The Kid LAROI",
    audio: "music/NIGHTS LIKE THIS - The Kid LAROI.mp3",
    artwork: "music/Night.jpg",
  },
  {
    title: "Pink + White",
    artist: "Frank Ocean",
    audio: "music/Pink White - Frank Ocean.mp3",
    artwork: "music/Pink.png",
  },
  {
    title: "Self Aware",
    artist: "Temper City",
    audio: "music/Self Aware - Temper City.mp3",
    artwork: "music/Self.webp",
  },
  {
    title: "Softcore",
    artist: "The Neighbourhood",
    audio: "music/Softcore - The Neighbourhood.mp3",
    artwork: "music/Softcore.jpg",
  },
  {
    title: "Stress Relief",
    artist: "Late Night Drive Home",
    audio: "music/Stress Relief - Late Night Drive Home.mp3",
    artwork: "music/Stress.png",
  },
  {
    title: "The Color Violet",
    artist: "Tory Lanez",
    audio: "music/The Color Violet  - Tory Lanez.mp3",
    artwork: "music/violet.jpg",
  },
  {
    title: "Usseewa",
    artist: "Ado",
    audio: "music/Usseewa - Adp.mp3",
    artwork: "music/usseewa.jpg",
  },
  {
    title: "Why'd You Only Call Me When You're High?",
    artist: "Arctic Monkeys",
    audio: "music/Why'd You Only Call Me When You're High - Arctic Monkeys.mp3",
    artwork: "music/high.jpg",
  },
  {
    title: "You",
    artist: "Lloyd",
    audio: "music/You - Lloyd.mp3",
    artwork: "music/you.jpg",
  },
];

let currentSongIndex = 0;

const musicAudio = document.getElementById("musicAudio");
const musicArt = document.getElementById("musicArt");
const musicName = document.getElementById("musicName");
const musicArtist = document.getElementById("musicArtist");
const musicProgress = document.getElementById("musicProgress");
const musicTime = document.getElementById("musicTime");
const musicDur = document.getElementById("musicDur");
const musicPlay = document.getElementById("musicPlay");
const musicPrev = document.getElementById("musicPrev");
const musicNext = document.getElementById("musicNext");
const musicPlaylist = document.getElementById("musicPlaylist");

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) return "0:00";

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}

function loadSong(index, autoplay = false) {
  if (!musicAudio || !musicData[index]) return;

  currentSongIndex = index;

  const song = musicData[index];

  musicAudio.src = song.audio;
  musicName.textContent = song.title;
  musicArtist.textContent = song.artist;
  musicArt.src = song.artwork;

  musicProgress.value = 0;
  musicTime.textContent = "0:00";
  musicDur.textContent = "0:00";

  renderPlaylist();

  if (autoplay) {
    musicAudio.play();
  }
}

function toggleMusic() {
  if (!musicAudio) return;

  if (musicAudio.paused) {
    musicAudio.play();
  } else {
    musicAudio.pause();
  }
}

function playPreviousSong() {
  if (musicData.length === 0) return;

  currentSongIndex =
    (currentSongIndex - 1 + musicData.length) % musicData.length;

  loadSong(currentSongIndex, true);
}

function playNextSong() {
  if (musicData.length === 0) return;

  currentSongIndex = (currentSongIndex + 1) % musicData.length;

  loadSong(currentSongIndex, true);
}

function renderPlaylist() {
  if (!musicPlaylist) return;

  musicPlaylist.innerHTML = "";

  musicData.forEach(function (song, index) {
    const item = document.createElement("div");

    item.className = "music-playlist-item";

    if (index === currentSongIndex) {
      item.classList.add("active");
    }

    item.innerHTML = `
      <img
        src="${song.artwork}"
        class="music-playlist-artwork"
        alt=""
      >
      <div class="music-playlist-info">
        <div class="music-playlist-song">${song.title}</div>
        <div class="music-playlist-artist">${song.artist}</div>
      </div>
    `;

    item.addEventListener("click", function () {
      loadSong(index, true);
    });

    musicPlaylist.appendChild(item);
  });
}

export function stopMusicPlayback() {
  if (!musicAudio) return;

  musicAudio.pause();

  if (musicPlay) {
    musicPlay.textContent = ">";
  }
}

export function initMusic() {
  if (!musicAudio) return;

  const musicWindow = document.getElementById("music");
  const musicCloseButton = musicWindow
    ? musicWindow.querySelector(".control-button.close")
    : null;

  if (musicCloseButton) {
    musicCloseButton.addEventListener("click", function () {
      stopMusicPlayback();
    });
  }

  if (musicPlay) {
    musicPlay.addEventListener("click", toggleMusic);
  }

  if (musicPrev) {
    musicPrev.addEventListener("click", playPreviousSong);
  }

  if (musicNext) {
    musicNext.addEventListener("click", playNextSong);
  }

  musicAudio.addEventListener("play", function () {
    if (musicPlay) {
      musicPlay.textContent = "II";
    }
  });

  musicAudio.addEventListener("pause", function () {
    if (musicPlay) {
      musicPlay.textContent = ">";
    }
  });

  musicAudio.addEventListener("timeupdate", function () {
    if (!musicAudio.duration) return;

    musicProgress.value = (musicAudio.currentTime / musicAudio.duration) * 100;

    musicTime.textContent = formatTime(musicAudio.currentTime);
  });

  musicAudio.addEventListener("loadedmetadata", function () {
    musicDur.textContent = formatTime(musicAudio.duration);
  });

  musicAudio.addEventListener("ended", function () {
    playNextSong();
  });

  if (musicProgress) {
    musicProgress.addEventListener("input", function () {
      if (!musicAudio.duration) return;

      musicAudio.currentTime =
        (musicProgress.value / 100) * musicAudio.duration;
    });
  }

  loadSong(0);
}
