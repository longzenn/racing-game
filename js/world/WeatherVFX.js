/**
 * Atmospheric Weather Particles (Rain, Synthwave Stars, Stardust, Sandstorm)
 */
class WeatherVFX {
  constructor(scene) {
    this.scene = scene;
    this.particleCount = 500;
    this.particles = null;
    this.weatherType = 'none';
  }

  setWeather(type, mapConfig) {
    if (this.particles) {
      this.scene.remove(this.particles);
      this.particles.geometry.dispose();
      this.particles.material.dispose();
      this.particles = null;
    }

    this.weatherType = type;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.particleCount * 3);
    const velocities = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = Math.random() * 45;
      positions[i * 3 + 2] = -Math.random() * 200 + 20;

      if (type === 'rain') {
        velocities[i * 3] = -0.5;
        velocities[i * 3 + 1] = -55;
        velocities[i * 3 + 2] = 10;
      } else if (type === 'dust') {
        velocities[i * 3] = -12;
        velocities[i * 3 + 1] = -2;
        velocities[i * 3 + 2] = 20;
      } else {
        velocities[i * 3] = (Math.random() - 0.5) * 2;
        velocities[i * 3 + 1] = -1;
        velocities[i * 3 + 2] = 15;
      }
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.velocities = velocities;

    let pColor = 0x00f2ff;
    let pSize = 0.6;
    if (type === 'rain') {
      pColor = 0x80d8ff;
      pSize = 0.8;
    } else if (type === 'dust') {
      pColor = 0xdd8844;
      pSize = 1.2;
    } else if (type === 'stardust') {
      pColor = 0xfff3b0;
      pSize = 1.0;
    }

    const mat = new THREE.PointsMaterial({
      color: pColor,
      size: pSize,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, mat);
    this.scene.add(this.particles);
  }

  update(speed, dt) {
    if (!this.particles) return;
    const positions = this.particles.geometry.attributes.position.array;

    for (let i = 0; i < this.particleCount; i++) {
      positions[i * 3] += this.velocities[i * 3] * dt;
      positions[i * 3 + 1] += this.velocities[i * 3 + 1] * dt;
      positions[i * 3 + 2] += (this.velocities[i * 3 + 2] + speed * 0.4) * dt;

      // Wrap back when hitting ground or passing camera
      if (positions[i * 3 + 1] < 0 || positions[i * 3 + 2] > 25) {
        positions[i * 3] = (Math.random() - 0.5) * 120;
        positions[i * 3 + 1] = 40;
        positions[i * 3 + 2] = -180;
      }
    }

    this.particles.geometry.attributes.position.needsUpdate = true;
  }
}
