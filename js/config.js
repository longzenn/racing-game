/**
 * Cyber Racer 3D - Kids Edition Configuration
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

  // 4 Colorful Maps
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
      roadSideColor: 0x62c370, // Thảm cỏ xanh mướt hai bên
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
      roadSideColor: 0xf4d06f, // Bãi cát vàng
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
    }
  },

  // Playable Cars - Default is Buggy from demo!
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
      desc: 'Siêu xe thể thao màu sắc với dải đèn LED lấp lánh.'
    },
    phantom: {
      id: 'phantom',
      name: 'Phi Thuyền Tốc Độ',
      type: 'Supercar',
      handling: 1.05,
      acceleration: 1.25,
      desc: 'Cỗ máy tốc độ với cánh gió thể thao phía sau cực ngầu.'
    },
    interceptor: {
      id: 'interceptor',
      name: 'Xe Bọc Thép Tí Hon',
      type: 'Muscle Kart',
      handling: 0.95,
      acceleration: 1.2,
      desc: 'Chiếc xe cơ bắp dũng mãnh, tiếng nổ máy píp píp vui tai.'
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
