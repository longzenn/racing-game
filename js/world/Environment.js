/**
 * Procedural Scenery & 4 Colorful Kid-Friendly Environments
 */
class EnvironmentManager {
  constructor(scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.sceneryItems = [];
    this.clouds = [];
    this.currentTheme = 'rainbow';
    this.specialMesh = null;
  }

  setTheme(mapConfig) {
    this.currentTheme = mapConfig.themeStyle;
    this.clearAll();

    this.initGround(mapConfig);

    // Populate roadside objects
    for (let z = 10; z > -CONFIG.VIEW_DISTANCE; z -= 25) {
      this.spawnSceneryPair(z);
    }

    // Sky Clouds for daytime maps
    if (this.currentTheme === 'rainbow' || this.currentTheme === 'synthwave') {
      this.initClouds();
    }

    if (this.currentTheme === 'synthwave') {
      this.createSunsetSun();
    }
  }

  clearAll() {
    while (this.group.children.length > 0) {
      const obj = this.group.children[0];
      this.group.remove(obj);
    }
    this.sceneryItems = [];
    this.clouds = [];
    this.specialMesh = null;
  }

  initGround(mapConfig) {
    const groundGeo = new THREE.PlaneGeometry(300, CONFIG.VIEW_DISTANCE * 1.5, 1, 1);
    const groundMat = new THREE.MeshLambertMaterial({
      color: mapConfig.roadSideColor
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, -CONFIG.VIEW_DISTANCE / 2);
    this.group.add(ground);
  }

  initClouds() {
    for (let i = 0; i < 12; i++) {
      const cloud = this.createCloud();
      cloud.position.set(
        (Math.random() - 0.5) * 180,
        35 + Math.random() * 25,
        -Math.random() * 240
      );
      this.group.add(cloud);
      this.clouds.push(cloud);
    }
  }

  createCloud() {
    const cloud = new THREE.Group();
    const puffMat = new THREE.MeshLambertMaterial({ color: 0xffffff, transparent: true, opacity: 0.9 });
    const puffGeo = new THREE.SphereGeometry(4.5, 8, 8);

    for (let i = 0; i < 4; i++) {
      const puff = new THREE.Mesh(puffGeo, puffMat);
      puff.position.set((i - 1.5) * 3.5, (Math.random() - 0.5) * 1.5, (Math.random() - 0.5) * 2);
      puff.scale.set(1 + Math.random() * 0.4, 0.8 + Math.random() * 0.3, 1);
      cloud.add(puff);
    }
    return cloud;
  }

  createSunsetSun() {
    const sunGeo = new THREE.CircleGeometry(42, 32);
    const sunMat = new THREE.MeshBasicMaterial({
      color: 0xffdd00,
      side: THREE.DoubleSide
    });
    const sun = new THREE.Mesh(sunGeo, sunMat);
    sun.position.set(0, 32, -CONFIG.VIEW_DISTANCE + 20);
    this.group.add(sun);
    this.specialMesh = sun;
  }

  spawnSceneryPair(z) {
    const leftX = -CONFIG.ROAD_WIDTH / 2 - 10 - Math.random() * 20;
    const rightX = CONFIG.ROAD_WIDTH / 2 + 10 + Math.random() * 20;

    const leftItem = this.createItemForTheme();
    leftItem.position.set(leftX, 0, z);
    this.group.add(leftItem);
    this.sceneryItems.push(leftItem);

    const rightItem = this.createItemForTheme();
    rightItem.position.set(rightX, 0, z);
    this.group.add(rightItem);
    this.sceneryItems.push(rightItem);
  }

  createItemForTheme() {
    switch (this.currentTheme) {
      case 'rainbow':
        return Math.random() > 0.4 ? this.createCandyLollipop() : this.createCandyCastle();
      case 'synthwave':
        return this.createPalmTree();
      case 'desert':
        return Math.random() > 0.5 ? this.createCanyonRock() : this.createCactus();
      default:
        return this.createToyBuilding();
    }
  }

  // --- Giant Swirl Lollipop ---
  createCandyLollipop() {
    const popGroup = new THREE.Group();
    const stickGeo = new THREE.CylinderGeometry(0.55, 0.65, 12, 10);
    const stickMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const stick = new THREE.Mesh(stickGeo, stickMat);
    stick.position.y = 6;
    popGroup.add(stick);

    // Swirl Candy Head
    const headGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.2, 16);
    const colors = [0xff2a55, 0xff7a00, 0xffd000, 0x00d2ff, 0xff66cc];
    const headMat = new THREE.MeshLambertMaterial({
      color: colors[Math.floor(Math.random() * colors.length)]
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.rotation.x = Math.PI / 2;
    head.position.y = 12;
    popGroup.add(head);

    return popGroup;
  }

  // --- Fairytale Candy Castle ---
  createCandyCastle() {
    const castle = new THREE.Group();
    const baseGeo = new THREE.CylinderGeometry(3.5, 4.2, 14, 12);
    const baseMat = new THREE.MeshLambertMaterial({ color: 0xffeef2 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 7;
    castle.add(base);

    // Spire Cone
    const coneGeo = new THREE.ConeGeometry(4.6, 9, 12);
    const coneMat = new THREE.MeshLambertMaterial({ color: 0xff3399 });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.position.y = 18.5;
    castle.add(cone);

    return castle;
  }

  // --- Tropical Palm Tree ---
  createPalmTree() {
    const tree = new THREE.Group();
    const trunkGeo = new THREE.CylinderGeometry(0.7, 1.1, 14, 8);
    const trunkMat = new THREE.MeshLambertMaterial({ color: 0x8b5a2b });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 7;
    tree.add(trunk);

    const leafGeo = new THREE.ConeGeometry(5.0, 3.0, 6);
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x2ec4b6 });
    const leaves = new THREE.Mesh(leafGeo, leafMat);
    leaves.position.y = 14;
    leaves.rotation.x = Math.PI;
    tree.add(leaves);

    return tree;
  }

  // --- Toy City Building ---
  createToyBuilding() {
    const bGroup = new THREE.Group();
    const h = 25 + Math.random() * 35;
    const w = 10 + Math.random() * 8;
    const bGeo = new THREE.BoxGeometry(w, h, w);
    const legoColors = [0x3a86ff, 0xff006e, 0xffbe0b, 0xfb5607, 0x06d6a0];
    const bMat = new THREE.MeshLambertMaterial({
      color: legoColors[Math.floor(Math.random() * legoColors.length)]
    });
    const mesh = new THREE.Mesh(bGeo, bMat);
    mesh.position.y = h / 2;
    bGroup.add(mesh);
    return bGroup;
  }

  // --- Canyon Rock ---
  createCanyonRock() {
    const rock = new THREE.Group();
    const h = 20 + Math.random() * 25;
    const w = 12 + Math.random() * 15;
    const rGeo = new THREE.CylinderGeometry(w * 0.7, w, h, 6);
    const rMat = new THREE.MeshLambertMaterial({ color: 0xb5651d });
    const mesh = new THREE.Mesh(rGeo, rMat);
    mesh.position.y = h / 2;
    rock.add(mesh);
    return rock;
  }

  // --- Cactus ---
  createCactus() {
    const cactus = new THREE.Group();
    const mainGeo = new THREE.CylinderGeometry(1.0, 1.2, 12, 8);
    const cMat = new THREE.MeshLambertMaterial({ color: 0x2d6a4f });
    const main = new THREE.Mesh(mainGeo, cMat);
    main.position.y = 6;
    cactus.add(main);

    const armGeo = new THREE.CylinderGeometry(0.7, 0.7, 5, 8);
    const lArm = new THREE.Mesh(armGeo, cMat); lArm.position.set(-2.0, 7, 0); lArm.rotation.z = 0.4;
    const rArm = new THREE.Mesh(armGeo, cMat); rArm.position.set(2.0, 8, 0); rArm.rotation.z = -0.4;
    cactus.add(lArm, rArm);
    return cactus;
  }

  update(speed, dt) {
    const moveDist = speed * dt;

    for (let i = this.sceneryItems.length - 1; i >= 0; i--) {
      const item = this.sceneryItems[i];
      item.position.z += moveDist;

      if (item.position.z > 35) {
        item.position.z -= (CONFIG.VIEW_DISTANCE + 50);
        const isLeft = item.position.x < 0;
        item.position.x = (isLeft ? -1 : 1) * (CONFIG.ROAD_WIDTH / 2 + 10 + Math.random() * 22);
      }
    }

    // Gentle cloud floating
    for (let cloud of this.clouds) {
      cloud.position.z += speed * 0.25 * dt;
      if (cloud.position.z > 40) {
        cloud.position.z -= 280;
        cloud.position.x = (Math.random() - 0.5) * 180;
      }
    }
  }
}
