/**
 * AI Traffic Vehicles - Cute Chibi Cartoon Toy Traffic Cars
 */
class TrafficManager {
  constructor(scene) {
    this.scene = scene;
    this.trafficCars = [];
    this.spawnTimer = 0;
  }

  spawnCar(speedTierConfig) {
    const laneIndex = Math.floor(Math.random() * CONFIG.LANES.length);
    const laneX = CONFIG.LANES[laneIndex];

    const carGroup = new THREE.Group();
    // Bright joyful candy colors for AI cars
    const colors = [0xffdd00, 0x00d2ff, 0xff55aa, 0x00e676, 0xff9100, 0x9d4edd];
    const carColor = colors[Math.floor(Math.random() * colors.length)];

    // Rounded chubby body
    const bodyGeo = new THREE.BoxGeometry(2.3, 0.72, 3.8);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: carColor,
      roughness: 0.2,
      metalness: 0.15
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 0.85;
    carGroup.add(body);

    // Cute bubble cabin
    const cabinGeo = new THREE.SphereGeometry(1.1, 20, 16);
    const cabinMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      roughness: 0.1,
      metalness: 0.1
    });
    const cabin = new THREE.Mesh(cabinGeo, cabinMat);
    cabin.scale.set(0.88, 0.7, 1.25);
    cabin.position.set(0, 1.45, -0.1);
    carGroup.add(cabin);

    // Cute smiling taillights (Heart / Round style)
    const tailMat = new THREE.MeshBasicMaterial({ color: 0xff0055 });
    const tailGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const tL = new THREE.Mesh(tailGeo, tailMat); tL.position.set(-0.75, 0.9, 1.9);
    const tR = new THREE.Mesh(tailGeo, tailMat); tR.position.set(0.75, 0.9, 1.9);
    carGroup.add(tL, tR);

    // 4 Chunky Toy Wheels
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
    [[-1.3, 0.58, 1.1], [1.3, 0.58, 1.1], [-1.3, 0.58, -1.0], [1.3, 0.58, -1.0]].forEach(pos => {
      const wheel = new THREE.Group();
      const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.45, 16), tireMat);
      tire.rotation.z = Math.PI / 2;
      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.48, 12), rimMat);
      rim.rotation.z = Math.PI / 2;
      wheel.add(tire, rim);
      wheel.position.set(...pos);
      carGroup.add(wheel);
    });

    // Initial position far ahead
    carGroup.position.set(laneX, 0, -CONFIG.VIEW_DISTANCE + 40);
    this.scene.add(carGroup);

    // AI car moves forward at 40-60% of player base speed
    const relativeTrafficSpeed = speedTierConfig.baseSpeed * (0.35 + Math.random() * 0.25);

    this.trafficCars.push({
      mesh: carGroup,
      laneIndex: laneIndex,
      speed: relativeTrafficSpeed,
      nearMissChecked: false,
      bobOffset: Math.random() * Math.PI * 2
    });
  }

  update(playerSpeed, playerPos, dt, onNearMiss) {
    for (let i = this.trafficCars.length - 1; i >= 0; i--) {
      const tc = this.trafficCars[i];
      
      // Relative motion
      const relativeSpeed = playerSpeed - tc.speed;
      tc.mesh.position.z += relativeSpeed * dt;

      // Gentle joyful bobbing
      tc.mesh.position.y = Math.sin(Date.now() * 0.008 + tc.bobOffset) * 0.04;

      // Check Near-Miss
      if (!tc.nearMissChecked && tc.mesh.position.z > playerPos.z - 3.5 && tc.mesh.position.z < playerPos.z + 3.5) {
        const lateralDist = Math.abs(playerPos.x - tc.mesh.position.x);
        if (lateralDist > 2.2 && lateralDist < 5.0) {
          tc.nearMissChecked = true;
          if (onNearMiss) onNearMiss(tc.mesh.position);
        }
      }

      // Recycle if passed behind player
      if (tc.mesh.position.z > 25) {
        this.scene.remove(tc.mesh);
        this.trafficCars.splice(i, 1);
      }
    }
  }

  clear() {
    for (let tc of this.trafficCars) {
      this.scene.remove(tc.mesh);
    }
    this.trafficCars = [];
  }
}
