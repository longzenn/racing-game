/**
 * Visual Effects & Particle Systems (Ultra-Optimized)
 * Reusable geometries and materials to avoid GC hiccups
 */
class VFXManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.shieldMesh = null;

    // Shared Geometries & Materials
    this.pGeo = new THREE.SphereGeometry(0.25, 5, 5);
    this.nitroMatCyan = new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.9 });
    this.nitroMatOrange = new THREE.MeshBasicMaterial({ color: 0xff7700, transparent: true, opacity: 0.9 });
    this.smokeMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
    this.coinBurstMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
    this.crashExplosionMat = new THREE.MeshBasicMaterial({ color: 0xff2200 });

    this.initShield();
  }

  initShield() {
    const shieldGeo = new THREE.SphereGeometry(2.8, 20, 14);
    const shieldMat = new THREE.MeshBasicMaterial({
      color: 0x00f2ff,
      wireframe: true,
      transparent: true,
      opacity: 0.0
    });
    this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    this.shieldMesh.visible = false;
    this.scene.add(this.shieldMesh);
  }

  updateShield(carPos, isActive, dt) {
    if (!this.shieldMesh) return;
    if (isActive) {
      this.shieldMesh.visible = true;
      this.shieldMesh.position.copy(carPos);
      this.shieldMesh.position.y += 1.0;
      this.shieldMesh.rotation.y += 3.0 * dt;
      this.shieldMesh.rotation.x += 1.5 * dt;
      this.shieldMesh.material.opacity = 0.45 + Math.sin(Date.now() * 0.01) * 0.2;
    } else {
      this.shieldMesh.visible = false;
    }
  }

  // --- Nitro Exhaust Flame Emitter ---
  emitNitroFlames(exhaustPoints, carGroup) {
    if (!exhaustPoints || exhaustPoints.length === 0) return;

    for (let ep of exhaustPoints) {
      const worldPos = ep.clone().applyMatrix4(carGroup.matrixWorld);
      const isBlue = Math.random() > 0.3;
      const mat = (isBlue ? this.nitroMatCyan : this.nitroMatOrange).clone();
      const mesh = new THREE.Mesh(this.pGeo, mat);
      mesh.position.copy(worldPos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.2,
        (Math.random() - 0.5) * 0.8,
        3.0 + Math.random() * 2.0
      );

      this.particles.push({
        mesh: mesh,
        velocity: vel,
        life: 0.25,
        maxLife: 0.25,
        scaleSpeed: -2.5
      });
    }
  }

  // --- Drift Smoke Emitter ---
  emitDriftSmoke(carGroup) {
    const pos = carGroup.position.clone();
    pos.y += 0.2;
    pos.z += 1.5;
    pos.x += (Math.random() - 0.5) * 1.5;

    const mat = this.smokeMat.clone();
    const mesh = new THREE.Mesh(this.pGeo, mat);
    mesh.position.copy(pos);
    mesh.scale.setScalar(1.2);
    this.scene.add(mesh);

    this.particles.push({
      mesh: mesh,
      velocity: new THREE.Vector3((Math.random() - 0.5) * 2, 1.5 + Math.random(), 4),
      life: 0.4,
      maxLife: 0.4,
      scaleSpeed: 4.0
    });
  }

  // --- Coin Burst VFX ---
  createCoinBurst(pos) {
    for (let i = 0; i < 8; i++) {
      const mat = this.coinBurstMat.clone();
      const mesh = new THREE.Mesh(this.pGeo, mat);
      mesh.position.copy(pos);
      this.scene.add(mesh);

      const angle = (i / 8) * Math.PI * 2;
      const speed = 4 + Math.random() * 3;
      const vel = new THREE.Vector3(
        Math.cos(angle) * speed,
        2 + Math.random() * 4,
        Math.sin(angle) * speed
      );

      this.particles.push({
        mesh: mesh,
        velocity: vel,
        life: 0.4,
        maxLife: 0.4,
        scaleSpeed: -1.5
      });
    }
  }

  // --- Crash Explosion VFX ---
  createCrashExplosion(pos) {
    for (let i = 0; i < 12; i++) {
      const mat = this.crashExplosionMat.clone();
      const mesh = new THREE.Mesh(this.pGeo, mat);
      mesh.position.copy(pos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 10,
        3 + Math.random() * 8,
        (Math.random() - 0.5) * 10
      );

      this.particles.push({
        mesh: mesh,
        velocity: vel,
        life: 0.5,
        maxLife: 0.5,
        scaleSpeed: -1.5
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      p.mesh.position.addScaledVector(p.velocity, dt);
      const scaleDelta = 1 + p.scaleSpeed * dt;
      p.mesh.scale.multiplyScalar(Math.max(0.1, scaleDelta));

      if (p.mesh.material && p.mesh.material.opacity !== undefined) {
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    for (let p of this.particles) {
      this.scene.remove(p.mesh);
      if (p.mesh.material) p.mesh.material.dispose();
    }
    this.particles = [];
  }
}
