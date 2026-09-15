/**
 * Road Obstacles (Neon Mushroom Monsters, Cyber Laser Barriers, Oil Slicks)
 * Optimized with cached geometries, warning decals and high-contrast bloom materials
 */
class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = [];

    // Reusable warning decals
    this.shadowGeo = new THREE.CircleGeometry(1.6, 16);
    this.shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    this.warningRingGeo = new THREE.RingGeometry(1.5, 1.75, 20);
    this.warningRingMat = new THREE.MeshBasicMaterial({
      color: 0xff1100,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });

    // 1. Mushroom cached assets
    this.mushStemGeo = new THREE.CylinderGeometry(0.55, 0.75, 1.4, 14);
    this.mushStemMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff0bb,
      emissiveIntensity: 0.3,
      roughness: 0.3
    });
    this.mushCapGeo = new THREE.SphereGeometry(1.4, 18, 14);
    this.mushCapMat = new THREE.MeshStandardMaterial({
      color: 0xff0033,
      emissive: 0xee0011,
      emissiveIntensity: 0.85,
      roughness: 0.2
    });
    this.mushSpotGeo = new THREE.SphereGeometry(0.28, 6, 6);
    this.mushSpotMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    this.whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    this.blackMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    this.eyeGeo = new THREE.SphereGeometry(0.35, 8, 8);
    this.pupilGeo = new THREE.SphereGeometry(0.18, 6, 6);

    // 2. Barrier cached assets
    this.pylonGeo = new THREE.BoxGeometry(0.6, 2.2, 0.6);
    this.pylonMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xff4400,
      emissiveIntensity: 0.4,
      metalness: 0.8
    });
    this.laserBeamGeo = new THREE.CylinderGeometry(0.16, 0.16, 4.0, 10);
    this.laserBeamMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });

    // 3. Oil slick cached assets
    this.oilGeo = new THREE.CircleGeometry(1.8, 16);
    this.oilMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      emissive: 0x1a0933,
      emissiveIntensity: 0.4,
      roughness: 0.05,
      metalness: 0.95
    });
    this.oilRingGeo = new THREE.RingGeometry(1.7, 1.9, 20);
    this.oilRingMat = new THREE.MeshBasicMaterial({ color: 0xbb00ff, side: THREE.DoubleSide });
  }

  spawnObstacle() {
    const laneIndex = Math.floor(Math.random() * CONFIG.LANES.length);
    const laneX = CONFIG.LANES[laneIndex];

    const typeRoll = Math.random();
    let obsGroup;
    let obsType = 'mushroom';

    if (typeRoll < 0.6) {
      obsType = 'mushroom';
      obsGroup = this.createNeonMushroom();
    } else if (typeRoll < 0.85) {
      obsType = 'barrier';
      obsGroup = this.createLaserBarrier();
    } else {
      obsType = 'oil';
      obsGroup = this.createOilSlick();
    }

    // Add road shadow and warning ring for 3D depth
    const shadow = new THREE.Mesh(this.shadowGeo, this.shadowMat);
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.y = 0.03;
    obsGroup.add(shadow);

    const warnRing = new THREE.Mesh(this.warningRingGeo, this.warningRingMat);
    warnRing.rotation.x = -Math.PI / 2;
    warnRing.position.y = 0.04;
    obsGroup.add(warnRing);

    obsGroup.position.set(laneX, 0, -CONFIG.VIEW_DISTANCE + 40);
    this.scene.add(obsGroup);

    this.obstacles.push({
      mesh: obsGroup,
      type: obsType,
      bouncePhase: Math.random() * Math.PI * 2
    });
  }

  // --- 1. Neon Mushroom Monster ---
  createNeonMushroom() {
    const mushroom = new THREE.Group();

    const stem = new THREE.Mesh(this.mushStemGeo, this.mushStemMat);
    stem.position.y = 0.7;
    mushroom.add(stem);

    const cap = new THREE.Mesh(this.mushCapGeo, this.mushCapMat);
    cap.scale.set(1.2, 0.7, 1.2);
    cap.position.y = 1.4;
    mushroom.add(cap);

    // Glowing Yellow Spots
    [[0, 2.0, 0.9], [0.75, 1.8, -0.6], [-0.75, 1.8, -0.6]].forEach(pos => {
      const spot = new THREE.Mesh(this.mushSpotGeo, this.mushSpotMat);
      spot.position.set(...pos);
      mushroom.add(spot);
    });

    // Cartoon Eyes
    const lEye = new THREE.Mesh(this.eyeGeo, this.whiteMat); lEye.position.set(-0.45, 1.2, -1.0);
    const lPupil = new THREE.Mesh(this.pupilGeo, this.blackMat); lPupil.position.set(-0.45, 1.2, -1.25);
    const rEye = new THREE.Mesh(this.eyeGeo, this.whiteMat); rEye.position.set(0.45, 1.2, -1.0);
    const rPupil = new THREE.Mesh(this.pupilGeo, this.blackMat); rPupil.position.set(0.45, 1.2, -1.25);
    mushroom.add(lEye, lPupil, rEye, rPupil);

    return mushroom;
  }

  // --- 2. Cyber Laser Barrier ---
  createLaserBarrier() {
    const barrier = new THREE.Group();

    const pL = new THREE.Mesh(this.pylonGeo, this.pylonMat); pL.position.set(-2.0, 1.1, 0);
    const pR = new THREE.Mesh(this.pylonGeo, this.pylonMat); pR.position.set(2.0, 1.1, 0);
    barrier.add(pL, pR);

    const beam = new THREE.Mesh(this.laserBeamGeo, this.laserBeamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 1.2, 0);
    barrier.add(beam);

    return barrier;
  }

  // --- 3. Slippery Oil Slick ---
  createOilSlick() {
    const oil = new THREE.Group();
    const mesh = new THREE.Mesh(this.oilGeo, this.oilMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.05;
    oil.add(mesh);

    const ring = new THREE.Mesh(this.oilRingGeo, this.oilRingMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.06;
    oil.add(ring);

    return oil;
  }

  update(playerSpeed, dt) {
    const moveDist = playerSpeed * dt;

    for (let i = this.obstacles.length - 1; i >= 0; i--) {
      const obs = this.obstacles[i];
      obs.mesh.position.z += moveDist;

      // Animate mushroom bounce
      if (obs.type === 'mushroom') {
        obs.bouncePhase += 6 * dt;
        const squish = Math.sin(obs.bouncePhase);
        obs.mesh.scale.y = 1.0 + squish * 0.15;
        obs.mesh.position.y = Math.max(0, squish * 0.2);
      }

      // Recycle if behind player
      if (obs.mesh.position.z > 25) {
        this.scene.remove(obs.mesh);
        this.obstacles.splice(i, 1);
      }
    }
  }

  removeObstacle(index) {
    if (this.obstacles[index]) {
      this.scene.remove(this.obstacles[index].mesh);
      this.obstacles.splice(index, 1);
    }
  }

  clear() {
    for (let obs of this.obstacles) {
      this.scene.remove(obs.mesh);
    }
    this.obstacles = [];
  }
}
