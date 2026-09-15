/**
 * Menu & UI Navigation Manager (Kids Edition)
 */
class MenuManager {
  constructor(callbacks) {
    this.callbacks = callbacks;

    // Kids defaults: Rainbow map, Buggy cute car!
    this.selectedMap = 'rainbow';
    this.selectedSpeed = 'sport';
    this.selectedCar = 'buggy';
    this.selectedColor = 0xff3366;

    this.mainMenu = document.getElementById('main-menu');
    this.pauseModal = document.getElementById('pause-modal');
    this.gameoverModal = document.getElementById('gameover-modal');

    this.installPrompt = null;
    this.initPWAInstall();
    this.initMenuControls();
    this.loadHighScore();
  }

  initPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.installPrompt = e;
      const installBtns = document.querySelectorAll('.btn-windows-install');
      installBtns.forEach(btn => btn.style.display = 'inline-flex');
    });

    const installBtns = document.querySelectorAll('.btn-windows-install');
    installBtns.forEach(btn => {
      btn.addEventListener('click', async () => {
        if (this.installPrompt) {
          this.installPrompt.prompt();
          const { outcome } = await this.installPrompt.userChoice;
          if (outcome === 'accepted') {
            this.installPrompt = null;
            btn.style.display = 'none';
          }
        } else {
          alert('Để cài game thành App trên Windows 11:\n1. Bấm biểu tượng Cài đặt ở thanh địa chỉ trình duyệt\n2. Hoặc mở menu trình duyệt -> Ứng dụng -> Cài đặt trang web này thành ứng dụng.');
        }
      });
    });
  }

  initMenuControls() {
    // 1. Map Selection Cards
    const mapCards = document.querySelectorAll('.map-card');
    mapCards.forEach(card => {
      card.addEventListener('click', () => {
        mapCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedMap = card.dataset.map;
        if (this.callbacks.onMapChange) this.callbacks.onMapChange(this.selectedMap);
      });
    });

    // 2. Speed / Difficulty Cards
    const speedCards = document.querySelectorAll('.speed-card');
    speedCards.forEach(card => {
      card.addEventListener('click', () => {
        speedCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedSpeed = card.dataset.speed;
        if (this.callbacks.onSpeedChange) this.callbacks.onSpeedChange(this.selectedSpeed);
      });
    });

    // 3. Car Model Cards
    const carCards = document.querySelectorAll('.car-card');
    carCards.forEach(card => {
      card.addEventListener('click', () => {
        carCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedCar = card.dataset.car;
        if (this.callbacks.onCarChange) this.callbacks.onCarChange(this.selectedCar, this.selectedColor);
      });
    });

    // 4. Color Palette Dots
    const colorDots = document.querySelectorAll('.color-dot');
    colorDots.forEach(dot => {
      dot.addEventListener('click', () => {
        colorDots.forEach(d => d.classList.remove('selected'));
        dot.classList.add('selected');
        this.selectedColor = parseInt(dot.dataset.color, 16);
        if (this.callbacks.onColorChange) this.callbacks.onColorChange(this.selectedColor);
      });
    });

    // 5. Start Game Button
    const startBtn = document.getElementById('btn-start-game');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.hideAllMenus();
        if (this.callbacks.onStartGame) {
          this.callbacks.onStartGame({
            mapId: this.selectedMap,
            speedId: this.selectedSpeed,
            carId: this.selectedCar,
            colorHex: this.selectedColor
          });
        }
      });
    }

    // 6. Pause Modal Buttons
    const resumeBtn = document.getElementById('btn-resume');
    if (resumeBtn) {
      resumeBtn.addEventListener('click', () => {
        this.hidePause();
        if (this.callbacks.onResume) this.callbacks.onResume();
      });
    }
    const restartBtn = document.getElementById('btn-restart');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.hidePause();
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      });
    }
    const menuBtn = document.getElementById('btn-menu');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        this.hideAllMenus();
        if (this.callbacks.onBackToMenu) this.callbacks.onBackToMenu();
        else this.showMainMenu();
      });
    }

    // 7. Game Over Modal Buttons
    const playAgainBtn = document.getElementById('btn-play-again');
    if (playAgainBtn) {
      playAgainBtn.addEventListener('click', () => {
        this.hideGameOver();
        if (this.callbacks.onRestart) this.callbacks.onRestart();
      });
    }
    const goMenuBtn = document.getElementById('btn-gameover-menu');
    if (goMenuBtn) {
      goMenuBtn.addEventListener('click', () => {
        this.hideAllMenus();
        if (this.callbacks.onBackToMenu) this.callbacks.onBackToMenu();
        else this.showMainMenu();
      });
    }

    // Fullscreen toggle
    const fsBtn = document.getElementById('btn-fullscreen');
    if (fsBtn) {
      fsBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
      });
    }
  }

  showMainMenu() {
    this.hideAllMenus();
    if (this.mainMenu) this.mainMenu.style.display = 'flex';
    this.loadHighScore();
  }

  showPause() {
    if (this.pauseModal) this.pauseModal.style.display = 'flex';
  }

  hidePause() {
    if (this.pauseModal) this.pauseModal.style.display = 'none';
  }

  showGameOver(score, coins) {
    this.hideAllMenus();
    if (this.gameoverModal) this.gameoverModal.style.display = 'flex';

    const scoreEl = document.getElementById('final-score-val');
    const coinsEl = document.getElementById('final-coins-val');
    const highEl = document.getElementById('final-highscore-val');

    if (scoreEl) scoreEl.innerText = score.toLocaleString();
    if (coinsEl) coinsEl.innerText = coins;

    const currentHigh = this.getHighScore();
    if (score > currentHigh) {
      this.saveHighScore(score);
      if (highEl) highEl.innerHTML = `🎉 KỶ LỤC MỚI CỦA BÉ: ${score.toLocaleString()} ⭐`;
    } else {
      if (highEl) highEl.innerText = `Điểm kỷ lục: ${currentHigh.toLocaleString()}`;
    }
  }

  hideGameOver() {
    if (this.gameoverModal) this.gameoverModal.style.display = 'none';
  }

  hideAllMenus() {
    if (this.mainMenu) this.mainMenu.style.display = 'none';
    if (this.pauseModal) this.pauseModal.style.display = 'none';
    if (this.gameoverModal) this.gameoverModal.style.display = 'none';
  }

  getHighScore() {
    return parseInt(localStorage.getItem('cyber_racer_highscore') || '0', 10);
  }

  saveHighScore(val) {
    localStorage.setItem('cyber_racer_highscore', val.toString());
  }

  loadHighScore() {
    const high = this.getHighScore();
    const hsEls = document.querySelectorAll('.menu-highscore-val');
    hsEls.forEach(el => el.innerText = high.toLocaleString());
  }
}
