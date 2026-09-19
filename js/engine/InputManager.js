/**
 * Input Manager - Keyboard, Swipe Touch, & Logitech G29 Steering Wheel
 * Mobile: Swipe left/right to change lanes + Tap pause zone (top-center)
 * Wheel: Discrete lane-snap when axis crosses threshold
 */
class InputManager {
  constructor(audioManager) {
    this.audio = audioManager;
    this.keys = {};
    this.steer = 0;
    this.brake = false;
    this.pausePressed = false;
    this.cameraTogglePressed = false;

    // 5 lanes: [-10, -5, 0, 5, 10] (default center: 2)
    this.currentLane = 2;
    this.isLaneSwitching = false;

    // Touch swipe tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.swipeThreshold = 40; // px to count as a swipe

    // Logitech G29 Wheel state
    this.isWheelActive = false;
    this.wheelName = '';
    this.lastPaddleLeft = false;
    this.lastPaddleRight = false;
    // Discrete lane snap from wheel axis
    this.lastWheelLane = 2;
    this.wheelAxisDeadzone = 0.15; // must cross this to snap a lane

    this.initKeyboard();
    this.initSwipeTouch();
    this.initGamepad();
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      this.audio.init();
      this.keys[e.key.toLowerCase()] = true;
      this.keys[e.code] = true;

      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        this.pausePressed = true;
      }
      if (e.key === 'c' || e.key === 'C') {
        this.cameraTogglePressed = true;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
      this.keys[e.code] = false;
    });

    window.addEventListener('mousedown', () => this.audio.init());
  }

  // --- Swipe-to-change-lane touch system ---
  initSwipeTouch() {
    const canvas = document.getElementById('canvas-container');
    if (!canvas) return;

    canvas.addEventListener('touchstart', (e) => {
      this.audio.init();
      const touch = e.changedTouches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
    }, { passive: true });

    canvas.addEventListener('touchend', (e) => {
      const touch = e.changedTouches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;

      // Only trigger swipe if horizontal movement dominates
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.swipeThreshold) {
        if (dx < 0) {
          // Swipe LEFT -> move to left lane
          if (this.currentLane > 0) this.currentLane--;
        } else {
          // Swipe RIGHT -> move to right lane
          if (this.currentLane < CONFIG.LANES.length - 1) this.currentLane++;
        }
      }

      // Tap top-center 15% of screen = Pause (even without physical button)
      const screenH = window.innerHeight;
      const screenW = window.innerWidth;
      const tapDist = Math.hypot(dx, dy);
      if (tapDist < 20) {
        const relY = touch.clientY / screenH;
        const relX = touch.clientX / screenW;
        // Top-center zone: top 20% of screen, middle 30%
        if (relY < 0.20 && relX > 0.35 && relX < 0.65) {
          this.pausePressed = true;
        }
      }
    }, { passive: true });
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.audio.init();
      this.wheelName = e.gamepad.id || 'Gamepad / Vô Lăng';
      const isG29 = /logitech|g29|g920|g923|wheel|driving/i.test(this.wheelName);

      // Notify player
      const banner = document.getElementById('combo-banner');
      if (banner) {
        banner.innerText = isG29 ? '🎮 ĐÃ KẾT NỐI VÔ LĂNG LOGITECH G29!' : '🎮 ĐÃ KẾT NỐI TAY CẦM!';
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
      }
    });
  }

  bindTouchButtons(leftBtn, rightBtn) {
    // Keep virtual buttons for accessibility, but now swipe is the primary touch input
    if (leftBtn) {
      leftBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.audio.init();
        if (this.currentLane > 0 && !this.isLaneSwitching) {
          this.currentLane--;
          this.isLaneSwitching = true;
        }
      });
      leftBtn.addEventListener('pointerup', () => { this.isLaneSwitching = false; });
      leftBtn.addEventListener('pointerleave', () => { this.isLaneSwitching = false; });
    }
    if (rightBtn) {
      rightBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        this.audio.init();
        if (this.currentLane < CONFIG.LANES.length - 1 && !this.isLaneSwitching) {
          this.currentLane++;
          this.isLaneSwitching = true;
        }
      });
      rightBtn.addEventListener('pointerup', () => { this.isLaneSwitching = false; });
      rightBtn.addEventListener('pointerleave', () => { this.isLaneSwitching = false; });
    }
  }

  update(dt) {
    this.brake = false;
    let steerInput = 0;
    if (this.keys['arrowleft'] || this.keys['a']) steerInput -= 1;
    if (this.keys['arrowright'] || this.keys['d']) steerInput += 1;

    // Check Gamepad / Logitech G29
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        // --- Discrete Lane Snap from wheel axis ---
        // Map axis -1..1 into lane index 0..4 and snap when crossing lane boundary
        if (gp.axes && gp.axes.length > 0) {
          const axisVal = gp.axes[0];
          this.isWheelActive = true;

          // Map axis value (-1 to +1) to lane index (0 to LANES.length-1)
          // Add deadzone in center: axis < deadzone stays in center lane
          const absAxis = Math.abs(axisVal);
          let targetLane;
          if (absAxis < this.wheelAxisDeadzone) {
            targetLane = 2; // Center lane
          } else {
            // Map ±deadzone..±1 → proportional lane position
            const normalized = (axisVal - Math.sign(axisVal) * this.wheelAxisDeadzone)
                             / (1 - this.wheelAxisDeadzone);
            // normalized ranges -1..+1, map to 0..4
            targetLane = Math.round((normalized + 1) * 0.5 * (CONFIG.LANES.length - 1));
            targetLane = Math.max(0, Math.min(CONFIG.LANES.length - 1, targetLane));
          }

          // Only snap lane when target changes (prevents constant re-snap)
          if (targetLane !== this.lastWheelLane) {
            this.currentLane = targetLane;
            this.lastWheelLane = targetLane;
          }

          steerInput = axisVal; // For body lean visual
        }

        // Paddle Shifters: Button 4 (Left) & Button 5 (Right) - snap one lane
        if (gp.buttons && gp.buttons.length > 5) {
          const paddleLeft  = gp.buttons[4]?.pressed;
          const paddleRight = gp.buttons[5]?.pressed;

          if (paddleLeft && !this.lastPaddleLeft) {
            if (this.currentLane > 0) {
              this.currentLane--;
              this.lastWheelLane = this.currentLane;
            }
          }
          if (paddleRight && !this.lastPaddleRight) {
            if (this.currentLane < CONFIG.LANES.length - 1) {
              this.currentLane++;
              this.lastWheelLane = this.currentLane;
            }
          }
          this.lastPaddleLeft  = paddleLeft;
          this.lastPaddleRight = paddleRight;
        }

        // Brake pedal
        if (gp.buttons && (gp.buttons[1]?.pressed || gp.buttons[6]?.pressed)) {
          this.brake = true;
        }
      }
    }

    // Discrete keyboard lane switching (when wheel not active)
    if (!this.isWheelActive) {
      if (steerInput < -0.4 && !this.isLaneSwitching) {
        if (this.currentLane > 0) this.currentLane--;
        this.isLaneSwitching = true;
      } else if (steerInput > 0.4 && !this.isLaneSwitching) {
        if (this.currentLane < CONFIG.LANES.length - 1) this.currentLane++;
        this.isLaneSwitching = true;
      } else if (Math.abs(steerInput) < 0.2) {
        this.isLaneSwitching = false;
      }
    }

    // Smooth steer for visual body lean
    this.steer += (steerInput - this.steer) * 12 * dt;

    const keyBrake = !!(this.keys['arrowdown'] || this.keys['s']);
    this.brake = this.brake || keyBrake;
  }

  consumePause() {
    const val = this.pausePressed;
    this.pausePressed = false;
    return val;
  }

  consumeCameraToggle() {
    const val = this.cameraTogglePressed;
    this.cameraTogglePressed = false;
    return val;
  }

  getTargetX() {
    // Always use lane-based discrete positioning (wheel snaps lanes now too)
    return CONFIG.LANES[this.currentLane] || 0;
  }
}
