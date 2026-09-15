/**
 * Power-up Pickups (Nitro Canister, Coin Magnet, Energy Shield, 2X Multiplier)
 * Optimized with shared materials and high-contrast bloom rings (Zero dynamic lights)
 */
class PowerupManager {
  constructor(scene) {
    this.scene = scene;
    this.powerups = [];

    // Reusable Materials & Geometries
    this.ringGeo = new THREE.TorusGeometry(1.3, 0.08, 6, 20);
    this.whiteMetalMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
    this.silverMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9 });

    // 1. Nitro Materials
    this.nitroGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.6, 16);
    this.nitroMat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      emissive: 0x00c8ff,
      emissiveIntensity: 0.9,
      metalness: 0.9,
      roughness: 0.15
    });
    this.nitroCapGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 10);
    this.cyanGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.85 });

    // 2. Magnet Materials
    this.magnetTorusGeo = new THREE.TorusGeometry(0.8, 0.28, 10, 16, Math.PI);
    this.magnetMat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: 0xdd0022,
      emissiveIntensity: 0.85,
      metalness: 0.8,
      roughness: 0.2
    });
    this.magnetTipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    this.redGlowMat = new THREE.MeshBasicMaterial({ color: 0xff2244, transparent: true, opacity: 0.85 });

    // 3. Shield Materials
    this.shieldSphereGeo = new THREE.SphereGeometry(0.9, 16, 14);
    this.shieldMat = new THREE.MeshStandardMaterial({
      color: 0x3a86ff,
      emissive: 0x0066ff,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.88
    });
    this.blueGlowMat = new THREE.MeshBasicMaterial({ color: 0x00d2ff, transparent: true, opacity: 0.85 });

    // 4. Multiplier Materials
    this.starGeo = new THREE.OctahedronGeometry(0.95);
    this.multiplierMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff0066,
      emissiveIntensity: 0.95,
      metalness: 0.5,
      roughness: 0.2
    });
    this.pinkGlowMat = new THREE.MeshBasicMaterial({ color: 0xff0088, transparent: true, opacity: 0.85 });
  }

  spawnPowerup() {
    const laneIndex = Math.floor(Math.random() * CONFIG.LANES.length);
    const laneX = CONFIG.LANES[laneIndex];

    const types = ['nitro', 'magnet', 'shield', 'multiplier'];
    const pType = types[Math.floor(Math.random() * types.length)];

    let pGroup;
    if (pType === 'nitro') {
      pGroup = this.createNitroBottle();
    } else if (pType === 'magnet') {
      pGroup = this.createMagnetItem();
    } else if (pType === 'shield') {
      pGroup = this.createShieldItem();
    } else {
      pGroup = this.createMultiplierItem();
    }

    pGroup.position.set(laneX, 1.4, -CONFIG.VIEW_DISTANCE + 40);
    this.scene.add(pGroup);

    this.powerups.push({
      mesh: pGroup,
      type: pType,
      rotSpeed: 3.5,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  // --- 1. Nitro Boost Bottle (Cyan Glow) ---
  createNitroBottle() {
    const bottle = new THREE.Group();
    const can = new THREE.Mesh(this.nitroGeo, this.nitroMat);
    bottle.add(can);

    const cap = new THREE.Mesh(this.nitroCapGeo, this.whiteMetalMat);
    cap.position.y = 0.9;
    bottle.add(cap);

    // Glowing orbit ring
    const ring = new THREE.Mesh(this.ringGeo, this.cyanGlowMat);
    ring.rotation.x = Math.PI / 2;
    bottle.add(ring);

    return bottle;
  }

  // --- 2. Coin Magnet (Red Glow) ---
  createMagnetItem() {
    const magnet = new THREE.Group();
    const torus = new THREE.Mesh(this.magnetTorusGeo, this.magnetMat);
    torus.rotation.z = Math.PI;
    magnet.add(torus);

    const tL = new THREE.Mesh(this.magnetTipGeo, this.silverMat); tL.position.set(-0.8, 0, 0);
    const tR = new THREE.Mesh(this.magnetTipGeo, this.silverMat); tR.position.set(0.8, 0, 0);
    magnet.add(tL, tR);

    // Glowing orbit ring
    const ring = new THREE.Mesh(this.ringGeo, this.redGlowMat);
    magnet.add(ring);

    return magnet;
  }

  // --- 3. Energy Shield (Blue Bubble) ---
  createShieldItem() {
    const shield = new THREE.Group();
    const sphere = new THREE.Mesh(this.shieldSphereGeo, this.shieldMat);
    shield.add(sphere);

    // Glowing dual orbit rings
    const ring1 = new THREE.Mesh(this.ringGeo, this.blueGlowMat);
    ring1.rotation.x = Math.PI / 3;
    shield.add(ring1);

    const ring2 = new THREE.Mesh(this.ringGeo, this.cyanGlowMat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 2;
    shield.add(ring2);

    return shield;
  }

  // --- 4. 2X Multiplier Star (Pink Glow) ---
  createMultiplierItem() {
    const starGroup = new THREE.Group();
    const star = new THREE.Mesh(this.starGeo, this.multiplierMat);
    starGroup.add(star);

    // Glowing orbit ring
    const ring = new THREE.Mesh(this.ringGeo, this.pinkGlowMat);
    ring.rotation.x = Math.PI / 4;
    starGroup.add(ring);

    return starGroup;
  }

  update(playerSpeed, dt) {
    const moveDist = playerSpeed * dt;
    const nowTime = Date.now() * 0.006;

    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.mesh.position.z += moveDist;
      p.mesh.rotation.y += p.rotSpeed * dt;
      p.mesh.position.y = 1.4 + Math.sin(nowTime + p.bobOffset) * 0.3;

      if (p.mesh.position.z > 25) {
        this.scene.remove(p.mesh);
        this.powerups.splice(i, 1);
      }
    }
  }

  removePowerup(index) {
    if (this.powerups[index]) {
      this.scene.remove(this.powerups[index].mesh);
      this.powerups.splice(index, 1);
    }
  }

  clear() {
    for (let p of this.powerups) {
      this.scene.remove(p.mesh);
    }
    this.powerups = [];
  }
}
