/**
 * 3D Gold Coins with rotation, glow and magnet attraction (Ultra-Optimized)
 */
class CoinManager {
  constructor(scene) {
    this.scene = scene;
    this.coins = [];

    // Reusable Shared Geometries & Materials (Zero runtime allocations)
    this.coinGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.25, 20);
    this.coinMat = new THREE.MeshStandardMaterial({
      color: 0xffd700,
      emissive: 0xffaa00,
      emissiveIntensity: 0.85,
      metalness: 0.85,
      roughness: 0.15
    });

    this.starGeo = new THREE.SphereGeometry(0.45, 6, 4);
    this.starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    this.haloGeo = new THREE.TorusGeometry(1.35, 0.06, 6, 20);
    this.haloMat = new THREE.MeshBasicMaterial({ color: 0xffea00, transparent: true, opacity: 0.8 });
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

    // Golden halo ring (Glows intensely with Bloom, no heavy point light needed!)
    const halo = new THREE.Mesh(this.haloGeo, this.haloMat);
    halo.rotation.x = Math.PI / 2;
    coinGroup.add(halo);

    coinGroup.position.set(laneX, 1.4, -CONFIG.VIEW_DISTANCE + 40);
    this.scene.add(coinGroup);

    this.coins.push({
      mesh: coinGroup,
      rotSpeed: 4.5 + Math.random() * 2,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  update(playerSpeed, playerPos, magnetActive, dt) {
    const moveDist = playerSpeed * dt;
    const nowTime = Date.now() * 0.005;

    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.mesh.position.z += moveDist;
      c.mesh.rotation.y += c.rotSpeed * dt;
      c.mesh.position.y = 1.4 + Math.sin(nowTime + c.bobOffset) * 0.25;

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
