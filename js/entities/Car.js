/**
 * Player Car Entity - Ultra-Cute Chibi Cartoon Toy Cars (Kids Edition)
 * Featuring animated kawaii eyes, smiling faces, blushing cheeks, spring antennas & bouncy physics!
 */
class Car {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.carModelId = 'buggy';
    this.paintHex = 0xff3366;

    this.wheels = [];
    this.exhaustPoints = [];
    this.headlights = [];
    this.brakeLights = [];
    this.eyes = []; // Pupils for cute steering gaze
    this.springProps = []; // Antenna & bouncy parts
    this.bodyMesh = null;

    this.currentX = 0;
    this.targetX = 0;
    this.roll = 0;
    this.pitch = 0;
    this.bobPhase = 0;

    this.buildCar('buggy', 0xff3366);
  }

  buildCar(modelId = 'buggy', paintColor = 0xff3366) {
    this.carModelId = modelId;
    this.paintHex = paintColor;

    // Clear previous children
    while (this.group.children.length > 0) {
      const child = this.group.children[0];
      this.group.remove(child);
    }
    this.wheels = [];
    this.exhaustPoints = [];
    this.headlights = [];
    this.brakeLights = [];
    this.eyes = [];
    this.springProps = [];

    // Shared Glossy Candy Paint Material
    this.paintMat = new THREE.MeshStandardMaterial({
      color: this.paintHex,
      metalness: 0.25,
      roughness: 0.15 // Shiny cartoon plastic toy finish
    });

    // Bubble Glass Canopy Material (Light blue shiny tint)
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0x88e1ff,
      metalness: 0.1,
      roughness: 0.05,
      transmission: 0.75,
      transparent: true,
      opacity: 0.85
    });

    // Chunky Cartoon Tire Materials
    const tireMat = new THREE.MeshStandardMaterial({ color: 0x22262c, roughness: 0.8 });
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xffd700, // Shiny gold star rims!
      metalness: 0.8,
      roughness: 0.2
    });
    const whiteMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const blackMat = new THREE.MeshBasicMaterial({ color: 0x111317 });
    const pinkBlushMat = new THREE.MeshBasicMaterial({ color: 0xff66aa, transparent: true, opacity: 0.7 });

    if (modelId === 'buggy') {
      // =========================================================================
      // 1. CUTE RETRO BUGGY - "Xe Mắt Tròn Bé Con" (Chibi Beetle with big eyes)
      // =========================================================================
      // Rounded chubby egg body
      const bodyGeo = new THREE.SphereGeometry(1.65, 32, 22);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.scale.set(1.15, 0.78, 1.35);
      body.position.y = 1.25;
      this.group.add(body);
      this.bodyMesh = body;

      // Cute Bubble Windshield Dome
      const cabinGeo = new THREE.SphereGeometry(1.25, 24, 18);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.scale.set(0.95, 0.75, 1.05);
      cabin.position.set(0, 1.8, -0.2);
      this.group.add(cabin);

      // Huge Kawaii Cartoon Eyes (Front)
      const eyeGeo = new THREE.SphereGeometry(0.52, 20, 20);
      const pupilGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const sparkle1Geo = new THREE.SphereGeometry(0.09, 8, 8);
      const sparkle2Geo = new THREE.SphereGeometry(0.05, 8, 8);

      [-0.82, 0.82].forEach((xSide) => {
        // White sclera
        const eye = new THREE.Mesh(eyeGeo, whiteMat);
        eye.position.set(xSide, 1.48, -1.82);
        this.group.add(eye);

        // Black pupil
        const pupil = new THREE.Mesh(pupilGeo, blackMat);
        pupil.position.set(xSide, 1.48, -2.26);

        // Anime sparkles inside pupil (gives life to the eyes!)
        const sp1 = new THREE.Mesh(sparkle1Geo, whiteMat);
        sp1.position.set(xSide > 0 ? 0.08 : -0.08, 0.09, -0.2);
        pupil.add(sp1);
        const sp2 = new THREE.Mesh(sparkle2Geo, whiteMat);
        sp2.position.set(xSide > 0 ? -0.06 : 0.06, -0.07, -0.2);
        pupil.add(sp2);

        this.group.add(pupil);
        this.eyes.push({ mesh: pupil, originX: xSide });
      });

      // Cute Blushing Cheeks (Pink circles under eyes)
      const blushGeo = new THREE.CircleGeometry(0.3, 16);
      [-1.15, 1.15].forEach(x => {
        const blush = new THREE.Mesh(blushGeo, pinkBlushMat);
        blush.position.set(x, 1.05, -1.6);
        blush.rotation.y = x > 0 ? 0.5 : -0.5;
        this.group.add(blush);
      });

      // Happy smiling mouth bumper
      const smileGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 20, Math.PI);
      const smileMat = new THREE.MeshBasicMaterial({ color: 0x333333 });
      const smile = new THREE.Mesh(smileGeo, smileMat);
      smile.rotation.x = Math.PI * 0.45;
      smile.rotation.z = Math.PI;
      smile.position.set(0, 0.85, -2.18);
      this.group.add(smile);

      // Spring antenna with golden star on roof
      const antennaPoleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.1, 8);
      const antennaPole = new THREE.Mesh(antennaPoleGeo, new THREE.MeshStandardMaterial({ color: 0xdddddd, metalness: 0.9 }));
      antennaPole.position.set(0, 2.7, 0.7);

      const starTopperGeo = new THREE.OctahedronGeometry(0.35);
      const starTopper = new THREE.Mesh(starTopperGeo, new THREE.MeshBasicMaterial({ color: 0xffea00 }));
      starTopper.position.set(0, 0.65, 0);
      antennaPole.add(starTopper);

      this.group.add(antennaPole);
      this.springProps.push(antennaPole);

      // 4 Chubby Monster Tires with Star Rims
      [[-1.48, 0.65, 1.15], [1.48, 0.65, 1.15], [-1.48, 0.65, -1.05], [1.48, 0.65, -1.05]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.65, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.45, 0.8, 2.05), new THREE.Vector3(0.45, 0.8, 2.05)];

    } else if (modelId === 'roadster') {
      // =========================================================================
      // 2. CHIBI ROADSTER - "Siêu Xe Tia Chớp Tí Hon" (Speedy Little Lightning)
      // =========================================================================
      // Chubby aerodynamic wedge body
      const bodyGeo = new THREE.BoxGeometry(2.35, 0.62, 4.4);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 0.82;
      this.group.add(body);
      this.bodyMesh = body;

      // Streamlined bubble cockpit
      const cabinGeo = new THREE.SphereGeometry(1.2, 24, 16);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.scale.set(0.9, 0.6, 1.35);
      cabin.position.set(0, 1.25, 0.15);
      this.group.add(cabin);

      // Cool cartoon shades / front eye lights
      const shadeBarGeo = new THREE.BoxGeometry(2.0, 0.35, 0.2);
      const shadeBarMat = new THREE.MeshBasicMaterial({ color: 0x1a1a24 });
      const shadeBar = new THREE.Mesh(shadeBarGeo, shadeBarMat);
      shadeBar.position.set(0, 0.95, -2.15);
      this.group.add(shadeBar);

      // Two glowing cyan eyes inside shades
      [-0.55, 0.55].forEach(x => {
        const eyeLightGeo = new THREE.CircleGeometry(0.18, 16);
        const eyeLight = new THREE.Mesh(eyeLightGeo, new THREE.MeshBasicMaterial({ color: 0x00f2ff }));
        eyeLight.position.set(x, 0.95, -2.26);
        this.group.add(eyeLight);
      });

      // Cute ducktail rear spoiler
      const spoilerGeo = new THREE.BoxGeometry(2.3, 0.14, 0.6);
      const spoiler = new THREE.Mesh(spoilerGeo, this.paintMat);
      spoiler.position.set(0, 1.35, 2.0);
      spoiler.rotation.x = -0.2;
      this.group.add(spoiler);

      // Gold dual exhaust booster pipes
      [-0.5, 0.5].forEach(x => {
        const pipeGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.6, 16);
        const pipe = new THREE.Mesh(pipeGeo, rimMat);
        pipe.rotation.x = Math.PI / 2;
        pipe.position.set(x, 0.75, 2.2);
        this.group.add(pipe);
      });

      // Wheels
      [[-1.38, 0.62, 1.3], [1.38, 0.62, 1.3], [-1.38, 0.62, -1.2], [1.38, 0.62, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.62, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.5, 0.75, 2.45), new THREE.Vector3(0.5, 0.75, 2.45)];

    } else if (modelId === 'phantom') {
      // =========================================================================
      // 3. CHIBI ASTRO JET - "Phi Thuyền Không Gian Của Bé" (Cute Rocket Cart)
      // =========================================================================
      // Chubby rocket fuselage
      const bodyGeo = new THREE.CylinderGeometry(0.9, 1.25, 4.4, 24);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.rotation.x = Math.PI / 2;
      body.position.y = 0.92;
      this.group.add(body);
      this.bodyMesh = body;

      // Rounded rocket nosecone
      const noseGeo = new THREE.SphereGeometry(0.9, 20, 16);
      const nose = new THREE.Mesh(noseGeo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
      nose.scale.set(1, 1, 1.4);
      nose.position.set(0, 0.92, -2.4);
      this.group.add(nose);

      // Astronaut bubble glass cockpit
      const domeGeo = new THREE.SphereGeometry(1.1, 24, 18);
      const dome = new THREE.Mesh(domeGeo, glassMat);
      dome.scale.set(0.9, 0.85, 1.0);
      dome.position.set(0, 1.5, -0.2);
      this.group.add(dome);

      // Two cute mini rocket wings on sides
      [-1.4, 1.4].forEach(x => {
        const wingGeo = new THREE.BoxGeometry(0.8, 0.08, 1.6);
        const wing = new THREE.Mesh(wingGeo, this.paintMat);
        wing.position.set(x, 0.85, 0.4);
        wing.rotation.z = x > 0 ? -0.2 : 0.2;
        this.group.add(wing);

        // Wingtip star lights
        const tipStar = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0055 }));
        tipStar.position.set(x > 0 ? 0.45 : -0.45, 0, 0);
        wing.add(tipStar);
      });

      // Giant Thruster Engine at Back with Glowing Core
      const thrusterGeo = new THREE.CylinderGeometry(0.7, 0.85, 0.8, 20);
      const thruster = new THREE.Mesh(thrusterGeo, new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 }));
      thruster.rotation.x = Math.PI / 2;
      thruster.position.set(0, 0.92, 2.3);
      this.group.add(thruster);

      const thrusterCore = new THREE.Mesh(new THREE.CircleGeometry(0.65, 18), new THREE.MeshBasicMaterial({ color: 0x00f2ff }));
      thrusterCore.position.set(0, 0.92, 2.71);
      this.group.add(thrusterCore);

      // Wheels
      [[-1.45, 0.65, 1.2], [1.45, 0.65, 1.2], [-1.45, 0.65, -1.2], [1.45, 0.65, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.65, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(0, 0.92, 2.8)];

    } else {
      // =========================================================================
      // 4. CHIBI MONSTER TRUCK - "Xe Quái Thú Bánh Bự" (Friendly Monster Jeep)
      // =========================================================================
      // High-riding chunky SUV cab
      const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 4.0);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 1.15;
      this.group.add(body);
      this.bodyMesh = body;

      // Cabin with oversized windows
      const cabinGeo = new THREE.BoxGeometry(2.1, 0.85, 2.0);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.position.set(0, 1.9, 0.2);
      this.group.add(cabin);

      // Roof Bar with 4 Glowing Yellow Lights (Like a cute crown!)
      const barGeo = new THREE.BoxGeometry(2.0, 0.08, 0.2);
      const bar = new THREE.Mesh(barGeo, new THREE.MeshStandardMaterial({ color: 0x222222 }));
      bar.position.set(0, 2.4, 0.2);
      this.group.add(bar);

      const lightGeo = new THREE.SphereGeometry(0.18, 12, 12);
      const lightMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      [-0.75, -0.25, 0.25, 0.75].forEach(x => {
        const lamp = new THREE.Mesh(lightGeo, lightMat);
        lamp.position.set(x, 0.15, 0);
        bar.add(lamp);
      });

      // Friendly cartoon monster grin grill (Front)
      const grillGeo = new THREE.BoxGeometry(1.8, 0.45, 0.2);
      const grill = new THREE.Mesh(grillGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
      grill.position.set(0, 0.95, -2.05);
      this.group.add(grill);

      // Two cute round headlights
      [-0.8, 0.8].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), whiteMat);
        eye.position.set(x, 1.25, -2.05);
        this.group.add(eye);

        const pup = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), blackMat);
        pup.position.set(x, 1.25, -2.25);
        this.group.add(pup);
      });

      // Extra BIG Chunky Cartoon Monster Wheels
      [[-1.55, 0.8, 1.3], [1.55, 0.8, 1.3], [-1.55, 0.8, -1.2], [1.55, 0.8, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.8, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.75, 0.9, 2.1), new THREE.Vector3(0.75, 0.9, 2.1)];
    }

    // Dynamic Headlights Glow
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headGeo = new THREE.BoxGeometry(0.35, 0.2, 0.15);

    const hlLeft = new THREE.Mesh(headGeo, headMat); hlLeft.position.set(-0.8, 0.9, -2.2);
    const hlRight = new THREE.Mesh(headGeo, headMat); hlRight.position.set(0.8, 0.9, -2.2);
    this.group.add(hlLeft, hlRight);

    // Front Spotlights illuminating the road
    const spotLight = new THREE.SpotLight(0xffffff, 1.6, 60, Math.PI / 5, 0.4, 1);
    spotLight.position.set(0, 1.5, -2.5);
    const targetObj = new THREE.Object3D();
    targetObj.position.set(0, 0, -35);
    this.group.add(spotLight, targetObj);
    spotLight.target = targetObj;

    // Brake Lights
    const brakeMat = new THREE.MeshBasicMaterial({ color: 0xff0033 });
    const brakeGeo = new THREE.BoxGeometry(0.4, 0.2, 0.15);

    const blLeft = new THREE.Mesh(brakeGeo, brakeMat); blLeft.position.set(-0.85, 0.85, 2.25);
    const blRight = new THREE.Mesh(brakeGeo, brakeMat); blRight.position.set(0.85, 0.85, 2.25);
    this.group.add(blLeft, blRight);
    this.brakeLights = [blLeft, blRight];
  }

  // Create bouncy cartoon wheel with golden star center
  createChunkyWheel(pos, radius, tireMat, rimMat) {
    const wheelGroup = new THREE.Group();

    // Chunky rounded tire
    const tireGeo = new THREE.CylinderGeometry(radius, radius, 0.55, 24);
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    wheelGroup.add(tire);

    // Shiny Rim
    const rimGeo = new THREE.CylinderGeometry(radius * 0.65, radius * 0.65, 0.58, 16);
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    wheelGroup.add(rim);

    // Cartoon Star Rim center cap
    const starGeo = new THREE.SphereGeometry(radius * 0.28, 5, 2);
    const starCenter = new THREE.Mesh(starGeo, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    starCenter.rotation.z = Math.PI / 2;
    starCenter.position.set(pos[0] > 0 ? 0.3 : -0.3, 0, 0);
    wheelGroup.add(starCenter);

    wheelGroup.position.set(...pos);
    this.group.add(wheelGroup);
    return wheelGroup;
  }

  setPaintColor(hex) {
    this.paintHex = hex;
    if (this.paintMat) {
      this.paintMat.color.setHex(hex);
    }
  }

  update(targetX, speed, isBraking, dt) {
    this.targetX = targetX;

    // Smooth lateral transition
    const diffX = this.targetX - this.group.position.x;
    this.group.position.x += diffX * 12 * dt;

    // Natural Body Roll & Cute Steering Yaw
    const targetRoll = -diffX * 0.1;
    this.roll += (targetRoll - this.roll) * 10 * dt;
    this.group.rotation.z = this.roll;
    this.group.rotation.y = -diffX * 0.14;

    // Joyful suspension bobbing (bounces playfully like a cartoon toy!)
    this.bobPhase += speed * 0.08 * dt;
    const bounceY = Math.sin(this.bobPhase) * 0.04;
    if (this.bodyMesh) {
      this.bodyMesh.position.y = (this.carModelId === 'buggy' ? 1.25 : 0.85) + bounceY;
    }

    // Pitch: nose down when braking, nose up on speed
    const targetPitch = isBraking ? 0.05 : -0.02;
    this.pitch += (targetPitch - this.pitch) * 8 * dt;
    this.group.rotation.x = this.pitch;

    // Antenna wobbly spring physics
    for (let prop of this.springProps) {
      prop.rotation.z = -this.roll * 1.5;
      prop.rotation.x = Math.sin(this.bobPhase * 1.5) * 0.15;
    }

    // Spin wheels
    const wheelRotationSpeed = (speed / 0.65) * dt;
    for (let w of this.wheels) {
      w.rotation.x += wheelRotationSpeed;
    }

    // Brake light glow
    for (let bl of this.brakeLights) {
      bl.material.color.setHex(isBraking ? 0xff0000 : 0x550011);
    }

    // Interactive pupil gaze (Eyes look left/right when steering!)
    for (let eye of this.eyes) {
      const gazeShift = Math.max(-0.15, Math.min(0.15, diffX * 0.05));
      eye.mesh.position.x = eye.originX + gazeShift;
    }
  }
}
