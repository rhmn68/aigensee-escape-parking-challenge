/**
 * Escape Parking Challenge - Kunci Jawaban & Panduan Solusi Lengkap (Level 1 - 5)
 * Disesuaikan 100% dengan Visual Gameplay Nyata (Bak Biru, Hatchback Cyan, Truk, Taxi Kuning, dll.)
 * di mana optimalSteps = threeStarThreshold (ambang batas optimal resmi dari game untuk 3 Bintang).
 * 
 * 🌐 Live URL Demo: https://glenrioariesto.github.io/escape-parking-challenge/
 * 📂 Repository: https://github.com/glenrioariesto/escape-parking-challenge
 */

export interface ParkingMoveAction {
  vehicleId: string;
  vehicleName: string;
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  description: string;
}

export interface EscapeParkingAnswer {
  levelId: number;
  name: string;
  difficulty: 'Mudah' | 'Sedang' | 'Menengah' | 'Sulit' | 'Ahli';
  optimalSteps: number; // Nilai optimal resmi game (sama persis dengan threeStarThreshold)
  threeStarThreshold: number; // Batas maksimal untuk mendapatkan 3 Bintang (= optimalSteps)
  moveCount: number; // Jumlah blok/perintah aksi algoritma
  totalDistance: number; // Total akumulasi jarak petak perpindahan
  liveUrl: string;
  strategySummary: string;
  algorithmSteps: ParkingMoveAction[];
  quizAnswers: {
    questionId: string;
    question: string;
    correctOptionIndex: number;
    correctAnswerText: string;
    explanation: string;
  }[];
}

export const escapeParkingAnswers: EscapeParkingAnswer[] = [
  // ── LEVEL 1 ─────────────────────────────────────────────────────────────────
  {
    levelId: 1,
    name: 'Tingkat 1: Blokade Sederhana',
    difficulty: 'Mudah',
    optimalSteps: 5,
    threeStarThreshold: 5,
    moveCount: 2,
    totalDistance: 5,
    liveUrl: 'https://glenrioariesto.github.io/escape-parking-challenge/',
    strategySummary: 'Cukup geser Bak Biru ke kanan 1 petak (jarak paling sedikit) agar kolom 6 bersih, lalu jalankan Taxi Kuning lurus ke bawah 4 petak menuju gerbang keluar (total 5 petak, tepat sama dengan optimalSteps game).',
    algorithmSteps: [
      {
        vehicleId: 'B',
        vehicleName: 'Bak Biru',
        direction: 'right',
        distance: 1,
        description: 'Pilih Bak Biru, geser ke kanan 1 petak (jarak paling sedikit) untuk mengosongkan jalur kolom 6.'
      },
      {
        vehicleId: 'R',
        vehicleName: 'Taxi Kuning',
        direction: 'down',
        distance: 4,
        description: 'Pilih Taxi Kuning, jalankan ke bawah 4 petak menuju garis finish/keluar.'
      }
    ],
    quizAnswers: [
      {
        questionId: 'q1_1',
        question: 'Kendaraan manakah yang menghalangi jalan keluar Taxi Kuning secara langsung?',
        correctOptionIndex: 0,
        correctAnswerText: 'Bak Biru',
        explanation: 'Bak Biru berada di baris 7 kolom 6-7, tepat di lintasan vertikal Taxi Kuning menuju gerbang keluar.'
      },
      {
        questionId: 'q1_2',
        question: 'Ke arah manakah Bak Biru harus digeser agar lintasan Taxi Kuning terbuka?',
        correctOptionIndex: 3,
        correctAnswerText: 'Mendatar ke kiri atau ke kanan untuk mengosongkan kolom 6',
        explanation: 'Karena Bak Biru berorientasi horizontal (mendatar), ia cukup digeser 1 petak ke kanan (atau ke kiri) agar kolom 6 menjadi kosong, sehingga Taxi Kuning bisa melaju ke bawah.'
      }
    ]
  },

  // ── LEVEL 2 ─────────────────────────────────────────────────────────────────
  {
    levelId: 2,
    name: 'Tingkat 2: Hambatan Berantai',
    difficulty: 'Sedang',
    optimalSteps: 6,
    threeStarThreshold: 6,
    moveCount: 3,
    totalDistance: 6,
    liveUrl: 'https://glenrioariesto.github.io/escape-parking-challenge/',
    strategySummary: 'Gunakan jarak minimal 1 petak: Geser Hatchback Cyan ke kiri 1 petak, geser Bak Putih ke kiri 1 petak (kolom 6 bersih), lalu jalankan Taxi Kuning ke bawah 4 petak (total 6 petak, tepat sama dengan optimalSteps game).',
    algorithmSteps: [
      {
        vehicleId: 'G',
        vehicleName: 'Hatchback Cyan',
        direction: 'left',
        distance: 1,
        description: 'Pilih Hatchback Cyan, geser ke kiri 1 petak (jarak paling sedikit) untuk memberi ruang bagi Bak Putih.'
      },
      {
        vehicleId: 'C',
        vehicleName: 'Bak Putih',
        direction: 'left',
        distance: 1,
        description: 'Pilih Bak Putih, geser ke kiri 1 petak (jarak paling sedikit) agar kolom 6 terbuka bersih.'
      },
      {
        vehicleId: 'R',
        vehicleName: 'Taxi Kuning',
        direction: 'down',
        distance: 4,
        description: 'Pilih Taxi Kuning, jalankan ke bawah 4 petak menuju gerbang keluar.'
      }
    ],
    quizAnswers: [
      {
        questionId: 'q2_1',
        question: 'Kendaraan manakah yang menghalangi jalan keluar Taxi Kuning secara langsung?',
        correctOptionIndex: 1,
        correctAnswerText: 'Bak Putih',
        explanation: 'Bak Putih berada di baris 7 kolom 5-6, sehingga secara langsung menutup lintasan vertikal Taxi Kuning di kolom 6.'
      },
      {
        questionId: 'q2_2',
        question: 'Urutan strategi atau algoritma logis manakah yang tepat untuk menyelesaikan tingkat ini?',
        correctOptionIndex: 2,
        correctAnswerText: 'Geser Hatchback Cyan ke kiri (atau Bak Biru ke kanan) → Geser Bak Putih ke samping → Geser Taxi Kuning ke bawah',
        explanation: 'Kita perlu membuka ruang gerak untuk Bak Putih dengan menggeser Hatchback Cyan ke kiri 1 petak terlebih dahulu, baru kemudian menggeser Bak Putih ke kiri 1 petak agar kolom 6 bersih, lalu menjalankan Taxi Kuning ke bawah.'
      }
    ]
  },

  // ── LEVEL 3 ─────────────────────────────────────────────────────────────────
  {
    levelId: 3,
    name: 'Tingkat 3: Labirin Parkir Padat',
    difficulty: 'Menengah',
    optimalSteps: 14,
    threeStarThreshold: 14,
    moveCount: 5,
    totalDistance: 14,
    liveUrl: 'https://glenrioariesto.github.io/escape-parking-challenge/',
    strategySummary: 'Jarak paling sedikit: Geser Truk Biru ke kiri 1 petak, turunkan Truk Cyan ke bawah 3 petak, geser Truk Abu-abu ke kanan 2 petak (ke kolom 8-10), lalu jalankan Taxi Kuning 2 dan Taxi Kuning 1 masing-masing 4 petak ke bawah (total 14 petak, tepat sama dengan optimalSteps game).',
    algorithmSteps: [
      {
        vehicleId: 'H',
        vehicleName: 'Truk Biru',
        direction: 'left',
        distance: 1,
        description: 'Pilih Truk Biru, geser ke kiri 1 petak (jarak paling sedikit) untuk membebaskan jalur kolom 3.'
      },
      {
        vehicleId: 'G',
        vehicleName: 'Truk Cyan',
        direction: 'down',
        distance: 3,
        description: 'Pilih Truk Cyan, geser ke bawah 3 petak (ke baris 8-10) untuk mengosongkan baris 7 kolom 9 bagi Truk Abu-abu.'
      },
      {
        vehicleId: 'D',
        vehicleName: 'Truk Abu-abu',
        direction: 'right',
        distance: 2,
        description: 'Pilih Truk Abu-abu, geser ke kanan 2 petak saja (jarak paling sedikit, ke kolom 8-10) mengosongkan lintasan Taxi Kuning 1 di kolom 7.'
      },
      {
        vehicleId: 'T',
        vehicleName: 'Taxi Kuning 2',
        direction: 'down',
        distance: 4,
        description: 'Pilih Taxi Kuning 2, jalankan ke bawah 4 petak keluar melalui gerbang bawah (kolom 3).'
      },
      {
        vehicleId: 'R',
        vehicleName: 'Taxi Kuning 1',
        direction: 'down',
        distance: 4,
        description: 'Pilih Taxi Kuning 1, jalankan ke bawah 4 petak keluar melalui gerbang bawah (kolom 7).'
      }
    ],
    quizAnswers: [
      {
        questionId: 'q3_1',
        question: 'Kendaraan manakah yang menghalangi jalan keluar Taxi Kuning 2 secara langsung di kolom 3?',
        correctOptionIndex: 3,
        correctAnswerText: 'Truk Biru',
        explanation: 'Truk Biru melintang di baris 7 kolom 1-3, sehingga secara langsung menutup lintasan vertikal Taxi Kuning 2 di kolom 3.'
      },
      {
        questionId: 'q3_2',
        question: 'Bagaimana cara yang logis untuk memindahkan Truk Abu-abu agar tidak menghalangi jalan keluar Taxi Kuning 1 (kolom 7)?',
        correctOptionIndex: 0,
        correctAnswerText: 'Geser Truk Cyan ke bawah terlebih dahulu, lalu geser Truk Abu-abu ke kanan',
        explanation: 'Truk Cyan di kolom 9 menghalangi Truk Abu-abu untuk bergeser ke kanan. Dengan menurunkan Truk Cyan ke bawah 3 petak, Truk Abu-abu memiliki ruang untuk bergeser 2 petak ke kanan sehingga kolom 7 menjadi bersih untuk Taxi Kuning 1.'
      }
    ]
  },

  // ── LEVEL 4 ─────────────────────────────────────────────────────────────────
  {
    levelId: 4,
    name: 'Tingkat 4: Labirin 3 Taxi',
    difficulty: 'Sulit',
    optimalSteps: 16,
    threeStarThreshold: 16,
    moveCount: 7,
    totalDistance: 16,
    liveUrl: 'https://glenrioariesto.github.io/escape-parking-challenge/',
    strategySummary: 'Jarak paling sedikit: 1) Zona Atas: Truk Abu-abu ke kanan 2 petak, Taxi Kuning 1 ke atas 3 petak; Truk Biru ke kiri 1 petak, Taxi Kuning 3 ke atas 3 petak. 2) Zona Bawah: Jeep Hijau ke kiri 2 petak, Truk Oren ke kiri 2 petak, lalu Taxi Kuning 2 ke bawah 3 petak (optimalSteps = 2 + 3 + 1 + 3 + 2 + 2 + 3 = 16 petak, tepat sesuai target game).',
    algorithmSteps: [
      {
        vehicleId: 'D',
        vehicleName: 'Truk Abu-abu',
        direction: 'right',
        distance: 2,
        description: 'Pilih Truk Abu-abu, geser ke kanan 2 petak (ke kolom 8-10) untuk mengosongkan lintasan Taxi Kuning 1 di kolom 7.'
      },
      {
        vehicleId: 'R',
        vehicleName: 'Taxi Kuning 1',
        direction: 'up',
        distance: 3,
        description: 'Pilih Taxi Kuning 1, jalankan ke atas 3 petak keluar melalui gerbang EXIT atas (kolom 7).'
      },
      {
        vehicleId: 'H',
        vehicleName: 'Truk Biru',
        direction: 'left',
        distance: 1,
        description: 'Pilih Truk Biru, geser ke kiri 1 petak (jarak paling sedikit, ke kolom 0-2) untuk mengosongkan lintasan Taxi Kuning 3 di kolom 3.'
      },
      {
        vehicleId: 'T',
        vehicleName: 'Taxi Kuning 3',
        direction: 'up',
        distance: 3,
        description: 'Pilih Taxi Kuning 3, jalankan ke atas 3 petak keluar melalui gerbang EXIT atas (kolom 3).'
      },
      {
        vehicleId: 'J',
        vehicleName: 'Jeep Hijau',
        direction: 'left',
        distance: 2,
        description: 'Pilih Jeep Hijau, geser ke kiri 2 petak (ke kolom 0-1) membuka ruang minimal 2 petak bagi Truk Oren.'
      },
      {
        vehicleId: 'P',
        vehicleName: 'Truk Oren',
        direction: 'left',
        distance: 2,
        description: 'Pilih Truk Oren, geser ke kiri 2 petak (ke kolom 2-4) untuk mengosongkan lintasan keluar Taxi Kuning 2 di kolom 5.'
      },
      {
        vehicleId: 'S',
        vehicleName: 'Taxi Kuning 2',
        direction: 'down',
        distance: 3,
        description: 'Pilih Taxi Kuning 2, jalankan ke bawah 3 petak keluar melalui gerbang EXIT bawah (kolom 5).'
      }
    ],
    quizAnswers: [
      {
        questionId: 'q4_1',
        question: 'Kendaraan manakah yang secara langsung menghalangi jalan keluar Taxi Kuning 1 ke atas di kolom 7?',
        correctOptionIndex: 2,
        correctAnswerText: 'Truk Abu-abu',
        explanation: 'Truk Abu-abu melintang di baris 2 kolom 6-8, tepat menutup lintasan vertikal Taxi Kuning 1 di kolom 7 menuju gerbang EXIT atas.'
      },
      {
        questionId: 'q4_2',
        question: 'Bagaimana cara yang logis untuk membebaskan Taxi Kuning 2 agar bisa keluar ke bawah melalui kolom 5?',
        correctOptionIndex: 1,
        correctAnswerText: 'Geser Jeep Hijau ke kiri (atau Sedan Merah ke kanan) → Geser Truk Oren ke samping → Geser Taxi Kuning 2 ke bawah',
        explanation: 'Truk Oren di baris 8 kolom 4-6 menghalangi Taxi Kuning 2. Namun Truk Oren terkunci oleh Jeep Hijau di kiri dan Sedan Merah di kanan. Kita perlu menggeser Jeep Hijau ke kiri atau Sedan Merah ke kanan terlebih dahulu agar Truk Oren memiliki ruang untuk bergeser ke samping, baru Taxi Kuning 2 bisa meluncur ke bawah.'
      }
    ]
  },

  // ── LEVEL 5 ─────────────────────────────────────────────────────────────────
  {
    levelId: 5,
    name: 'Tingkat 5: Kemacetan Total 5 Taxi (Grand Master)',
    difficulty: 'Ahli',
    optimalSteps: 23,
    threeStarThreshold: 23,
    moveCount: 11,
    totalDistance: 23,
    liveUrl: 'https://glenrioariesto.github.io/escape-parking-challenge/',
    strategySummary: 'Jarak paling sedikit: 1) Zona Atas: Truk Abu-abu ke kiri 2 petak, Truk Biru ke kanan 1 petak saja (ke kolom 8-10), Taxi Kuning 1 dan 3 ke atas 3 petak. 2) Zona Bawah: Truk Oren ke kiri 1 petak, Taxi Kuning 2 ke bawah 3 petak; Truk Hijau ke kiri 1 petak, Taxi Kuning 5 ke bawah 3 petak; Truk Merah ke kanan 1 petak, Truk Hijau ke kanan 2 petak, lalu Taxi Kuning 4 ke bawah 3 petak (optimalSteps = 2 + 1 + 3 + 3 + 1 + 3 + 1 + 3 + 1 + 2 + 3 = 23 petak, tepat sesuai target game).',
    algorithmSteps: [
      {
        vehicleId: 'D',
        vehicleName: 'Truk Abu-abu',
        direction: 'left',
        distance: 2,
        description: 'Pilih Truk Abu-abu, geser ke kiri 2 petak (ke kolom 0-2) mengosongkan jalur Taxi Kuning 1 di kolom 3.'
      },
      {
        vehicleId: 'H',
        vehicleName: 'Truk Biru',
        direction: 'right',
        distance: 1,
        description: 'Pilih Truk Biru, geser ke kanan 1 petak saja (jarak paling sedikit, ke kolom 8-10) mengosongkan jalur Taxi Kuning 3 di kolom 7.'
      },
      {
        vehicleId: 'R',
        vehicleName: 'Taxi Kuning 1',
        direction: 'up',
        distance: 3,
        description: 'Pilih Taxi Kuning 1, jalankan ke atas 3 petak keluar gerbang atas (kolom 3).'
      },
      {
        vehicleId: 'T',
        vehicleName: 'Taxi Kuning 3',
        direction: 'up',
        distance: 3,
        description: 'Pilih Taxi Kuning 3, jalankan ke atas 3 petak keluar gerbang atas (kolom 7).'
      },
      {
        vehicleId: 'J',
        vehicleName: 'Truk Oren',
        direction: 'left',
        distance: 1,
        description: 'Pilih Truk Oren, geser ke kiri 1 petak (jarak paling sedikit) mengosongkan jalur Taxi Kuning 2 di kolom 3.'
      },
      {
        vehicleId: 'S',
        vehicleName: 'Taxi Kuning 2',
        direction: 'down',
        distance: 3,
        description: 'Pilih Taxi Kuning 2, jalankan ke bawah 3 petak keluar gerbang bawah (kolom 3).'
      },
      {
        vehicleId: 'P',
        vehicleName: 'Truk Hijau',
        direction: 'left',
        distance: 1,
        description: 'Pilih Truk Hijau, geser ke kiri 1 petak (jarak paling sedikit) mengosongkan jalur Taxi Kuning 5 di kolom 7.'
      },
      {
        vehicleId: 'V',
        vehicleName: 'Taxi Kuning 5',
        direction: 'down',
        distance: 3,
        description: 'Pilih Taxi Kuning 5, jalankan ke bawah 3 petak keluar gerbang bawah (kolom 7).'
      },
      {
        vehicleId: 'N',
        vehicleName: 'Truk Merah',
        direction: 'right',
        distance: 1,
        description: 'Pilih Truk Merah, geser ke kanan 1 petak (jarak paling sedikit, ke kolom 9-11) membuka ruang kolom 8 bagi Truk Hijau.'
      },
      {
        vehicleId: 'P',
        vehicleName: 'Truk Hijau',
        direction: 'right',
        distance: 2,
        description: 'Pilih Truk Hijau, geser ke kanan 2 petak (ke kolom 6-8) mengosongkan jalur tengah bagi Taxi Kuning 4 di kolom 5.'
      },
      {
        vehicleId: 'U',
        vehicleName: 'Taxi Kuning 4',
        direction: 'down',
        distance: 3,
        description: 'Pilih Taxi Kuning 4, jalankan ke bawah 3 petak keluar gerbang bawah (kolom 5).'
      }
    ],
    quizAnswers: [
      {
        questionId: 'q5_1',
        question: 'Kendaraan manakah yang secara langsung menghalangi jalan keluar Taxi Kuning 1 (kolom 3) dan Taxi Kuning 3 (kolom 7) ke atas di area atas?',
        correctOptionIndex: 0,
        correctAnswerText: 'Truk Abu-abu dan Truk Biru',
        explanation: 'Truk Abu-abu (kolom 2-4) dan Truk Biru (kolom 7-9) melintang di baris 2, secara langsung menutup lintasan vertikal Taxi Kuning 1 (kolom 3) dan Taxi Kuning 3 (kolom 7) menuju gerbang EXIT atas.'
      },
      {
        questionId: 'q5_2',
        question: 'Bagaimana urutan strategi yang tepat untuk membebaskan 3 Taxi di area bawah (Taxi Kuning 2, Taxi Kuning 4, dan Taxi Kuning 5)?',
        correctOptionIndex: 1,
        correctAnswerText: 'Geser Jeep Putih ke kiri (atau Truk Merah ke kanan) → Geser Truk Oren dan Truk Hijau ke samping → Bebaskan Taxi Kuning 2, Taxi Kuning 4, dan Taxi Kuning 5 ke bawah',
        explanation: 'Truk Oren dan Truk Hijau di baris 8 menghalangi jalur keluar ketiga Taxi di bawah. Dengan menggeser Mobil Jeep Putih atau Truk Merah terlebih dahulu, ruang gerak horizontal Truk Oren dan Truk Hijau terbuka sehingga jalur keluar Taxi Kuning 2, Taxi Kuning 4, dan Taxi Kuning 5 menjadi bersih.'
      }
    ]
  }
];

export const projectMeta = {
  title: 'Escape Parking Challenge',
  url: 'https://glenrioariesto.github.io/escape-parking-challenge/',
  github: 'https://github.com/glenrioariesto/escape-parking-challenge'
};
