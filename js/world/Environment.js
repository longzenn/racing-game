/**
 * Procedural Scenery & 8 Colorful Kid-Friendly Environments
 * 1. Rainbow Candy Castle & Giant Swirl Lollipops
 * 2. Sunset Beach Palm Trees & Golden Sun
 * 3. Toy City Lego Skyscrapers
 * 4. Dinosaur Valley Canyons & Cactuses
 * 5. Winter Wonderland Snowmen, Snow Pines & Igloos
 * 6. Lava Volcano Playground & Fire Crystals
 * 7. Galaxy Deep Space Saturn Planets, Asteroids & UFOs
 * 8. Enchanted Fairy Forest Giant Glowing Mushrooms & Flowers
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
    for (let z = 10; z > -CONFIG.VIEW_DISTANCE; z -= 24) {
      this.spawnSceneryPair(z);
    }

    // Sky Clouds for daytime maps
    if (this.currentTheme === 'rainbow' || this.currentTheme === 'synthwave' || this.currentTheme === 'arctic') {
      this.initClouds();
    }

    if (this.currentTheme === 'synthwave') {
      this.createSunsetSun();
    } else if (this.currentTheme === 'volcano') {
      this.createLavaMoon();
    } else if (this.currentTheme === 'space') {
      this.createSpaceGalaxyCenter();
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
    const groundGeo = new THREE.PlaneGeometry(320, CONFIG.VIEW_DISTANCE * 1.5, 1, 1);
    const groundMat = new THREE.MeshLambertMaterial({
      color: mapConfig.roadSideColor
    });

    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, -0.05, -CONFIG.VIEW_DISTANCE / 2);
    this.group.add(ground);
  }

  initClouds() {
    const isSnow = this.currentTheme === 'arctic';
    for (let i = 0; i < 14; i++) {
      const cloud = this.createCloud(isSnow);
      cloud.position.set(
        (Math.random() - 0.5) * 190,
        35 + Math.random() * 25,
        -Math.random() * 240
      );
      this.group.add(cloud);
      this.clouds.push(cloud);
    }
  }

  createCloud(isSnow = false) {
    const cloud = new THREE.Group();
    const puffMat = new THREE.MeshLambertMaterial({
      color: isSnow ? 0xe0f2fe : 0xffffff,
      transparent: true,
      opacity: 0.88
    });
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

  createLavaMoon() {
    const moonGeo = new THREE.CircleGeometry(36, 32);
    const moonMat = new THREE.MeshBasicMaterial({
      color: 0xff4500,
      side: THREE.DoubleSide
    });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(0, 36, -CONFIG.VIEW_DISTANCE + 20);
    this.group.add(moon);
    this.specialMesh = moon;
  }

  createSpaceGalaxyCenter() {
    const galaxyGeo = new THREE.CircleGeometry(45, 32);
    const galaxyMat = new THREE.MeshBasicMaterial({
      color: 0x9333ea,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const galaxy = new THREE.Mesh(galaxyGeo, galaxyMat);
    galaxy.position.set(0, 38, -CONFIG.VIEW_DISTANCE + 20);
    this.group.add(galaxy);
    this.specialMesh = galaxy;
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
      case 'arctic':
        const rArc = Math.random();
        return rArc > 0.65 ? this.createSnowman() : rArc > 0.3 ? this.createSnowPine() : this.createIgloo();
      case 'volcano':
        const rVol = Math.random();
        return rVol > 0.6 ? this.createVolcanoMini() : rVol > 0.3 ? this.createLavaCrystal() : this.createBasaltTower();
      case 'space':
        const rSpc = Math.random();
        return rSpc > 0.6 ? this.createSaturnPlanet() : rSpc > 0.3 ? this.createFloatingAsteroid() : this.createCuteUFO();
      case 'forest':
        const rFor = Math.random();
        return rFor > 0.6 ? this.createFantasyMushroom() : rFor > 0.3 ? this.createHollowTree() : this.createGiantFlower();
      default:
        return this.createToyBuilding();
    }
  }

  // =========================================================================
  // THEME 1: RAINBOW MAP ITEMS
  // =========================================================================
  createCandyLollipop() {
    const popGroup = new THREE.Group();
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 12, 10), new THREE.MeshLambertMaterial({ color: 0xffffff }));
    stick.position.y = 6;
    popGroup.add(stick);

    const colors = [0xff2a55, 0xff7a00, 0xffd000, 0x00d2ff, 0xff66cc];
    const head = new THREE.Mesh(
      new THREE.CylinderGeometry(3.5, 3.5, 1.2, 16),
      new THREE.MeshLambertMaterial({ color: colors[Math.floor(Math.random() * colors.length)] })
    );
    head.rotation.x = Math.PI / 2;
    head.position.y = 12;
    popGroup.add(head);

    return popGroup;
  }

  createCandyCastle() {
    const castle = new THREE.Group();
    const base = new THREE.Mesh(new THREE.CylinderGeometry(3.5, 4.2, 14, 12), new THREE.MeshLambertMaterial({ color: 0xffeef2 }));
    base.position.y = 7;
    castle.add(base);

    const cone = new THREE.Mesh(new THREE.ConeGeometry(4.6, 9, 12), new THREE.MeshLambertMaterial({ color: 0xff3399 }));
    cone.position.y = 18.5;
    castle.add(cone);

    return castle;
  }

  // =========================================================================
  // THEME 2: SYNTHWAVE PALM TREES
  // =========================================================================
  createPalmTree() {
    const tree = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 1.1, 14, 8), new THREE.MeshLambertMaterial({ color: 0x8b5a2b }));
    trunk.position.y = 7;
    tree.add(trunk);

    const leaves = new THREE.Mesh(new THREE.ConeGeometry(5.0, 3.0, 6), new THREE.MeshLambertMaterial({ color: 0x2ec4b6 }));
    leaves.position.y = 14;
    leaves.rotation.x = Math.PI;
    tree.add(leaves);

    return tree;
  }

  // =========================================================================
  // THEME 3: CYBERPUNK TOY BUILDINGS
  // =========================================================================
  createToyBuilding() {
    const bGroup = new THREE.Group();
    const h = 25 + Math.random() * 35;
    const w = 10 + Math.random() * 8;
    const legoColors = [0x3a86ff, 0xff006e, 0xffbe0b, 0xfb5607, 0x06d6a0];
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, w),
      new THREE.MeshLambertMaterial({ color: legoColors[Math.floor(Math.random() * legoColors.length)] })
    );
    mesh.position.y = h / 2;
    bGroup.add(mesh);
    return bGroup;
  }

  // =========================================================================
  // THEME 4: DESERT CANYON & CACTUS
  // =========================================================================
  createCanyonRock() {
    const rock = new THREE.Group();
    const h = 20 + Math.random() * 25;
    const w = 12 + Math.random() * 15;
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.7, w, h, 6), new THREE.MeshLambertMaterial({ color: 0xb5651d }));
    mesh.position.y = h / 2;
    rock.add(mesh);
    return rock;
  }

  createCactus() {
    const cactus = new THREE.Group();
    const cMat = new THREE.MeshLambertMaterial({ color: 0x2d6a4f });
    const main = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.2, 12, 8), cMat);
    main.position.y = 6;
    cactus.add(main);

    const lArm = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 5, 8), cMat); lArm.position.set(-2.0, 7, 0); lArm.rotation.z = 0.4;
    const rArm = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.7, 5, 8), cMat); rArm.position.set(2.0, 8, 0); rArm.rotation.z = -0.4;
    cactus.add(lArm, rArm);
    return cactus;
  }

  // =========================================================================
  // THEME 5: ARCTIC WINTER WONDERLAND (Snowmen, Snow Pines & Igloos)
  // =========================================================================
  createSnowman() {
    const group = new THREE.Group();
    const snowMat = new THREE.MeshLambertMaterial({ color: 0xf8fafc });

    // Bottom snowball
    const bBall = new THREE.Mesh(new THREE.SphereGeometry(3.2, 16, 14), snowMat);
    bBall.position.y = 3.2;
    // Top head
    const tBall = new THREE.Mesh(new THREE.SphereGeometry(2.1, 16, 14), snowMat);
    tBall.position.y = 7.4;
    group.add(bBall, tBall);

    // Carrot nose
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.4, 8), new THREE.MeshBasicMaterial({ color: 0xff7700 }));
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 7.4, 2.3);
    group.add(nose);

    // Cute coal eyes
    const coalMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    [-0.6, 0.6].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), coalMat);
      eye.position.set(x, 8.0, 1.8);
      group.add(eye);
    });

    // Top Hat
    const hat = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 2.0, 12), new THREE.MeshLambertMaterial({ color: 0x2563eb }));
    hat.position.set(0, 10.1, 0);
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 2.2, 0.25, 12), new THREE.MeshLambertMaterial({ color: 0x1d4ed8 }));
    brim.position.set(0, 9.2, 0);
    group.add(hat, brim);

    return group;
  }

  createSnowPine() {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 5, 8), new THREE.MeshLambertMaterial({ color: 0x5c3d2e }));
    trunk.position.y = 2.5;
    group.add(trunk);

    const greenMat = new THREE.MeshLambertMaterial({ color: 0x15803d });
    const snowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    [0, 3.5, 6.5].forEach((yOffset, idx) => {
      const radius = 5.2 - idx * 1.3;
      const cone = new THREE.Mesh(new THREE.ConeGeometry(radius, 4.5, 8), greenMat);
      cone.position.y = 5.5 + yOffset;
      group.add(cone);

      const snowCap = new THREE.Mesh(new THREE.ConeGeometry(radius * 0.7, 2.2, 8), snowMat);
      snowCap.position.y = 6.8 + yOffset;
      group.add(snowCap);
    });

    return group;
  }

  createIgloo() {
    const group = new THREE.Group();
    const iglooMat = new THREE.MeshLambertMaterial({ color: 0xe2e8f0 });
    const dome = new THREE.Mesh(new THREE.SphereGeometry(5.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), iglooMat);
    dome.position.y = 0;
    group.add(dome);

    const door = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 3.0, 10, 1, false, 0, Math.PI), iglooMat);
    door.rotation.z = Math.PI / 2;
    door.position.set(0, 1.0, 4.2);
    group.add(door);

    return group;
  }

  // =========================================================================
  // THEME 6: VOLCANO PLAYGROUND (Mini Volcanoes, Crystals & Basalt Towers)
  // =========================================================================
  createVolcanoMini() {
    const group = new THREE.Group();
    const rockMat = new THREE.MeshLambertMaterial({ color: 0x2b1c1d });
    const base = new THREE.Mesh(new THREE.CylinderGeometry(4.0, 9.5, 14, 10), rockMat);
    base.position.y = 7;
    group.add(base);

    // Glowing Lava Crater
    const crater = new THREE.Mesh(new THREE.CircleGeometry(3.6, 12), new THREE.MeshBasicMaterial({ color: 0xff4500 }));
    crater.rotation.x = -Math.PI / 2;
    crater.position.y = 14.05;
    group.add(crater);

    return group;
  }

  createLavaCrystal() {
    const group = new THREE.Group();
    const crystalMat = new THREE.MeshBasicMaterial({ color: 0xff3b00 });
    for (let i = 0; i < 4; i++) {
      const h = 8 + Math.random() * 8;
      const crystal = new THREE.Mesh(new THREE.OctahedronGeometry(1.6 + Math.random() * 0.8), crystalMat);
      crystal.scale.set(1, h / 3, 1);
      crystal.position.set((Math.random() - 0.5) * 4, h / 2, (Math.random() - 0.5) * 4);
      crystal.rotation.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
      group.add(crystal);
    }
    return group;
  }

  createBasaltTower() {
    const group = new THREE.Group();
    const bMat = new THREE.MeshLambertMaterial({ color: 0x1f1b24 });
    const h = 18 + Math.random() * 16;
    const tower = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.6, h, 6), bMat);
    tower.position.y = h / 2;
    group.add(tower);

    // Lava cap on top
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(3.3, 3.3, 0.8, 6), new THREE.MeshBasicMaterial({ color: 0xff7700 }));
    cap.position.y = h + 0.4;
    group.add(cap);

    return group;
  }

  // =========================================================================
  // THEME 7: SPACE GALAXY (Planets with Rings, Gem Asteroids & UFOs)
  // =========================================================================
  createSaturnPlanet() {
    const group = new THREE.Group();
    const colors = [0xd946ef, 0x06b6d4, 0xf59e0b, 0xec4899];
    const pColor = colors[Math.floor(Math.random() * colors.length)];

    const planet = new THREE.Mesh(new THREE.SphereGeometry(6.5, 20, 16), new THREE.MeshLambertMaterial({ color: pColor }));
    planet.position.y = 16;
    group.add(planet);

    // Planet Rings
    const ringGeo = new THREE.RingGeometry(8.5, 12.5, 24);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.8 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI * 0.4;
    ring.rotation.y = 0.3;
    ring.position.y = 16;
    group.add(ring);

    return group;
  }

  createFloatingAsteroid() {
    const group = new THREE.Group();
    const h = 8 + Math.random() * 10;
    const gemMat = new THREE.MeshStandardMaterial({ color: 0x6366f1, roughness: 0.3, metalness: 0.7 });
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(4.2), gemMat);
    rock.position.y = h;
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    group.add(rock);
    return group;
  }

  createCuteUFO() {
    const group = new THREE.Group();
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(4.8, 4.8, 0.9, 16), new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.8 }));
    saucer.position.y = 15;
    group.add(saucer);

    const dome = new THREE.Mesh(new THREE.SphereGeometry(2.4, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.8 }));
    dome.position.y = 15.4;
    group.add(dome);

    // Colorful rim lights
    const colors = [0xff0055, 0x00ffcc, 0xffea00, 0xaa00ff];
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), new THREE.MeshBasicMaterial({ color: colors[i % colors.length] }));
      lamp.position.set(Math.cos(angle) * 4.6, 15, Math.sin(angle) * 4.6);
      group.add(lamp);
    }
    return group;
  }

  // =========================================================================
  // THEME 8: ENCHANTED FAIRY FOREST (Giant Mushrooms, Trees & Flowers)
  // =========================================================================
  createFantasyMushroom() {
    const group = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.8, 11, 10), new THREE.MeshLambertMaterial({ color: 0xfdf4dc }));
    stem.position.y = 5.5;
    group.add(stem);

    const capColors = [0xec4899, 0x8b5cf6, 0x10b981, 0x3b82f6];
    const capColor = capColors[Math.floor(Math.random() * capColors.length)];
    const cap = new THREE.Mesh(new THREE.SphereGeometry(5.0, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshBasicMaterial({ color: capColor }));
    cap.position.y = 11;
    group.add(cap);

    // White polka dots on cap
    for (let i = 0; i < 5; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.65, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
      const angle = (i / 5) * Math.PI * 2;
      dot.position.set(Math.cos(angle) * 3.6, 13.5, Math.sin(angle) * 3.6);
      group.add(dot);
    }

    return group;
  }

  createHollowTree() {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(2.2, 3.2, 14, 10), new THREE.MeshLambertMaterial({ color: 0x4a2e1b }));
    trunk.position.y = 7;
    group.add(trunk);

    // Big fluffy spherical leaves canopy
    const leafMat = new THREE.MeshLambertMaterial({ color: 0x22c55e });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(6.5, 14, 12), leafMat);
    canopy.scale.set(1.1, 0.9, 1.1);
    canopy.position.y = 18;
    group.add(canopy);

    return group;
  }

  createGiantFlower() {
    const group = new THREE.Group();
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 10, 8), new THREE.MeshLambertMaterial({ color: 0x4ade80 }));
    stem.position.y = 5;
    group.add(stem);

    // Center Gold Core
    const core = new THREE.Mesh(new THREE.SphereGeometry(1.6, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
    core.position.y = 10;
    group.add(core);

    // Petals
    const petalColors = [0xf43f5e, 0xa855f7, 0x38bdf8, 0xfbbf24];
    const petalMat = new THREE.MeshBasicMaterial({ color: petalColors[Math.floor(Math.random() * petalColors.length)] });
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const petal = new THREE.Mesh(new THREE.SphereGeometry(1.3, 10, 10), petalMat);
      petal.scale.set(1.5, 1, 0.5);
      petal.position.set(Math.cos(angle) * 2.5, 10, Math.sin(angle) * 2.5);
      group.add(petal);
    }
    return group;
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
        cloud.position.x = (Math.random() - 0.5) * 190;
      }
    }
  }
}
