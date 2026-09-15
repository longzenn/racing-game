/**
 * Visual Effects & Particle Systems (Nitro Flames, Sparks, Coin Bursts, Shield Aura)
 */
class VFXManager {
  constructor(scene) {
    this.scene = scene;
    this.particles = [];
    this.shieldMesh = null;

    this.initShield();
  }

  initShield() {
    const shieldGeo = new THREE.SphereGeometry(2.8, 24, 16);
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
      // Calculate world pos of exhaust
      const worldPos = ep.clone().applyMatrix4(carGroup.matrixWorld);

      const pGeo = new THREE.SphereGeometry(0.25, 6, 6);
      const isBlue = Math.random() > 0.3;
      const pMat = new THREE.MeshBasicMaterial({
        color: isBlue ? 0x00f2ff : 0xff7700,
        transparent: true,
        opacity: 0.9
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.copy(worldPos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        15 + Math.random() * 15 // Shoot backwards
      );

      this.particles.push({
        mesh: mesh,
        vel: vel,
        life: 0.22,
        maxLife: 0.22,
        scaleSpeed: -2.5
      });
    }
  }

  // --- Tire Drift Smoke ---
  emitDriftSmoke(carGroup) {
    const pGeo = new THREE.SphereGeometry(0.4, 6, 6);
    const pMat = new THREE.MeshBasicMaterial({
      color: 0xcccccc,
      transparent: true,
      opacity: 0.5
    });
    const mesh = new THREE.Mesh(pGeo, pMat);
    mesh.position.copy(carGroup.position);
    mesh.position.y = 0.2;
    mesh.position.z += 1.8;
    this.scene.add(mesh);

    this.particles.push({
      mesh: mesh,
      vel: new THREE.Vector3((Math.random() - 0.5) * 2, 1.5, 5),
      life: 0.35,
      maxLife: 0.35,
      scaleSpeed: 3.0
    });
  }

  // --- Coin Pickup Sparkle Explosion ---
  createCoinBurst(pos) {
    for (let i = 0; i < 16; i++) {
      const pGeo = new THREE.SphereGeometry(0.2, 6, 6);
      const pMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.copy(pos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 16,
        Math.random() * 14 + 4,
        (Math.random() - 0.5) * 16
      );

      this.particles.push({
        mesh: mesh,
        vel: vel,
        gravity: 22,
        life: 0.5,
        maxLife: 0.5,
        scaleSpeed: -1.0
      });
    }
  }

  // --- Collision Sparks & Debris ---
  createCrashExplosion(pos) {
    for (let i = 0; i < 24; i++) {
      const pGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
      const colors = [0xff0044, 0xffaa00, 0xffffff];
      const pMat = new THREE.MeshBasicMaterial({
        color: colors[Math.floor(Math.random() * colors.length)]
      });
      const mesh = new THREE.Mesh(pGeo, pMat);
      mesh.position.copy(pos);
      this.scene.add(mesh);

      const vel = new THREE.Vector3(
        (Math.random() - 0.5) * 22,
        Math.random() * 16 + 5,
        (Math.random() - 0.5) * 22
      );

      this.particles.push({
        mesh: mesh,
        vel: vel,
        gravity: 26,
        life: 0.65,
        maxLife: 0.65,
        scaleSpeed: -0.8
      });
    }
  }

  update(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.gravity) {
        p.vel.y -= p.gravity * dt;
      }
      p.mesh.position.addScaledVector(p.vel, dt);

      if (p.scaleSpeed) {
        const s = Math.max(0.01, p.mesh.scale.x + p.scaleSpeed * dt);
        p.mesh.scale.set(s, s, s);
      }

      if (p.mesh.material.transparent) {
        p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
      }

      if (p.life <= 0) {
        this.scene.remove(p.mesh);
        p.mesh.geometry.dispose();
        p.mesh.material.dispose();
        this.particles.splice(i, 1);
      }
    }
  }

  clear() {
    for (let p of this.particles) {
      this.scene.remove(p.mesh);
    }
    this.particles = [];
  }
}
