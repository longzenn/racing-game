/**
 * Road Obstacles (Neon Mushroom Monsters, Cyber Laser Barriers, Oil Slicks)
 * Enhanced with warning decals, shadows and high contrast glowing lights
 */
class ObstacleManager {
  constructor(scene) {
    this.scene = scene;
    this.obstacles = [];

    // Reusable warning shadow circle (High-contrast shadow decal on road)
    this.shadowGeo = new THREE.CircleGeometry(1.6, 20);
    this.shadowMat = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.55,
      depthWrite: false
    });

    // Warning hazard ring
    this.warningRingGeo = new THREE.RingGeometry(1.5, 1.75, 24);
    this.warningRingMat = new THREE.MeshBasicMaterial({
      color: 0xff1100,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    });
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

    // Add high-contrast road shadow and warning ring for 3D depth
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

  // --- 1. Neon Mushroom Monster (High contrast glowing red & neon yellow) ---
  createNeonMushroom() {
    const mushroom = new THREE.Group();

    // Stem with dark outline feeling
    const stemGeo = new THREE.CylinderGeometry(0.55, 0.75, 1.4, 16);
    const stemMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xfff0bb,
      emissiveIntensity: 0.3,
      roughness: 0.3
    });
    const stem = new THREE.Mesh(stemGeo, stemMat);
    stem.position.y = 0.7;
    mushroom.add(stem);

    // Glowing Cap
    const capGeo = new THREE.SphereGeometry(1.4, 20, 16);
    const capMat = new THREE.MeshStandardMaterial({
      color: 0xff0033,
      emissive: 0xee0011,
      emissiveIntensity: 0.75,
      roughness: 0.2
    });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.scale.set(1.2, 0.7, 1.2);
    cap.position.y = 1.4;
    mushroom.add(cap);

    // Glowing Yellow Spots
    const spotGeo = new THREE.SphereGeometry(0.28, 8, 8);
    const spotMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    [[0, 2.0, 0.9], [0.75, 1.8, -0.6], [-0.75, 1.8, -0.6]].forEach(pos => {
      const spot = new THREE.Mesh(spotGeo, spotMat);
      spot.position.set(...pos);
      mushroom.add(spot);
    });

    // Cartoon Eyes
    const eyeGeo = new THREE.SphereGeometry(0.35, 10, 10);
    const eyeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const pupilGeo = new THREE.SphereGeometry(0.18, 8, 8);
    const pupilMat = new THREE.MeshBasicMaterial({ color: 0x000000 });

    const lEye = new THREE.Mesh(eyeGeo, eyeMat); lEye.position.set(-0.45, 1.2, -1.0);
    const lPupil = new THREE.Mesh(pupilGeo, pupilMat); lPupil.position.set(-0.45, 1.2, -1.25);
    const rEye = new THREE.Mesh(eyeGeo, eyeMat); rEye.position.set(0.45, 1.2, -1.0);
    const rPupil = new THREE.Mesh(pupilGeo, pupilMat); rPupil.position.set(0.45, 1.2, -1.25);
    mushroom.add(lEye, lPupil, rEye, rPupil);

    // Red warning point-light for dynamic illumination
    const light = new THREE.PointLight(0xff0033, 1.2, 8);
    light.position.set(0, 1.5, 0);
    mushroom.add(light);

    return mushroom;
  }

  // --- 2. Cyber Laser Barrier ---
  createLaserBarrier() {
    const barrier = new THREE.Group();

    // Side pylons (Bright orange-black striped)
    const pylonGeo = new THREE.BoxGeometry(0.6, 2.2, 0.6);
    const pylonMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      emissive: 0xff4400,
      emissiveIntensity: 0.4,
      metalness: 0.8
    });

    const pL = new THREE.Mesh(pylonGeo, pylonMat); pL.position.set(-2.0, 1.1, 0);
    const pR = new THREE.Mesh(pylonGeo, pylonMat); pR.position.set(2.0, 1.1, 0);
    barrier.add(pL, pR);

    // Glowing Laser Beam
    const beamGeo = new THREE.CylinderGeometry(0.16, 0.16, 4.0, 12);
    const beamMat = new THREE.MeshBasicMaterial({ color: 0xff0044 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.rotation.z = Math.PI / 2;
    beam.position.set(0, 1.2, 0);
    barrier.add(beam);

    // Laser Light
    const light = new THREE.PointLight(0xff0044, 1.4, 9);
    light.position.set(0, 1.2, 0);
    barrier.add(light);

    return barrier;
  }

  // --- 3. Slippery Oil Slick (High-contrast gloss black with iridescent edge) ---
  createOilSlick() {
    const oil = new THREE.Group();
    const geo = new THREE.CircleGeometry(1.8, 20);
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0f,
      emissive: 0x1a0933,
      emissiveIntensity: 0.4,
      roughness: 0.05,
      metalness: 0.95
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.position.y = 0.05;
    oil.add(mesh);

    // Iridescent neon purple hazard ring
    const ringGeo = new THREE.RingGeometry(1.7, 1.9, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xbb00ff, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
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
