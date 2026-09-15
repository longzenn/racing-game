/**
 * Power-up Pickups (Nitro Canister, Coin Magnet, Energy Shield, 2X Multiplier)
 * Each pickup has a coloured point-light for visibility + glow contrast.
 */
class PowerupManager {
  constructor(scene) {
    this.scene = scene;
    this.powerups = [];
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

  _addGlowLight(group, color, intensity, distance) {
    const light = new THREE.PointLight(color, intensity, distance);
    group.add(light);
    return light;
  }

  _addOuterRing(group, radius, color) {
    const geo = new THREE.TorusGeometry(radius, 0.07, 8, 28);
    const mat = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 });
    const mesh = new THREE.Mesh(geo, mat);
    group.add(mesh);
    return mesh;
  }

  // --- 1. Nitro Boost Bottle (Cyan) ---
  createNitroBottle() {
    const bottle = new THREE.Group();

    const canGeo = new THREE.CylinderGeometry(0.65, 0.65, 1.6, 16);
    const canMat = new THREE.MeshStandardMaterial({
      color: 0x00f2ff,
      emissive: 0x00ccff,
      emissiveIntensity: 0.85,
      metalness: 0.9,
      roughness: 0.15
    });
    bottle.add(new THREE.Mesh(canGeo, canMat));

    const capGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.4, 12);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.8 });
    const cap = new THREE.Mesh(capGeo, capMat);
    cap.position.y = 0.9;
    bottle.add(cap);

    // Outer orbit ring
    const ring = this._addOuterRing(bottle, 1.3, 0x00f2ff);
    ring.rotation.x = Math.PI / 2;

    // Glow light (cyan)
    this._addGlowLight(bottle, 0x00f2ff, 1.5, 10);

    return bottle;
  }

  // --- 2. Coin Magnet (Red with silver tips) ---
  createMagnetItem() {
    const magnet = new THREE.Group();

    const torusGeo = new THREE.TorusGeometry(0.8, 0.28, 12, 16, Math.PI);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0xff1133,
      emissive: 0xdd0022,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.z = Math.PI;
    magnet.add(torus);

    const tipGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    const tipMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9 });
    const tL = new THREE.Mesh(tipGeo, tipMat); tL.position.set(-0.8, 0, 0);
    const tR = new THREE.Mesh(tipGeo, tipMat); tR.position.set(0.8, 0, 0);
    magnet.add(tL, tR);

    // Outer orbit ring
    this._addOuterRing(magnet, 1.3, 0xff3344);

    // Glow light (red)
    this._addGlowLight(magnet, 0xff2233, 1.5, 10);

    return magnet;
  }

  // --- 3. Energy Shield (Blue sphere) ---
  createShieldItem() {
    const shield = new THREE.Group();

    const sphereGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const sphereMat = new THREE.MeshStandardMaterial({
      color: 0x3a86ff,
      emissive: 0x0055ff,
      emissiveIntensity: 0.9,
      transparent: true,
      opacity: 0.88
    });
    shield.add(new THREE.Mesh(sphereGeo, sphereMat));

    // Two orbiting rings at different angles
    const ring1Geo = new THREE.TorusGeometry(1.3, 0.09, 8, 24);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x00f2ff });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    shield.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(1.3, 0.09, 8, 24);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0x88ddff });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3;
    ring2.rotation.y = Math.PI / 2;
    shield.add(ring2);

    // Glow light (blue)
    this._addGlowLight(shield, 0x3366ff, 1.5, 10);

    return shield;
  }

  // --- 4. 2X Multiplier Star (Hot Pink octahedron) ---
  createMultiplierItem() {
    const starGroup = new THREE.Group();

    const starGeo = new THREE.OctahedronGeometry(0.95);
    const starMat = new THREE.MeshStandardMaterial({
      color: 0xff007f,
      emissive: 0xff0066,
      emissiveIntensity: 0.9,
      metalness: 0.5,
      roughness: 0.2
    });
    starGroup.add(new THREE.Mesh(starGeo, starMat));

    // Outer sparkle ring
    const ring = this._addOuterRing(starGroup, 1.35, 0xff44aa);
    ring.rotation.x = Math.PI / 4;

    // Glow light (pink)
    this._addGlowLight(starGroup, 0xff0088, 1.5, 10);

    return starGroup;
  }

  update(playerSpeed, dt) {
    const moveDist = playerSpeed * dt;

    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.mesh.position.z += moveDist;
      p.mesh.rotation.y += p.rotSpeed * dt;
      p.mesh.position.y = 1.4 + Math.sin(Date.now() * 0.006 + p.bobOffset) * 0.3;

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
