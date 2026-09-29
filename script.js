document.addEventListener("DOMContentLoaded", () => {
  // ================= 1. PRELOADER & TIMER LOGIC (4 Seconds) =================
  const loaderWrapper = document.getElementById("loader-wrapper");
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  
  let progress = 0;
  const duration = 4000; // ৪ সেকেন্ডের লোডিং সময়
  const intervalTime = 40; 
  const increment = 100 / (duration / intervalTime);

  const progressInterval = setInterval(() => {
    progress += increment;
    if (progress >= 100) {
      progress = 100;
      clearInterval(progressInterval);
      
      // লোডার হাইড করার আগে ফেড-আউট
      setTimeout(() => {
        if (loaderWrapper) {
          loaderWrapper.classList.add("loader-hidden");
        }
      }, 300);
    }
    
    if (progressBar) progressBar.style.width = `${progress}%`;
    if (progressText) progressText.innerText = `${Math.floor(progress)}%`;
  }, intervalTime);


  // ================= 2. AUTO-MUSIC PLAY & TOGGLE LOGIC =================
  const bgMusic = document.getElementById("bg-music");
  const audioToggleBtn = document.getElementById("audio-toggle-btn");
  const audioIcon = document.getElementById("audio-icon");
  const audioLabel = document.querySelector(".audio-label");

  function updateAudioUI(isPlaying) {
    if (audioIcon) audioIcon.innerText = isPlaying ? "🔊" : "🔇";
    if (audioLabel) audioLabel.innerText = isPlaying ? "Sound On" : "Sound Off";
  }

  // অটো গান চালু করার ফাংশন
  function startAutoPlay() {
    if (!bgMusic) return;

    bgMusic.play().then(() => {
      // সরাসরি সাউন্ড প্লে হলে UI আপডেট
      updateAudioUI(true);
    }).catch((error) => {
      // ব্রাউজার যদি স্ক্রিন টাচ ছাড়া সাউন্ড ব্লক করে, তবে ইউজার প্রথম যে কোনো জায়গায় ক্লিক বা টাচ করলে প্লে হবে
      updateAudioUI(false);

      const enableAudioOnUserInteraction = () => {
        bgMusic.play().then(() => {
          updateAudioUI(true);
        }).catch(() => {});

        // একবার প্লে হওয়ার পর এই লিসেনারগুলো রিমুভ করে দেওয়া হবে
        document.removeEventListener("click", enableAudioOnUserInteraction);
        document.removeEventListener("touchstart", enableAudioOnUserInteraction);
      };

      document.addEventListener("click", enableAudioOnUserInteraction);
      document.addEventListener("touchstart", enableAudioOnUserInteraction);
    });
  }

  // পেজ লোড হওয়ার সাথে সাথেই অটো মিউজিক চালু করার চেষ্টা করবে
  startAutoPlay();

  // মিউজিক ম্যানুয়ালি অন/অফ করার বাটন লজিক
  if (audioToggleBtn && bgMusic) {
    audioToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // ব্যাকগ্রাউন্ড টাচ ইভেন্ট বন্ধ করার জন্য

      if (bgMusic.paused) {
        bgMusic.play().then(() => {
          updateAudioUI(true);
        });
      } else {
        bgMusic.pause();
        updateAudioUI(false);
      }
    });
  }


  // ================= 3. FALLING FLORAL PETALS ANIMATION =================
  const canvas = document.getElementById("petals-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const petals = [];
    const petalCount = 25;

    class Petal {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        this.y = -20;
        this.size = Math.random() * 8 + 6;
        this.speedY = Math.random() * 1.2 + 0.8;
        this.speedX = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.6 + 0.3;
        this.rotation = Math.random() * 360;
        this.spin = Math.random() * 2 - 1;
      }

      update() {
        this.y += this.speedY;
        this.x += Math.sin(this.y * 0.01) + this.speedX;
        this.rotation += this.spin;

        if (this.y > canvas.height + 20) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate((this.rotation * Math.PI) / 180);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 182, 193, ${this.opacity})`;
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = 0; i < petalCount; i++) {
      petals.push(new Petal());
    }

    function animatePetals() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      petals.forEach((petal) => {
        petal.update();
        petal.draw();
      });
      requestAnimationFrame(animatePetals);
    }

    animatePetals();
  }
});