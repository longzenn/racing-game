/**
 * Infinite Scrolling Multi-Lane Road, Overhead Arches & Road Curve System
 * - High-Contrast Lane Markings & Borders
 * - Smooth Road Bends: Shifts the road group + environment in sync with camera,
 *   creating classic OutRun-style curve illusion without geometry changes.
 */
class RoadManager {
  constructor(scene) {
    this.scene = scene;
    this.roadSegments = [];
    this.laneDashes = [];
    this.sideRails = [];
    this.overheadArches = [];
    this.rainbowStrips = [];
    this.totalRoadLength = 320;
    this.roadWidth = CONFIG.ROAD_WIDTH;

    // --- Road Curve System ---
    // curveOffset: how far the road "world" is currently shifted laterally (X axis)
    // The camera and car compensate by leaning the opposite way → feels like turning
    this.curveOffset     = 0;      // current world X shift
    this.curveVelocity   = 0;      // rate of change
    this.curveTarget     = 0;      // target offset (changes every few seconds)
    this.curveSwitchTimer = 0;     // time until next direction change
    this.curveSwitchInterval = 6;  // seconds between curve changes
    this.curveMaxOffset  = 5.5;    // max lateral shift in world units
    this.curveLeanFactor = 0.40;   // how much camera lean per unit offset
    this.curveIsActive   = true;   // can be toggled per-map if desired

    this.initRoad();
  }

  initRoad() {
    this.group = new THREE.Group();
    this.scene.add(this.group);

    // Main Road Bed
    const roadGeo = new THREE.PlaneGeometry(this.roadWidth, this.totalRoadLength, 1, 1);
    this.roadMat = new THREE.MeshStandardMaterial({
      color: 0x22252c,
      roughness: 0.5,
      metalness: 0.1
    });
    this.roadMesh = new THREE.Mesh(roadGeo, this.roadMat);
    this.roadMesh.rotation.x = -Math.PI / 2;
    this.roadMesh.position.set(0, 0, -this.totalRoadLength / 2 + 30);
    this.group.add(this.roadMesh);

    // Side Guardrails (High-contrast thick borders)
    const railGeo = new THREE.BoxGeometry(0.9, 0.9, this.totalRoadLength);
    this.railMat = new THREE.MeshStandardMaterial({
      color: 0xff2a55,
      roughness: 0.3,
      metalness: 0.2
    });

    this.leftRail = new THREE.Mesh(railGeo, this.railMat);
    this.leftRail.position.set(-this.roadWidth / 2 - 0.45, 0.45, -this.totalRoadLength / 2 + 30);
    this.group.add(this.leftRail);

    this.rightRail = new THREE.Mesh(railGeo, this.railMat);
    this.rightRail.position.set(this.roadWidth / 2 + 0.45, 0.45, -this.totalRoadLength / 2 + 30);
    this.group.add(this.rightRail);

    // 4 Dashed Line Rows separating 5 lanes: [-7.5, -2.5, 2.5, 7.5]
    this.lineRows = [-7.5, -2.5, 2.5, 7.5];

    const dashWhiteGeo  = new THREE.PlaneGeometry(0.5, 5.5);
    this.lineWhiteMat   = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const dashBorderGeo = new THREE.PlaneGeometry(0.8, 5.9);
    this.lineBorderMat  = new THREE.MeshBasicMaterial({ color: 0x111111 });

    for (let r of this.lineRows) {
      for (let z = 20; z > -this.totalRoadLength + 20; z -= 14) {
        const dashGroup = new THREE.Group();

        const borderMesh = new THREE.Mesh(dashBorderGeo, this.lineBorderMat);
        borderMesh.rotation.x = -Math.PI / 2;
        borderMesh.position.set(0, 0.03, 0);

        const whiteMesh = new THREE.Mesh(dashWhiteGeo, this.lineWhiteMat);
        whiteMesh.rotation.x = -Math.PI / 2;
        whiteMesh.position.set(0, 0.04, 0);

        dashGroup.add(borderMesh, whiteMesh);
        dashGroup.position.set(r, 0, z);

        this.group.add(dashGroup);
        this.laneDashes.push(dashGroup);
      }
    }

    // Overhead Cheerful Arches
    for (let z = -40; z > -this.totalRoadLength; z -= 80) {
      const arch = this.createOverheadArch();
      arch.position.set(0, 0, z);
      this.group.add(arch);
      this.overheadArches.push(arch);
    }

    // Rumble strips on edges (alternating color blocks for fun)
    this.rumbleLeft  = this.createRumbleStrips(-(this.roadWidth / 2) + 1.0);
    this.rumbleRight = this.createRumbleStrips((this.roadWidth / 2) - 1.0);
  }

  createRumbleStrips(xPos) {
    const group = new THREE.Group();
    const colors = [0xff3377, 0xffffff];
    const segLen = 8;
    const count  = Math.floor(this.totalRoadLength / segLen);
    const segGeo = new THREE.PlaneGeometry(1.6, segLen - 0.3);

    for (let i = 0; i < count; i++) {
      const mat  = new THREE.MeshBasicMaterial({ color: colors[i % 2] });
      const mesh = new THREE.Mesh(segGeo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.set(xPos, 0.015, 20 - i * segLen);
      group.add(mesh);
    }
    this.group.add(group);
    return group;
  }

  createOverheadArch() {
    const archGroup = new THREE.Group();
    const pillarGeo = new THREE.CylinderGeometry(0.6, 0.7, 9, 12);
    const archMat   = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    const pL = new THREE.Mesh(pillarGeo, archMat);
    pL.position.set(-this.roadWidth / 2 - 1.2, 4.5, 0);
    const pR = new THREE.Mesh(pillarGeo, archMat);
    pR.position.set(this.roadWidth / 2 + 1.2, 4.5, 0);

    const beamGeo = new THREE.BoxGeometry(this.roadWidth + 2.8, 1.0, 1.0);
    const beam    = new THREE.Mesh(beamGeo, archMat);
    beam.position.set(0, 9, 0);

    const starGeo = new THREE.SphereGeometry(0.9, 8, 8);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
    const star    = new THREE.Mesh(starGeo, starMat);
    star.position.set(0, 9, 0.65);

    archGroup.add(pL, pR, beam, star);
    return archGroup;
  }

  applyMapTheme(mapConfig) {
    this.roadMat.color.setHex(mapConfig.roadColor);
    this.railMat.color.setHex(mapConfig.barrierColor);

    // Clear old rainbow strips
    this.rainbowStrips.forEach(s => this.group.remove(s));
    this.rainbowStrips = [];

    if (mapConfig.themeStyle === 'rainbow') {
      const rainbowColors = [
        0xff1744, 0xff6d00, 0xffea00,
        0x00e676, 0x00b0ff, 0x2979ff, 0xaa00ff
      ];
      const stripWidth = this.roadWidth / rainbowColors.length;

      for (let i = 0; i < rainbowColors.length; i++) {
        const stripGeo = new THREE.PlaneGeometry(stripWidth, this.totalRoadLength);
        const stripMat = new THREE.MeshLambertMaterial({ color: rainbowColors[i] });
        const strip    = new THREE.Mesh(stripGeo, stripMat);
        strip.rotation.x = -Math.PI / 2;
        const xPos = -this.roadWidth / 2 + (i + 0.5) * stripWidth;
        strip.position.set(xPos, 0.02, -this.totalRoadLength / 2 + 30);
        this.group.add(strip);
        this.rainbowStrips.push(strip);
      }
    }
  }

  // -------------------------------------------------------
  // Curve logic: called every frame
  // Road stays flat and centered (no position/rotation change).
  // Only returns curveOffset → used by camera and environment
  // to create the curve illusion via perspective lean + parallax.
  // -------------------------------------------------------
  updateCurve(dt) {
    if (!this.curveIsActive) return 0;

    this.curveSwitchTimer -= dt;
    if (this.curveSwitchTimer <= 0) {
      const r = Math.random();
      if (r < 0.25) {
        this.curveTarget = 0; // go straight
      } else {
        const side = Math.random() < 0.5 ? 1 : -1;
        this.curveTarget = side * (this.curveMaxOffset * (0.5 + Math.random() * 0.5));
      }
      this.curveSwitchTimer = this.curveSwitchInterval + Math.random() * 4;
    }

    // Spring-damper toward target (smooth, natural feel)
    const springK = 0.7;
    const damping = 0.87;
    this.curveVelocity += (this.curveTarget - this.curveOffset) * springK * dt;
    this.curveVelocity *= Math.pow(damping, dt * 60);
    this.curveOffset   += this.curveVelocity * dt * 60 * dt;

    // Road group stays at default position/rotation — no shift, no tilt
    // Curve illusion is handled entirely by camera in Renderer.js
    return this.curveOffset;
  }

  update(speed, dt) {
    const moveDist = speed * dt;

    for (let dash of this.laneDashes) {
      dash.position.z += moveDist;
      if (dash.position.z > 25) {
        dash.position.z -= (this.totalRoadLength - 20);
      }
    }

    for (let arch of this.overheadArches) {
      arch.position.z += moveDist;
      if (arch.position.z > 30) {
        arch.position.z -= 240;
      }
    }
  }
}
