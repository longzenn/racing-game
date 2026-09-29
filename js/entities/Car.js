/**
 * Player Car Entity - Ultra-Cute Chibi Cartoon Toy Cars (Kids Edition)
 * 8 Unique Playable Chibi Cars with Animated Eyes, Shaded Glasses, Sirens, Spoilers & Bouncy Physics!
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
    this.springProps = []; // Antenna, siren lights & bouncy parts
    this.animatedLights = []; // Flashing police/fire beacons
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
    this.animatedLights = [];

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
    const chromeMat = new THREE.MeshStandardMaterial({ color: 0xeeeeee, metalness: 0.9, roughness: 0.1 });
    const pinkBlushMat = new THREE.MeshBasicMaterial({ color: 0xff66aa, transparent: true, opacity: 0.7 });

    if (modelId === 'buggy') {
      // =========================================================================
      // 1. CUTE RETRO BUGGY - "Xe Mắt Tròn Bé Con" (Chibi Beetle with big eyes)
      // =========================================================================
      const bodyGeo = new THREE.SphereGeometry(1.65, 32, 22);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.scale.set(1.15, 0.78, 1.35);
      body.position.y = 1.25;
      this.group.add(body);
      this.bodyMesh = body;

      const cabinGeo = new THREE.SphereGeometry(1.25, 24, 18);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.scale.set(0.95, 0.75, 1.05);
      cabin.position.set(0, 1.8, -0.2);
      this.group.add(cabin);

      // Huge Kawaii Cartoon Eyes
      const eyeGeo = new THREE.SphereGeometry(0.52, 20, 20);
      const pupilGeo = new THREE.SphereGeometry(0.26, 16, 16);
      const sparkle1Geo = new THREE.SphereGeometry(0.09, 8, 8);
      const sparkle2Geo = new THREE.SphereGeometry(0.05, 8, 8);

      [-0.82, 0.82].forEach((xSide) => {
        const eye = new THREE.Mesh(eyeGeo, whiteMat);
        eye.position.set(xSide, 1.48, -1.82);
        this.group.add(eye);

        const pupil = new THREE.Mesh(pupilGeo, blackMat);
        pupil.position.set(xSide, 1.48, -2.26);

        const sp1 = new THREE.Mesh(sparkle1Geo, whiteMat);
        sp1.position.set(xSide > 0 ? 0.08 : -0.08, 0.09, -0.2);
        pupil.add(sp1);
        const sp2 = new THREE.Mesh(sparkle2Geo, whiteMat);
        sp2.position.set(xSide > 0 ? -0.06 : 0.06, -0.07, -0.2);
        pupil.add(sp2);

        this.group.add(pupil);
        this.eyes.push({ mesh: pupil, originX: xSide });
      });

      // Cute Blushing Cheeks
      const blushGeo = new THREE.CircleGeometry(0.3, 16);
      [-1.15, 1.15].forEach(x => {
        const blush = new THREE.Mesh(blushGeo, pinkBlushMat);
        blush.position.set(x, 1.05, -1.6);
        blush.rotation.y = x > 0 ? 0.5 : -0.5;
        this.group.add(blush);
      });

      // Smiling mouth bumper
      const smileGeo = new THREE.TorusGeometry(0.5, 0.08, 8, 20, Math.PI);
      const smile = new THREE.Mesh(smileGeo, new THREE.MeshBasicMaterial({ color: 0x333333 }));
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

      // 4 Chubby Tires
      [[-1.48, 0.65, 1.15], [1.48, 0.65, 1.15], [-1.48, 0.65, -1.05], [1.48, 0.65, -1.05]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.65, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.45, 0.8, 2.05), new THREE.Vector3(0.45, 0.8, 2.05)];

    } else if (modelId === 'roadster') {
      // =========================================================================
      // 2. CHIBI ROADSTER - "Siêu Xe Tia Chớp" (Speedy with cool shades)
      // =========================================================================
      const bodyGeo = new THREE.BoxGeometry(2.35, 0.62, 4.4);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 0.82;
      this.group.add(body);
      this.bodyMesh = body;

      const cabinGeo = new THREE.SphereGeometry(1.2, 24, 16);
      const cabin = new THREE.Mesh(cabinGeo, glassMat);
      cabin.scale.set(0.9, 0.6, 1.35);
      cabin.position.set(0, 1.25, 0.15);
      this.group.add(cabin);

      // Cool cartoon shades
      const shadeBarGeo = new THREE.BoxGeometry(2.0, 0.35, 0.2);
      const shadeBar = new THREE.Mesh(shadeBarGeo, new THREE.MeshBasicMaterial({ color: 0x1a1a24 }));
      shadeBar.position.set(0, 0.95, -2.15);
      this.group.add(shadeBar);

      [-0.55, 0.55].forEach(x => {
        const eyeLight = new THREE.Mesh(new THREE.CircleGeometry(0.18, 16), new THREE.MeshBasicMaterial({ color: 0x00f2ff }));
        eyeLight.position.set(x, 0.95, -2.26);
        this.group.add(eyeLight);
      });

      // Ducktail rear spoiler
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.14, 0.6), this.paintMat);
      spoiler.position.set(0, 1.35, 2.0);
      spoiler.rotation.x = -0.2;
      this.group.add(spoiler);

      [-0.5, 0.5].forEach(x => {
        const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.6, 16), rimMat);
        pipe.rotation.x = Math.PI / 2;
        pipe.position.set(x, 0.75, 2.2);
        this.group.add(pipe);
      });

      [[-1.38, 0.62, 1.3], [1.38, 0.62, 1.3], [-1.38, 0.62, -1.2], [1.38, 0.62, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.62, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.5, 0.75, 2.45), new THREE.Vector3(0.5, 0.75, 2.45)];

    } else if (modelId === 'phantom') {
      // =========================================================================
      // 3. CHIBI ASTRO JET - "Phi Thuyền Tốc Độ" (Cute Space Rocket)
      // =========================================================================
      const bodyGeo = new THREE.CylinderGeometry(0.9, 1.25, 4.4, 24);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.rotation.x = Math.PI / 2;
      body.position.y = 0.92;
      this.group.add(body);
      this.bodyMesh = body;

      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.9, 20, 16), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }));
      nose.scale.set(1, 1, 1.4);
      nose.position.set(0, 0.92, -2.4);
      this.group.add(nose);

      const dome = new THREE.Mesh(new THREE.SphereGeometry(1.1, 24, 18), glassMat);
      dome.scale.set(0.9, 0.85, 1.0);
      dome.position.set(0, 1.5, -0.2);
      this.group.add(dome);

      [-1.4, 1.4].forEach(x => {
        const wing = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 1.6), this.paintMat);
        wing.position.set(x, 0.85, 0.4);
        wing.rotation.z = x > 0 ? -0.2 : 0.2;
        this.group.add(wing);

        const tipStar = new THREE.Mesh(new THREE.SphereGeometry(0.16, 8, 8), new THREE.MeshBasicMaterial({ color: 0xff0055 }));
        tipStar.position.set(x > 0 ? 0.45 : -0.45, 0, 0);
        wing.add(tipStar);
      });

      const thruster = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.85, 0.8, 20), new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8 }));
      thruster.rotation.x = Math.PI / 2;
      thruster.position.set(0, 0.92, 2.3);
      this.group.add(thruster);

      const thrusterCore = new THREE.Mesh(new THREE.CircleGeometry(0.65, 18), new THREE.MeshBasicMaterial({ color: 0x00f2ff }));
      thrusterCore.position.set(0, 0.92, 2.71);
      this.group.add(thrusterCore);

      [[-1.45, 0.65, 1.2], [1.45, 0.65, 1.2], [-1.45, 0.65, -1.2], [1.45, 0.65, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.65, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(0, 0.92, 2.8)];

    } else if (modelId === 'interceptor') {
      // =========================================================================
      // 4. CHIBI MONSTER TRUCK - "Xe Quái Thú Bánh Bự" (Friendly Monster Jeep)
      // =========================================================================
      const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 4.0);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 1.15;
      this.group.add(body);
      this.bodyMesh = body;

      const cabin = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.85, 2.0), glassMat);
      cabin.position.set(0, 1.9, 0.2);
      this.group.add(cabin);

      // Roof Bar with 4 Crown Lamps
      const bar = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.08, 0.2), new THREE.MeshStandardMaterial({ color: 0x222222 }));
      bar.position.set(0, 2.4, 0.2);
      this.group.add(bar);

      const lightMat = new THREE.MeshBasicMaterial({ color: 0xffea00 });
      [-0.75, -0.25, 0.25, 0.75].forEach(x => {
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), lightMat);
        lamp.position.set(x, 0.15, 0);
        bar.add(lamp);
      });

      const grill = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.2), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      grill.position.set(0, 0.95, -2.05);
      this.group.add(grill);

      [-0.8, 0.8].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.28, 16, 16), whiteMat);
        eye.position.set(x, 1.25, -2.05);
        this.group.add(eye);

        const pup = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), blackMat);
        pup.position.set(x, 1.25, -2.25);
        this.group.add(pup);
      });

      [[-1.55, 0.8, 1.3], [1.55, 0.8, 1.3], [-1.55, 0.8, -1.2], [1.55, 0.8, -1.2]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.8, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.75, 0.9, 2.1), new THREE.Vector3(0.75, 0.9, 2.1)];

    } else if (modelId === 'fire_truck') {
      // =========================================================================
      // 5. CHIBI FIRE TRUCK - "Cứu Hỏa Tí Hon" (Hero Fire Truck)
      // =========================================================================
      const bodyGeo = new THREE.BoxGeometry(2.35, 1.15, 4.3);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 1.05;
      this.group.add(body);
      this.bodyMesh = body;

      // Front Cab Glass & Cute Eyes
      const cabGlass = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.8, 1.4), glassMat);
      cabGlass.position.set(0, 1.8, -1.1);
      this.group.add(cabGlass);

      [-0.55, 0.55].forEach(x => {
        const eye = new THREE.Mesh(new THREE.SphereGeometry(0.26, 16, 16), whiteMat);
        eye.position.set(x, 1.8, -1.82);
        this.group.add(eye);

        const pup = new THREE.Mesh(new THREE.SphereGeometry(0.13, 12, 12), blackMat);
        pup.position.set(x, 1.8, -2.02);
        this.group.add(pup);
        this.eyes.push({ mesh: pup, originX: x });
      });

      // Cute white stripes on side
      [-1.19, 1.19].forEach(x => {
        const stripe = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 0.28), whiteMat);
        stripe.position.set(x, 1.05, 0.2);
        stripe.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
        this.group.add(stripe);
      });

      // Roof Ladder (Yellow cartoon ladder)
      const ladderGroup = new THREE.Group();
      ladderGroup.position.set(0, 2.35, 0.5);
      const ladderMat = new THREE.MeshStandardMaterial({ color: 0xffd000, metalness: 0.3 });
      [-0.45, 0.45].forEach(x => {
        const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.8, 8), ladderMat);
        rail.rotation.x = Math.PI / 2;
        rail.position.set(x, 0, 0);
        ladderGroup.add(rail);
      });
      for (let z = -1.1; z <= 1.1; z += 0.45) {
        const step = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 8), ladderMat);
        step.rotation.z = Math.PI / 2;
        step.position.set(0, 0, z);
        ladderGroup.add(step);
      }
      this.group.add(ladderGroup);

      // Flashing Siren Beacon (Blue & Red domes on roof)
      const sirenL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0xff0044 }));
      sirenL.position.set(-0.55, 2.3, -1.1);
      const sirenR = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshBasicMaterial({ color: 0x00d2ff }));
      sirenR.position.set(0.55, 2.3, -1.1);
      this.group.add(sirenL, sirenR);
      this.animatedLights.push({ mesh: sirenL, colorA: 0xff0044, colorB: 0x550011, phase: 0 });
      this.animatedLights.push({ mesh: sirenR, colorA: 0x00d2ff, colorB: 0x003355, phase: Math.PI });

      // Water hose reel on side
      const reel = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.35, 16), chromeMat);
      reel.rotation.z = Math.PI / 2;
      reel.position.set(1.25, 1.1, 0.7);
      this.group.add(reel);

      // Chunky Truck Wheels
      [[-1.45, 0.68, 1.25], [1.45, 0.68, 1.25], [-1.45, 0.68, -1.1], [1.45, 0.68, -1.1]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.68, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.6, 0.65, 2.25), new THREE.Vector3(0.6, 0.65, 2.25)];

    } else if (modelId === 'police') {
      // =========================================================================
      // 6. CHIBI POLICE - "Cảnh Sát Nhí" (Cute Patrol Cruiser)
      // =========================================================================
      const bodyGeo = new THREE.BoxGeometry(2.35, 0.72, 4.3);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 0.85;
      this.group.add(body);
      this.bodyMesh = body;

      // White Door / Roof Inset panels
      [-1.19, 1.19].forEach(x => {
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), whiteMat);
        panel.position.set(x, 0.88, 0.1);
        panel.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
        this.group.add(panel);

        // Star badge on door
        const starBadge = new THREE.Mesh(new THREE.CircleGeometry(0.15, 5), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
        starBadge.position.set(x + (x > 0 ? 0.02 : -0.02), 0.88, 0.1);
        starBadge.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
        this.group.add(starBadge);
      });

      // Cabin with rounded glass
      const cabin = new THREE.Mesh(new THREE.SphereGeometry(1.2, 24, 16), glassMat);
      cabin.scale.set(0.92, 0.65, 1.2);
      cabin.position.set(0, 1.35, 0.1);
      this.group.add(cabin);

      // Police Siren Lightbar (Red + White Speaker + Blue)
      const barBase = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.1, 0.28), new THREE.MeshStandardMaterial({ color: 0x333333 }));
      barBase.position.set(0, 1.88, 0.1);
      this.group.add(barBase);

      const redLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.22), new THREE.MeshBasicMaterial({ color: 0xff0044 }));
      redLight.position.set(-0.48, 2.0, 0.1);
      const blueLight = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.18, 0.22), new THREE.MeshBasicMaterial({ color: 0x0077ff }));
      blueLight.position.set(0.48, 2.0, 0.1);
      const centerSpeaker = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.16, 0.22), whiteMat);
      centerSpeaker.position.set(0, 2.0, 0.1);

      this.group.add(redLight, blueLight, centerSpeaker);
      this.animatedLights.push({ mesh: redLight, colorA: 0xff0044, colorB: 0x440011, phase: 0 });
      this.animatedLights.push({ mesh: blueLight, colorA: 0x00d2ff, colorB: 0x002244, phase: Math.PI });

      // Front Push Bumper (Bullbar)
      const bullbar = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.45, 0.2), chromeMat);
      bullbar.position.set(0, 0.8, -2.25);
      this.group.add(bullbar);

      // Low Cute Spoiler
      const spoiler = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.5), this.paintMat);
      spoiler.position.set(0, 1.25, 1.95);
      this.group.add(spoiler);

      // 4 Wheels
      [[-1.4, 0.62, 1.25], [1.4, 0.62, 1.25], [-1.4, 0.62, -1.15], [1.4, 0.62, -1.15]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.62, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-0.55, 0.65, 2.2), new THREE.Vector3(0.55, 0.65, 2.2)];

    } else if (modelId === 'formula') {
      // =========================================================================
      // 7. CHIBI FORMULA 1 - "Tên Lửa F1 Nhí" (Speedy Open-Wheel F1 Racer)
      // =========================================================================
      // Sleek tapered race body
      const bodyGeo = new THREE.CylinderGeometry(0.65, 1.15, 4.4, 16);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.rotation.x = Math.PI / 2;
      body.position.y = 0.65;
      this.group.add(body);
      this.bodyMesh = body;

      // Needle Nosecone
      const nose = new THREE.Mesh(new THREE.ConeGeometry(0.65, 1.4, 16), this.paintMat);
      nose.rotation.x = -Math.PI / 2;
      nose.position.set(0, 0.65, -2.8);
      this.group.add(nose);

      // Wide Front Aerodynamic Wing with Endplates
      const fWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.08, 0.65), this.paintMat);
      fWing.position.set(0, 0.45, -2.6);
      this.group.add(fWing);

      [-1.25, 1.25].forEach(x => {
        const plate = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.35, 0.7), new THREE.MeshBasicMaterial({ color: 0x111111 }));
        plate.position.set(x, 0.55, -2.6);
        this.group.add(plate);
      });

      // Cute Tiny Driver Helmet inside Cockpit!
      const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 16), new THREE.MeshStandardMaterial({ color: 0xffea00, roughness: 0.2 }));
      helmet.position.set(0, 1.1, -0.2);
      const visor = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.38, 0.2, 12, 1, false, -Math.PI / 2, Math.PI), blackMat);
      visor.rotation.x = Math.PI / 2;
      visor.position.set(0, 1.1, -0.32);
      this.group.add(helmet, visor);

      // Overhead Airbox Scoop
      const scoop = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.4, 0.8), this.paintMat);
      scoop.position.set(0, 1.25, 0.5);
      this.group.add(scoop);

      // High Rear Race Wing on dual struts
      const rWing = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.12, 0.8), this.paintMat);
      rWing.position.set(0, 1.5, 1.9);
      this.group.add(rWing);

      [-0.6, 0.6].forEach(x => {
        const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.85, 8), chromeMat);
        strut.position.set(x, 1.1, 1.9);
        this.group.add(strut);
      });

      // Exposed Suspension Wishbones
      [[-1.0, 0.6, -1.0], [1.0, 0.6, -1.0], [-1.0, 0.6, 1.2], [1.0, 0.6, 1.2]].forEach(pos => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.9, 6), chromeMat);
        arm.rotation.z = Math.PI / 2;
        arm.position.set(pos[0] * 0.9, pos[1], pos[2]);
        this.group.add(arm);
      });

      // Wide Open Racing Wheels
      [[-1.6, 0.62, 1.2], [1.6, 0.62, 1.2], [-1.5, 0.58, -1.1], [1.5, 0.58, -1.1]].forEach(pos => {
        const w = this.createChunkyWheel(pos, pos[2] > 0 ? 0.65 : 0.58, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(0, 0.85, 2.3)];

    } else {
      // =========================================================================
      // 8. CHIBI BULLDOZER - "Xe Lu Công Trình" (Friendly Work Dozer)
      // =========================================================================
      const bodyGeo = new THREE.BoxGeometry(2.4, 0.9, 3.8);
      const body = new THREE.Mesh(bodyGeo, this.paintMat);
      body.position.y = 1.05;
      this.group.add(body);
      this.bodyMesh = body;

      // Construction Roll Cage Cabin
      const cageMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.5 });
      const cageRoof = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.1, 1.8), this.paintMat);
      cageRoof.position.set(0, 2.2, 0.2);
      this.group.add(cageRoof);

      // 4 Roll cage pillars
      [[-0.9, 0.9], [0.9, 0.9], [-0.9, -0.6], [0.9, -0.6]].forEach(([x, z]) => {
        const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 1.15, 8), cageMat);
        pillar.position.set(x, 1.62, z + 0.2);
        this.group.add(pillar);
      });

      // Hazard Rotating Beacon on roof
      const beacon = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.3, 12), new THREE.MeshBasicMaterial({ color: 0xffaa00 }));
      beacon.position.set(0, 2.35, 0.2);
      this.group.add(beacon);
      this.animatedLights.push({ mesh: beacon, colorA: 0xffaa00, colorB: 0x553300, phase: 0 });

      // Front Big Scoop Blade
      const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffd000, metalness: 0.4, roughness: 0.3 });
      const blade = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.85, 0.3), bladeMat);
      blade.position.set(0, 0.65, -2.35);
      this.group.add(blade);

      // Hydraulic lift arms
      [-1.15, 1.15].forEach(x => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1.4, 8), chromeMat);
        arm.rotation.x = Math.PI * 0.38;
        arm.position.set(x, 0.85, -1.6);
        this.group.add(arm);
      });

      // Tall Smokestack Pipe on Side
      const stack = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 1.6, 8), chromeMat);
      stack.position.set(-1.0, 1.8, -0.6);
      const cap = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.25, 8), chromeMat);
      cap.position.set(-1.0, 2.65, -0.6);
      this.group.add(stack, cap);
      this.springProps.push(cap);

      // Extra Chunky Mud Tires
      [[-1.5, 0.78, 1.2], [1.5, 0.78, 1.2], [-1.5, 0.78, -1.0], [1.5, 0.78, -1.0]].forEach(pos => {
        const w = this.createChunkyWheel(pos, 0.78, tireMat, rimMat);
        this.wheels.push(w);
      });

      this.exhaustPoints = [new THREE.Vector3(-1.0, 2.65, -0.6)];
    }

    // Dynamic Headlights Glow
    const headMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const headGeo = new THREE.BoxGeometry(0.35, 0.2, 0.15);

    const hlLeft = new THREE.Mesh(headGeo, headMat); hlLeft.position.set(-0.8, 0.9, -2.2);
    const hlRight = new THREE.Mesh(headGeo, headMat); hlRight.position.set(0.8, 0.9, -2.2);
    this.group.add(hlLeft, hlRight);

    // Front Glowing Headlight Beams
    const beamGeo = new THREE.CylinderGeometry(0.2, 0.9, 8.0, 12, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    const beamL = new THREE.Mesh(beamGeo, beamMat);
    beamL.rotation.x = Math.PI * 0.48;
    beamL.position.set(-0.8, 0.8, -6.0);
    const beamR = beamL.clone();
    beamR.position.set(0.8, 0.8, -6.0);
    this.group.add(beamL, beamR);

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
      const baseY = (this.carModelId === 'buggy' ? 1.25 :
                     this.carModelId === 'interceptor' || this.carModelId === 'fire_truck' || this.carModelId === 'bulldozer' ? 1.05 : 0.82);
      this.bodyMesh.position.y = baseY + bounceY;
    }

    // Pitch: nose down when braking, nose up on speed
    const targetPitch = isBraking ? 0.05 : -0.02;
    this.pitch += (targetPitch - this.pitch) * 8 * dt;
    this.group.rotation.x = this.pitch;

    // Antenna & wobbly spring physics
    for (let prop of this.springProps) {
      prop.rotation.z = -this.roll * 1.5;
      prop.rotation.x = Math.sin(this.bobPhase * 1.5) * 0.15;
    }

    // Flashing emergency beacon lights (Fire Truck, Police, Dozer)
    const flashTimer = Date.now() * 0.008;
    for (let al of this.animatedLights) {
      const isOn = Math.sin(flashTimer + al.phase) > 0;
      al.mesh.material.color.setHex(isOn ? al.colorA : al.colorB);
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
