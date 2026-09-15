/**
 * Three.js Graphics Engine & Post-Processing Pipeline
 * Optimized for vibrant, crisp kids visuals without overexposure!
 */
class GraphicsRenderer {
  constructor(container) {
    this.container = container;
    this.scene = new THREE.Scene();
    
    this.cameraMode = 0; // 0: Third-person, 1: Hood, 2: Drone
    this.camera = new THREE.PerspectiveCamera(56, window.innerWidth / window.innerHeight, 0.1, 350);
    this.baseFov = 56;
    this.currentFov = 56;

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(this.renderer.domElement);

    // Dynamic Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(this.ambientLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.85);
    this.dirLight.position.set(30, 60, 40);
    this.scene.add(this.dirLight);

    // Screen Shake state
    this.shakeIntensity = 0;
    this.shakeDecay = 5;

    // Post-processing setup
    this.initPostProcessing();

    window.addEventListener('resize', () => this.onResize());
  }

  initPostProcessing() {
    this.useBloom = false;
    try {
      if (typeof THREE.EffectComposer !== 'undefined' && typeof THREE.UnrealBloomPass !== 'undefined') {
        this.composer = new THREE.EffectComposer(this.renderer);
        const renderPass = new THREE.RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        // Safe bloom settings: threshold high enough so daytime sky and rainbow road do NOT blowout!
        this.bloomPass = new THREE.UnrealBloomPass(
          new THREE.Vector2(window.innerWidth, window.innerHeight),
          0.35,  // gentle strength
          0.4,   // radius
          0.85   // high threshold: only intense sparks & lights bloom!
        );
        this.composer.addPass(this.bloomPass);
        this.useBloom = true;
      }
    } catch (e) {
      console.warn("Postprocessing fallback to standard render", e);
      this.useBloom = false;
    }
  }

  applyMapLighting(mapConfig) {
    this.scene.background = new THREE.Color(mapConfig.skyColor);
    this.scene.fog = new THREE.Fog(mapConfig.fogColor, mapConfig.fogNear, mapConfig.fogFar);

    this.ambientLight.color.setHex(mapConfig.ambientColor);
    this.ambientLight.intensity = mapConfig.ambientIntensity || 0.8;

    this.dirLight.color.setHex(mapConfig.lightColor);
    this.dirLight.intensity = mapConfig.dirIntensity || 0.85;

    // Adjust bloom dynamically per theme
    if (this.bloomPass) {
      if (mapConfig.themeStyle === 'rainbow') {
        // Crisp colorful daytime: disable bloom blowout
        this.bloomPass.threshold = 0.92;
        this.bloomPass.strength = 0.25;
        this.renderer.toneMappingExposure = 1.0;
      } else if (mapConfig.themeStyle === 'cyberpunk') {
        this.bloomPass.threshold = 0.4;
        this.bloomPass.strength = 0.7;
        this.renderer.toneMappingExposure = 1.1;
      } else {
        this.bloomPass.threshold = 0.85;
        this.bloomPass.strength = 0.35;
        this.renderer.toneMappingExposure = 1.0;
      }
    }
  }

  triggerShake(intensity = 0.8) {
    this.shakeIntensity = Math.min(2.0, this.shakeIntensity + intensity);
  }

  toggleCameraMode() {
    this.cameraMode = (this.cameraMode + 1) % 3;
    return this.cameraMode;
  }

  updateCamera(carPosition, carRotation, isBoosting, dt) {
    // Dynamic FOV on boost
    const targetFov = isBoosting ? this.baseFov + 10 : this.baseFov;
    this.currentFov += (targetFov - this.currentFov) * 5 * dt;
    this.camera.fov = this.currentFov;
    this.camera.updateProjectionMatrix();

    // Screen Shake
    let shakeOffset = new THREE.Vector3(0, 0, 0);
    if (this.shakeIntensity > 0.01) {
      shakeOffset.set(
        (Math.random() - 0.5) * this.shakeIntensity * 0.6,
        (Math.random() - 0.5) * this.shakeIntensity * 0.4,
        (Math.random() - 0.5) * this.shakeIntensity * 0.3
      );
      this.shakeIntensity = Math.max(0, this.shakeIntensity - this.shakeDecay * dt);
    }

    if (this.cameraMode === 0) {
      // Third-Person Chase
      const idealOffset = new THREE.Vector3(carPosition.x * 0.35, 5.8, 11.0);
      const idealLookAt = new THREE.Vector3(carPosition.x * 0.65, 1.2, -18);

      this.camera.position.lerp(idealOffset.add(shakeOffset), 12 * dt);
      this.camera.lookAt(idealLookAt);
    } else if (this.cameraMode === 1) {
      // Hood View
      const hoodPos = new THREE.Vector3(carPosition.x, 2.1, carPosition.z - 0.8).add(shakeOffset);
      this.camera.position.copy(hoodPos);
      this.camera.lookAt(carPosition.x, 1.8, -35);
    } else {
      // Drone View
      const dronePos = new THREE.Vector3(carPosition.x * 0.2, 17, 16).add(shakeOffset);
      this.camera.position.lerp(dronePos, 10 * dt);
      this.camera.lookAt(0, 0, -12);
    }
  }

  render() {
    if (this.useBloom && this.composer) {
      this.composer.render();
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    if (this.composer) {
      this.composer.setSize(w, h);
    }
  }
}
