/**
 * Master Game Controller & Loop (Kids Edition)
 */
class Game {
  constructor() {
    this.container = document.getElementById('canvas-container');
    
    // Core Subsystems
    this.audio = new AudioManager();
    this.input = new InputManager(this.audio);
    this.renderer = new GraphicsRenderer(this.container);
    this.road = new RoadManager(this.renderer.scene);
    this.env = new EnvironmentManager(this.renderer.scene);
    this.weather = new WeatherVFX(this.renderer.scene);
    this.playerCar = new Car(this.renderer.scene);
    this.traffic = new TrafficManager(this.renderer.scene);
    this.coins = new CoinManager(this.renderer.scene);
    this.obstacles = new ObstacleManager(this.renderer.scene);
    this.powerups = new PowerupManager(this.renderer.scene);
    this.vfx = new VFXManager(this.renderer.scene);
    this.hud = new HUDManager();

    // Default to Rainbow & Buggy
    this.currentMapId = 'rainbow';
    this.currentSpeedTier = CONFIG.SPEED_MODES.sport;

    // Menu Navigation
    this.menu = new MenuManager({
      onStartGame: (cfg) => this.startGame(cfg),
      onCarChange: (carId, colorHex) => {
        this.playerCar.buildCar(carId, colorHex);
      },
      onColorChange: (colorHex) => {
        this.playerCar.setPaintColor(colorHex);
      },
      onMapChange: (mapId) => {
        this.applyMap(mapId);
      },
      onSpeedChange: (speedId) => {
        this.currentSpeedTier = CONFIG.SPEED_MODES[speedId] || CONFIG.SPEED_MODES.sport;
      },
      onResume: () => this.resumeGame(),
      onRestart: () => this.restartGame(),
      onBackToMenu: () => this.backToMenu()
    });

    // Game State
    this.isGameActive = false;
    this.isPaused = false;
    this.score = 0;
    this.coinCount = 0;
    this.timeLeft = 90;
    this.currentSpeed = 0;
    this.comboCount = 1;
    this.comboTimer = 0;

    // Active powerups
    this.activePowerups = {
      nitro: null,
      magnet: null,
      shield: null,
      multiplier: null
    };

    // Spawning Timers
    this.coinTimer = 0;
    this.obstacleTimer = 0;
    this.trafficTimer = 0;
    this.powerupTimer = 0;

    this.clock = new THREE.Clock();

    this.bindTouchUI();
    this.initSoundToggle();
    this.applyMap('rainbow');
    this.playerCar.buildCar('buggy', 0xff3366);
    this.initPWA();
    this.warmupAssets();

    // Start Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  warmupAssets() {
    try {
      // Spawn 1 of each entity type to force WebGL pipeline to compile shaders
      this.coins.spawnCoin();
      this.obstacles.spawnObstacle();
      this.powerups.spawnPowerup();
      this.traffic.spawnCar(CONFIG.SPEED_MODES.sport);

      // Precompile shaders in GPU VRAM
      this.renderer.precompileShaders();

      // Clean up warmup objects cleanly
      this.coins.clear();
      this.obstacles.clear();
      this.powerups.clear();
      this.traffic.clear();
    } catch (e) {
      console.warn("Warmup notice:", e);
    }
  }

  initSoundToggle() {
    const soundBtn = document.getElementById('btn-sound-toggle');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const isMuted = this.audio.toggleMute();
        soundBtn.innerText = isMuted ? '🔇' : '🔊';
      });
    }
  }


  bindTouchUI() {
    this.input.bindTouchButtons(
      document.getElementById('touch-left'),
      document.getElementById('touch-right')
    );

    // Mobile pause button (only visible on touch devices via CSS media query)
    const mobilePauseBtn = document.getElementById('mobile-pause-btn');
    if (mobilePauseBtn) {
      mobilePauseBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.input.pausePressed = true;
      });
    }
  }

  initPWA() {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('./service-worker.js').catch(() => {});
      });
    }
  }

  applyMap(mapId) {
    this.currentMapId = mapId;
    const mapConfig = CONFIG.MAPS[mapId] || CONFIG.MAPS.rainbow;
    this.renderer.applyMapLighting(mapConfig);
    this.road.applyMapTheme(mapConfig);
    this.env.setTheme(mapConfig);
    this.weather.setWeather(mapConfig.weather, mapConfig);
  }

  startGame(cfg) {
    this.clock.getDelta(); // Clear any accumulated delta from menu pause
    this.audio.init();
    this.applyMap(cfg.mapId);
    this.currentSpeedTier = CONFIG.SPEED_MODES[cfg.speedId] || CONFIG.SPEED_MODES.sport;
    this.playerCar.buildCar(cfg.carId, cfg.colorHex);

    this.score = 0;
    this.coinCount = 0;
    this.timeLeft = 90;
    this.currentSpeed = this.currentSpeedTier.baseSpeed * 0.6;
    this.comboCount = 1;
    this.comboTimer = 0;

    // Reset entities
    this.traffic.clear();
    this.coins.clear();
    this.obstacles.clear();
    this.powerups.clear();
    this.vfx.clear();

    for (let k in this.activePowerups) {
      this.activePowerups[k] = null;
    }

    this.coinTimer = 0;
    this.obstacleTimer = 0;
    this.trafficTimer = 0;
    this.powerupTimer = 0;

    this.isGameActive = true;
    this.isPaused = false;

    this.hud.show();
    const mapConfig = CONFIG.MAPS[this.currentMapId] || CONFIG.MAPS.rainbow;
    this.audio.startBGM(mapConfig.musicStyle);
  }

  resumeGame() {
    this.isPaused = false;
    const mapConfig = CONFIG.MAPS[this.currentMapId] || CONFIG.MAPS.rainbow;
    this.audio.startBGM(mapConfig.musicStyle);
  }

  pauseGame() {
    this.isPaused = true;
    this.audio.stopEngine();
    this.audio.stopBGM();
    this.menu.showPause();
  }

  restartGame() {
    this.startGame({
      mapId: this.currentMapId,
      speedId: this.currentSpeedTier.id,
      carId: this.playerCar.carModelId,
      colorHex: this.playerCar.paintHex
    });
  }

  backToMenu() {
    this.isGameActive = false;
    this.isPaused = false;
    this.audio.stopEngine();
    this.audio.stopBGM();
    this.hud.hide();
    this.menu.showMainMenu();
  }

  endGame() {
    this.isGameActive = false;
    this.audio.stopEngine();
    this.audio.stopBGM();
    this.hud.hide();
    this.menu.showGameOver(this.score, this.coinCount);
  }

  animate() {
    requestAnimationFrame(this.animate);
    const dt = Math.min(this.clock.getDelta(), 0.1);

    if (this.input.consumePause() && this.isGameActive) {
      if (!this.isPaused) this.pauseGame();
      else { this.resumeGame(); this.menu.hidePause(); }
    }

    if (this.input.consumeCameraToggle()) {
      this.renderer.toggleCameraMode();
    }

    if (this.isPaused) {
      this.renderer.render();
      return;
    }

    if (!this.isGameActive) {
      // Gentle turntable rotation in Garage
      this.playerCar.group.rotation.y += 0.8 * dt;
      this.renderer.camera.position.set(0, 3.2, 7.0);
      this.renderer.camera.lookAt(0, 1.0, 0);
      this.renderer.render();
      return;
    }

    // --- GAMEPLAY UPDATE ---
    this.input.update(dt);

    // Speed: Nitro ONLY activates via collected powerup!
    const isNitro = !!this.activePowerups.nitro;
    const targetSpeed = isNitro ? this.currentSpeedTier.boostSpeed :
                        this.input.brake ? this.currentSpeedTier.baseSpeed * 0.5 :
                        this.currentSpeedTier.baseSpeed;

    const accelRate = isNitro ? 50 : (this.input.brake ? 60 : 30);
    this.currentSpeed += (targetSpeed - this.currentSpeed) * (accelRate / 100);

    // Visual & Sound effects when sprinting with Nitro powerup
    if (isNitro) {
      this.vfx.emitNitroFlames(this.playerCar.exhaustPoints, this.playerCar.group);
      if (Math.random() < 0.08) this.audio.playNitroSound();
    }
    if (Math.abs(this.input.steer) > 0.65) {
      this.vfx.emitDriftSmoke(this.playerCar.group);
    }

    // Engine Sound
    const normSpeed = this.currentSpeed / this.currentSpeedTier.boostSpeed;
    this.audio.updateEngineSound(normSpeed, isNitro, this.input.brake);

    // Time Countdown
    this.timeLeft -= dt;
    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      this.endGame();
      return;
    }

    // Combo Countdown
    if (this.comboCount > 1) {
      this.comboTimer -= dt;
      if (this.comboTimer <= 0) {
        this.comboCount = 1;
      }
    }

    // Active Powerups Countdown
    for (let k in this.activePowerups) {
      if (this.activePowerups[k]) {
        this.activePowerups[k].remaining -= dt;
        if (this.activePowerups[k].remaining <= 0) {
          this.activePowerups[k] = null;
        }
      }
    }

    // Update Entities
    const targetCarX = this.input.getTargetX();
    this.playerCar.update(targetCarX, this.currentSpeed, this.input.brake, dt);

    // Road curve: tilts road group like a banked curve, returns offset for camera
    const curveOffset = this.road.updateCurve(dt);
    this.road.update(this.currentSpeed, dt);

    // Environment parallax: shift scenery slower than camera for depth feel
    this.env.group.position.x += (-curveOffset * 0.3 - this.env.group.position.x) * 2.5 * dt;
    this.env.update(this.currentSpeed, dt);

    this.weather.update(this.currentSpeed, dt);
    this.vfx.update(dt);
    this.vfx.updateShield(this.playerCar.group.position, !!this.activePowerups.shield, dt);
    this._lastCurveOffset = curveOffset;

    // Traffic Near Miss
    this.traffic.update(this.currentSpeed, this.playerCar.group.position, dt, () => {
      this.score += 50 * this.currentSpeedTier.scoreMultiplier;
      this.hud.showNearMiss();
      this.audio.playNearMissSound();
    });

    const isMagnet = !!this.activePowerups.magnet;
    this.coins.update(this.currentSpeed, this.playerCar.group.position, isMagnet, dt);
    this.obstacles.update(this.currentSpeed, dt);
    this.powerups.update(this.currentSpeed, dt);

    // --- SPAWNING ---
    this.coinTimer += dt * 1000;
    if (this.coinTimer >= this.currentSpeedTier.coinFrequency) {
      this.coinTimer = 0;
      this.coins.spawnCoin();
    }

    this.obstacleTimer += dt * 1000;
    if (this.obstacleTimer >= this.currentSpeedTier.obstacleFrequency) {
      this.obstacleTimer = 0;
      this.obstacles.spawnObstacle();
    }

    this.trafficTimer += dt * 1000;
    if (this.trafficTimer >= this.currentSpeedTier.trafficFrequency) {
      this.trafficTimer = 0;
      this.traffic.spawnCar(this.currentSpeedTier);
    }

    this.powerupTimer += dt * 1000;
    if (this.powerupTimer >= this.currentSpeedTier.powerupFrequency) {
      this.powerupTimer = 0;
      this.powerups.spawnPowerup();
    }

    // --- COLLISIONS ---
    const carPos = this.playerCar.group.position;

    // 1. Coins
    for (let i = this.coins.coins.length - 1; i >= 0; i--) {
      const c = this.coins.coins[i];
      const dist = Math.hypot(carPos.x - c.mesh.position.x, carPos.z - c.mesh.position.z);
      if (dist < 3.2) {
        this.coinCount++;
        this.comboCount++;
        this.comboTimer = 3.5;
        this.hud.showCombo(this.comboCount);

        const pointBase = 10 * this.currentSpeedTier.scoreMultiplier * Math.min(this.comboCount, 8);
        const mult = this.activePowerups.multiplier ? 2 : 1;
        this.score += Math.round(pointBase * mult);

        this.vfx.createCoinBurst(c.mesh.position);
        this.audio.playCoinSound(this.comboCount);
        this.coins.removeCoin(i);
      }
    }

    // 2. Obstacles (Mushrooms / Barriers)
    for (let i = this.obstacles.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles.obstacles[i];
      const dist = Math.hypot(carPos.x - obs.mesh.position.x, carPos.z - obs.mesh.position.z);
      if (dist < 3.0) {
        if (this.activePowerups.shield) {
          // Bubble shield absorbs impact
          this.activePowerups.shield = null;
          this.audio.playShieldBreakSound();
          this.renderer.triggerShake(0.5);
          this.vfx.createCrashExplosion(obs.mesh.position);
          this.obstacles.removeObstacle(i);
        } else {
          this.score = Math.max(0, this.score - 30);
          this.timeLeft = Math.max(0, this.timeLeft - 2);
          this.comboCount = 1;
          this.currentSpeed *= 0.55;
          this.renderer.triggerShake(1.0);
          this.vfx.createCrashExplosion(obs.mesh.position);
          this.audio.playHitSound();
          this.obstacles.removeObstacle(i);
        }
      }
    }

    // 3. Traffic Cars
    for (let i = this.traffic.trafficCars.length - 1; i >= 0; i--) {
      const tc = this.traffic.trafficCars[i];
      const dist = Math.hypot(carPos.x - tc.mesh.position.x, carPos.z - tc.mesh.position.z);
      if (dist < 3.4) {
        if (this.activePowerups.shield) {
          this.activePowerups.shield = null;
          this.audio.playShieldBreakSound();
          this.renderer.triggerShake(0.6);
          this.vfx.createCrashExplosion(tc.mesh.position);
          this.traffic.trafficCars.splice(i, 1);
          this.renderer.scene.remove(tc.mesh);
        } else {
          this.score = Math.max(0, this.score - 50);
          this.timeLeft = Math.max(0, this.timeLeft - 3);
          this.comboCount = 1;
          this.currentSpeed *= 0.45;
          this.renderer.triggerShake(1.2);
          this.vfx.createCrashExplosion(tc.mesh.position);
          this.audio.playHitSound();
          this.traffic.trafficCars.splice(i, 1);
          this.renderer.scene.remove(tc.mesh);
        }
      }
    }

    // 4. Powerups (Nitro Rocket, Magnet, Bubble Shield, Multiplier)
    for (let i = this.powerups.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups.powerups[i];
      const dist = Math.hypot(carPos.x - p.mesh.position.x, carPos.z - p.mesh.position.z);
      if (dist < 3.2) {
        const pDef = CONFIG.POWERUPS[p.type];
        if (pDef) {
          this.activePowerups[p.type] = {
            ...pDef,
            remaining: pDef.duration
          };
          if (p.type === 'nitro') {
            this.audio.playNitroSound();
          }
        }
        this.audio.playPowerupSound();
        this.vfx.createCoinBurst(p.mesh.position);
        this.powerups.removePowerup(i);
      }
    }

    // Update HUD
    this.hud.update(
      this.score,
      this.coinCount,
      this.timeLeft,
      this.currentSpeed,
      this.currentSpeedTier,
      this.activePowerups
    );

    // Update Camera & Render
    this.renderer.updateCamera(this.playerCar.group.position, this.playerCar.group.rotation, isNitro, dt, this._lastCurveOffset || 0);
    this.renderer.render();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.gameInstance = new Game();
});
