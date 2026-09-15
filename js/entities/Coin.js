/**
 * 3D Gold Coins with rotation, glow and magnet attraction
 */
class CoinManager {
  constructor(scene) {
    this.scene = scene;
    this.coins = [];

    // Reusable Coin Geometry
    this.coinGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.25, 24);
    this.coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xff9900,
      emissiveIntensity: 0.7,
      metalness: 0.9,
      roughness: 0.1
    });

    // Star Relief on both faces
    this.starGeo = new THREE.SphereGeometry(0.45, 5, 2);
    this.starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Halo ring around coin
    this.haloGeo = new THREE.TorusGeometry(1.35, 0.06, 8, 24);
    this.haloMat = new THREE.MeshBasicMaterial({ color: 0xffdd00, transparent: true, opacity: 0.75 });
  }

  spawnCoin() {
    const laneIndex = Math.floor(Math.random() * CONFIG.LANES.length);
    const laneX = CONFIG.LANES[laneIndex];

    const coinGroup = new THREE.Group();

    // Gold coin disc
    const mesh = new THREE.Mesh(this.coinGeo, this.coinMat);
    mesh.rotation.x = Math.PI / 2;
    coinGroup.add(mesh);

    // White star emboss (front + back)
    const star1 = new THREE.Mesh(this.starGeo, this.starMat);
    star1.position.z = 0.14;
    star1.scale.set(1, 1, 0.2);
    coinGroup.add(star1);

    const star2 = new THREE.Mesh(this.starGeo, this.starMat);
    star2.position.z = -0.14;
    star2.scale.set(1, 1, 0.2);
    coinGroup.add(star2);

    // Golden halo ring
    const halo = new THREE.Mesh(this.haloGeo, this.haloMat);
    halo.rotation.x = Math.PI / 2;
    coinGroup.add(halo);

    // Point light - warm golden glow
    const light = new THREE.PointLight(0xffcc00, 1.2, 7);
    light.position.set(0, 0, 0);
    coinGroup.add(light);

    coinGroup.position.set(laneX, 1.4, -CONFIG.VIEW_DISTANCE + 40);
    this.scene.add(coinGroup);

    this.coins.push({
      mesh: coinGroup,
      light: light,
      rotSpeed: 4.5 + Math.random() * 2,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  update(playerSpeed, playerPos, magnetActive, dt) {
    const moveDist = playerSpeed * dt;

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.mesh.position.z += moveDist;
      c.mesh.rotation.y += c.rotSpeed * dt;
      const bobY = 1.4 + Math.sin(Date.now() * 0.005 + c.bobOffset) * 0.25;
      c.mesh.position.y = bobY;

      // Pulse the glow intensity
      if (c.light) {
        c.light.intensity = 1.0 + Math.sin(Date.now() * 0.008 + c.bobOffset) * 0.4;
      }

      // Magnet attraction physics
      if (magnetActive) {
        const dist = c.mesh.position.distanceTo(playerPos);
        if (dist < CONFIG.POWERUPS.magnet.radius) {
          const pullDir = new THREE.Vector3().subVectors(playerPos, c.mesh.position).normalize();
          c.mesh.position.addScaledVector(pullDir, 35 * dt);
        }
      }

      // Recycle if passed behind player
      if (c.mesh.position.z > 25) {
        this.scene.remove(c.mesh);
        this.coins.splice(i, 1);
      }
    }
  }

  removeCoin(index) {
    if (this.coins[index]) {
      this.scene.remove(this.coins[index].mesh);
      this.coins.splice(index, 1);
    }
  }

  clear() {
    for (let c of this.coins) {
      this.scene.remove(c.mesh);
    }
    this.coins = [];
  }
}
