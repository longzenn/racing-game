/**
 * Input Manager - Supports Keyboard, Touch & Logitech G29 Steering Wheel
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

    // Analog Steering Wheel (Logitech G29)
    this.isWheelActive = false;
    this.wheelAnalogX = 0;
    this.wheelName = '';
    this.lastPaddleLeft = false;
    this.lastPaddleRight = false;

    this.initKeyboard();
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
    window.addEventListener('touchstart', () => this.audio.init(), { passive: true });
  }

  initGamepad() {
    window.addEventListener('gamepadconnected', (e) => {
      this.audio.init();
      this.wheelName = e.gamepad.id || 'Gamepad / Vô Lăng';
      const isG29 = /logitech|g29|g920|g923|wheel|driving/i.test(this.wheelName);
      
      // Notify player on screen
      const banner = document.getElementById('combo-banner');
      if (banner) {
        banner.innerText = isG29 ? '🎮 ĐÃ KẾT NỐI VÔ LĂNG LOGITECH G29!' : '🎮 ĐÃ KẾT NỐI TAY CẦM / VÔ LĂNG!';
        banner.classList.add('show');
        setTimeout(() => banner.classList.remove('show'), 2500);
      }
    });
  }

  bindTouchButtons(leftBtn, rightBtn) {
    if (leftBtn) {
      leftBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.init(); this.keys['arrowleft'] = true; });
      leftBtn.addEventListener('pointerup', (e) => { e.preventDefault(); this.keys['arrowleft'] = false; });
      leftBtn.addEventListener('pointerleave', () => { this.keys['arrowleft'] = false; });
    }
    if (rightBtn) {
      rightBtn.addEventListener('pointerdown', (e) => { e.preventDefault(); this.audio.init(); this.keys['arrowright'] = true; });
      rightBtn.addEventListener('pointerup', (e) => { e.preventDefault(); this.keys['arrowright'] = false; });
      rightBtn.addEventListener('pointerleave', () => { this.keys['arrowright'] = false; });
    }
  }

  update(dt) {
    this.brake = false;
    let steerInput = 0;
    if (this.keys['arrowleft'] || this.keys['a']) steerInput -= 1;
    if (this.keys['arrowright'] || this.keys['d']) steerInput += 1;

    // Check Gamepad / Logitech G29
    let wheelDetectedThisFrame = false;
    if (navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (gp) {
          // Logitech G29: Axis 0 is steering wheel
          if (gp.axes && gp.axes.length > 0) {
            const axisVal = gp.axes[0];
            // Deadzone of 0.04
            if (Math.abs(axisVal) > 0.04) {
              steerInput = axisVal;
              wheelDetectedThisFrame = true;
              this.isWheelActive = true;

              // True Analog Steering: maps wheel rotation angle directly to road X position!
              // Road width is 26, drivable half width is ~10.5
              const maxLateral = (CONFIG.ROAD_WIDTH / 2) - 2.5;
              this.wheelAnalogX = axisVal * maxLateral;
            }
          }

          // Logitech G29 Paddle Shifters:
          // Button 4 (Left Paddle) & Button 5 (Right Paddle)
          if (gp.buttons && gp.buttons.length > 5) {
            const paddleLeft = gp.buttons[4]?.pressed;
            const paddleRight = gp.buttons[5]?.pressed;

            if (paddleLeft && !this.lastPaddleLeft) {
              if (this.currentLane > 0) this.currentLane--;
              this.isWheelActive = false; // prioritize lane shift
            }
            if (paddleRight && !this.lastPaddleRight) {
              if (this.currentLane < CONFIG.LANES.length - 1) this.currentLane++;
              this.isWheelActive = false;
            }
            this.lastPaddleLeft = paddleLeft;
            this.lastPaddleRight = paddleRight;
          }

          // Brake pedal
          if (gp.buttons && (gp.buttons[1]?.pressed || gp.buttons[6]?.pressed)) {
            this.brake = true;
          }
        }
      }
    }

    // Discrete keyboard lane switching
    if (!wheelDetectedThisFrame) {
      if (steerInput < -0.4 && !this.isLaneSwitching) {
        if (this.currentLane > 0) this.currentLane--;
        this.isLaneSwitching = true;
        this.isWheelActive = false;
      } else if (steerInput > 0.4 && !this.isLaneSwitching) {
        if (this.currentLane < CONFIG.LANES.length - 1) this.currentLane++;
        this.isLaneSwitching = true;
        this.isWheelActive = false;
      } else if (Math.abs(steerInput) < 0.2) {
        this.isLaneSwitching = false;
      }
    }

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
    if (this.isWheelActive) {
      return this.wheelAnalogX;
    }
    return CONFIG.LANES[this.currentLane] || 0;
  }
}
