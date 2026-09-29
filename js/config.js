/**
 * Cyber Racer 3D - Kids Edition Configuration
 * 8 Colorful Maps & 8 Cute Cartoon Chibi Cars
 */
const CONFIG = {
  // 5 Lanes for easy steering & coin catching
  LANES: [-10, -5, 0, 5, 10],
  LANE_WIDTH: 5,
  ROAD_WIDTH: 26,
  SEGMENT_LENGTH: 15,
  TOTAL_SEGMENTS: 25,
  VIEW_DISTANCE: 250,

  // Speed and Difficulty Tiers for Kids
  SPEED_MODES: {
    cruise: {
      id: 'cruise',
      name: 'Bé Tập Lái',
      badge: 'DỄ NHẤT',
      badgeColor: '#00ff88',
      baseSpeed: 36,
      boostSpeed: 60,
      displayKmHMultiplier: 1.5,
      trafficFrequency: 3000,
      coinFrequency: 650,
      obstacleFrequency: 2400,
      powerupFrequency: 4500,
      scoreMultiplier: 1.0,
      desc: 'Tốc độ êm ái, rất nhiều đồng xu vàng, chướng ngại vật thưa thớt dễ né!'
    },
    sport: {
      id: 'sport',
      name: 'Tay Đua Nhí',
      badge: 'VỪA PHẢI',
      badgeColor: '#ffbb00',
      baseSpeed: 58,
      boostSpeed: 92,
      displayKmHMultiplier: 1.65,
      trafficFrequency: 1900,
      coinFrequency: 600,
      obstacleFrequency: 1600,
      powerupFrequency: 4000,
      scoreMultiplier: 1.5,
      desc: 'Tốc độ vui nhộn tiêu chuẩn, bé trổ tài phản xạ né nấm bắt xu!'
    },
    hyperspeed: {
      id: 'hyperspeed',
      name: 'Siêu Sao Tốc Độ',
      badge: 'THỬ THÁCH',
      badgeColor: '#ff0055',
      baseSpeed: 85,
      boostSpeed: 135,
      displayKmHMultiplier: 1.8,
      trafficFrequency: 1300,
      coinFrequency: 550,
      obstacleFrequency: 1200,
      powerupFrequency: 3500,
      scoreMultiplier: 2.2,
      desc: 'Chạy vèo vèo siêu nhanh, thử thách dành cho các bé siêu tay lái!'
    }
  },

  // 8 Colorful Maps for Kids
  MAPS: {
    rainbow: {
      id: 'rainbow',
      name: 'Cầu Vồng Kẹo Ngọt',
      tag: 'ĐƯỢC BÉ YÊU THÍCH',
      skyColor: 0x7ec8e3,
      fogColor: 0x9bd8ed,
      fogNear: 70,
      fogFar: 220,
      ambientColor: 0xffffff,
      ambientIntensity: 0.82,
      lightColor: 0xfff6cf,
      dirIntensity: 0.85,
      roadColor: 0x3a3f47,
      roadSideColor: 0x62c370,
      lineColor: 0xffffff,
      barrierColor: 0xff3399,
      weather: 'stardust',
      themeStyle: 'rainbow',
      musicStyle: 'happy',
      desc: 'Đường đua 7 sắc cầu vồng rực rỡ, thảm cỏ xanh, cây kẹo mút khổng lồ và lâu đài cổ tích.'
    },
    synthwave: {
      id: 'synthwave',
      name: 'Bãi Biển Hoàng Hôn',
      tag: 'BÃI CÁT VÀNG & DỪA XANH',
      skyColor: 0xffa07a,
      fogColor: 0xffb4a2,
      fogNear: 60,
      fogFar: 230,
      ambientColor: 0xffeedd,
      ambientIntensity: 0.85,
      lightColor: 0xff7733,
      dirIntensity: 0.9,
      roadColor: 0x2e3038,
      roadSideColor: 0xf4d06f,
      lineColor: 0xffea00,
      barrierColor: 0x00c49f,
      weather: 'stars',
      themeStyle: 'synthwave',
      musicStyle: 'synthwave',
      desc: 'Hoàng hôn bãi biển ấm áp rực rỡ với mặt trời tròn xoe và hàng dừa mát rượi.'
    },
    cyberpunk: {
      id: 'cyberpunk',
      name: 'Thành Phố Đồ Chơi',
      tag: 'ÁNH ĐÈN ĐÊM HUYỀN ẢO',
      skyColor: 0x141829,
      fogColor: 0x1b2038,
      fogNear: 50,
      fogFar: 220,
      ambientColor: 0x4a5585,
      ambientIntensity: 0.65,
      lightColor: 0x00f2ff,
      dirIntensity: 0.8,
      roadColor: 0x1e212b,
      roadSideColor: 0x11131a,
      lineColor: 0x00f2ff,
      barrierColor: 0xff007f,
      weather: 'rain',
      themeStyle: 'cyberpunk',
      musicStyle: 'cyber',
      desc: 'Thành phố tương lai của các bạn robot nhỏ với những tòa nhà xếp hình phát sáng.'
    },
    desert: {
      id: 'desert',
      name: 'Thung Lũng Khủng Long',
      tag: 'HẺM NÚI KHÁM PHÁ',
      skyColor: 0xdda15e,
      fogColor: 0xbc6c25,
      fogNear: 50,
      fogFar: 220,
      ambientColor: 0xdda15e,
      ambientIntensity: 0.8,
      lightColor: 0xffb703,
      dirIntensity: 0.85,
      roadColor: 0x3d2c1e,
      roadSideColor: 0x99582a,
      lineColor: 0xffd166,
      barrierColor: 0xe76f51,
      weather: 'dust',
      themeStyle: 'desert',
      musicStyle: 'desert',
      desc: 'Hẻm núi cát vàng huyền bí, cây xương rồng vui nhộn và đá sa thạch khổng lồ.'
    },
    arctic: {
      id: 'arctic',
      name: 'Xứ Sở Băng Tuyết',
      tag: 'NGƯỜI TUYẾT & BĂNG GIÁ',
      skyColor: 0x8ae0ff,
      fogColor: 0xc4efff,
      fogNear: 60,
      fogFar: 230,
      ambientColor: 0xebf8ff,
      ambientIntensity: 0.88,
      lightColor: 0xffffff,
      dirIntensity: 0.9,
      roadColor: 0x223040,
      roadSideColor: 0xf0faff,
      lineColor: 0x00f2ff,
      barrierColor: 0x00b4d8,
      weather: 'snow',
      themeStyle: 'arctic',
      musicStyle: 'arctic',
      desc: 'Thế giới băng tuyết lấp lánh với những chú người tuyết dễ thương, cây thông và nhà băng igloo.'
    },
    volcano: {
      id: 'volcano',
      name: 'Đảo Núi Lửa',
      tag: 'NHAM THẠCH ĐỎ RỰC',
      skyColor: 0x3d1318,
      fogColor: 0x5a1a1f,
      fogNear: 50,
      fogFar: 210,
      ambientColor: 0xff8866,
      ambientIntensity: 0.75,
      lightColor: 0xff5500,
      dirIntensity: 0.9,
      roadColor: 0x22181c,
      roadSideColor: 0x2a1410,
      lineColor: 0xff7700,
      barrierColor: 0xffaa00,
      weather: 'ember',
      themeStyle: 'volcano',
      musicStyle: 'volcano',
      desc: 'Vùng đất núi lửa sôi động với đá dung nham đỏ rực, tinh thể lửa và nham thạch kỳ thú.'
    },
    space: {
      id: 'space',
      name: 'Vũ Trụ Ngân Hà',
      tag: 'HÀNH TINH & VÌ SAO',
      skyColor: 0x090617,
      fogColor: 0x160d2e,
      fogNear: 50,
      fogFar: 230,
      ambientColor: 0x7b5ea7,
      ambientIntensity: 0.7,
      lightColor: 0xbd00ff,
      dirIntensity: 0.85,
      roadColor: 0x130e26,
      roadSideColor: 0x070412,
      lineColor: 0xd946ef,
      barrierColor: 0x00ffff,
      weather: 'stardust',
      themeStyle: 'space',
      musicStyle: 'space',
      desc: 'Đường đua giữa các vì sao lấp lánh, hành tinh Saturn khổng lồ có vành đai và đĩa bay UFO.'
    },
    forest: {
      id: 'forest',
      name: 'Rừng Nấm Thần Tiên',
      tag: 'ĐOM ĐÓM & HOA KHỔNG LỒ',
      skyColor: 0x0f2b20,
      fogColor: 0x184232,
      fogNear: 55,
      fogFar: 220,
      ambientColor: 0x40916c,
      ambientIntensity: 0.8,
      lightColor: 0x74c69d,
      dirIntensity: 0.85,
      roadColor: 0x1c2b22,
      roadSideColor: 0x0d3822,
      lineColor: 0xa3e635,
      barrierColor: 0x38bdf8,
      weather: 'stardust',
      themeStyle: 'forest',
      musicStyle: 'forest',
      desc: 'Khu rừng kỳ diệu với những cây nấm phát sáng to đùng, cây cổ thụ và hoa thần tiên rực rỡ.'
    }
  },

  // 8 Playable Chibi Cars for Kids
  CARS: {
    buggy: {
      id: 'buggy',
      name: 'Xe Mắt Tròn Bé Con',
      type: 'Cartoon Kart',
      handling: 1.35,
      acceleration: 1.1,
      desc: 'Chiếc xe mắt to tròn chớp chớp siêu đáng yêu từ bản demo, bo cua cực mượt!'
    },
    roadster: {
      id: 'roadster',
      name: 'Siêu Xe Tia Chớp',
      type: 'Hyper Sports',
      handling: 1.15,
      acceleration: 1.15,
      desc: 'Siêu xe thể thao màu sắc với dải kính râm ngầu và đèn LED lấp lánh.'
    },
    phantom: {
      id: 'phantom',
      name: 'Phi Thuyền Tốc Độ',
      type: 'Astro Rocket',
      handling: 1.05,
      acceleration: 1.25,
      desc: 'Cỗ máy phi thuyền vũ trụ với cánh phi cơ và động cơ phản lực cực ngầu.'
    },
    interceptor: {
      id: 'interceptor',
      name: 'Xe Quái Thú Bánh Bự',
      type: 'Monster Truck',
      handling: 0.95,
      acceleration: 1.2,
      desc: 'Chiếc xe quái thú bánh khổng lồ, gầm cao dũng mãnh và dàn đèn vương miện trên nóc.'
    },
    fire_truck: {
      id: 'fire_truck',
      name: 'Cứu Hỏa Tí Hon',
      type: 'Hero Truck',
      handling: 1.05,
      acceleration: 1.15,
      desc: 'Xe cứu hỏa đỏ tươi dũng cảm với thang cứu hộ trên nóc và đèn chớp siren vui nhộn!'
    },
    police: {
      id: 'police',
      name: 'Cảnh Sát Nhí',
      type: 'Patrol Kart',
      handling: 1.25,
      acceleration: 1.2,
      desc: 'Xe tuần tra cảnh sát nhanh nhẹn với thanh đèn siren nháy xanh đỏ siêu nổi bật!'
    },
    formula: {
      id: 'formula',
      name: 'Tên Lửa F1 Nhí',
      type: 'Formula Kart',
      handling: 1.4,
      acceleration: 1.3,
      desc: 'Siêu xe đua công thức 1 tí hon với cánh gió xé gió và bánh đua lộ thiên chuyên nghiệp!'
    },
    bulldozer: {
      id: 'bulldozer',
      name: 'Xe Lu Công Trình',
      type: 'Work Dozer',
      handling: 0.9,
      acceleration: 1.25,
      desc: 'Chiếc xe công trình bánh to tròn xoe với gầu cào dũng mãnh và ống khói đồ chơi ngộ nghĩnh!'
    }
  },

  // Bright Joyful Paint Colors for Kids
  COLORS: [
    { id: 'cyan', name: 'Xanh Da Trời', hex: 0x00d2ff, code: '#00d2ff' },
    { id: 'ruby', name: 'Đỏ Dâu Tây', hex: 0xff3366, code: '#ff3366' },
    { id: 'gold', name: 'Vàng Chuối', hex: 0xffcc00, code: '#ffcc00' },
    { id: 'pink', name: 'Hồng Kẹo Ngọt', hex: 0xff66cc, code: '#ff66cc' },
    { id: 'lime', name: 'Xanh Bạc Hà', hex: 0x00e676, code: '#00e676' },
    { id: 'purple', name: 'Tím Nho Mọng', hex: 0xaa00ff, code: '#aa00ff' }
  ],

  // Kid-friendly Power-ups (Nitro is automatic speed sprint upon pickup!)
  POWERUPS: {
    nitro: { duration: 5.0, name: 'SIÊU TỐC ĐỘ 🚀', color: '#ff3366', icon: '🚀', speedBonus: 1.4 },
    magnet: { duration: 8.0, name: 'NAM CHÂM HÚT XU 🧲', color: '#ffd000', icon: '🧲', radius: 26 },
    shield: { duration: 10.0, name: 'BONG BÓNG BẢO VỆ 🫧', color: '#00d2ff', icon: '🫧' },
    multiplier: { duration: 8.0, name: 'NHÂN ĐÔI ĐIỂM ⭐', color: '#ff66cc', icon: '⭐', mult: 2 }
  }
};
