import { LevelDefinition } from "./types";

export const LEVELS: LevelDefinition[] = [
  {
    id: 1,
    name: "Tingkat 1: Blokade Sederhana",
    description: "Kenali pola gerakan dasar tempat parkir. Taxi Kuning terperangkap secara vertikal di kolom 6. Geser Mobil Biru yang mendatar ke samping untuk membebaskannya!",
    difficulty: "Mudah",
    optimalSteps: 5,
    gridRows: 11,
    gridCols: 12,
    exitRow: 2,
    vehicles: [
      {
        id: "R",
        direction: "vertical",
        row: 5,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true
      },
      {
        id: "A",
        direction: "vertical",
        row: 5,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Merah"
      },
      {
        id: "B",
        direction: "horizontal",
        row: 7,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Biru"
      },
      {
        id: "C",
        direction: "vertical",
        row: 5,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Putih"
      },
      {
        id: "D",
        direction: "vertical",
        row: 5,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Hijau"
      },
      {
        id: "E",
        direction: "vertical",
        row: 5,
        col: 9,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Abu-abu"
      }
    ],
    quizQuestions: [
      {
        id: "q1_1",
        question: "Kendaraan manakah yang menghalangi jalan keluar [1] Taxi Kuning secara langsung?",
        options: ["[6] Bak Biru", "Tidak ada", "[2] Bak Merah", "Semua mobil"],
        correctAnswerIndex: 0,
        explanation: "[6] Bak Biru berada di baris 7 kolom 6-7, tepat di lintasan vertikal [1] Taxi Kuning menuju gerbang keluar."
      },
      {
        id: "q1_2",
        question: "Ke arah manakah [6] Bak Biru harus digeser agar lintasan [1] Taxi Kuning terbuka?",
        options: ["Hanya bisa digeser ke kanan", "Ke atas atau ke bawah secara vertikal", "Tidak bisa digeser sama sekali", "Mendatar ke kiri atau ke kanan untuk mengosongkan kolom 6"],
        correctAnswerIndex: 3,
        explanation: "Karena [6] Bak Biru berorientasi horizontal (mendatar), ia cukup digeser 1 petak ke kanan (atau ke kiri) agar kolom 6 menjadi kosong, sehingga [1] Taxi Kuning bisa melaju ke bawah."
      }
    ],
    walls: [{"row":4,"col":1},{"row":4,"col":2},{"row":4,"col":3},{"row":4,"col":4},{"row":4,"col":5},{"row":4,"col":6},{"row":4,"col":7},{"row":4,"col":8},{"row":4,"col":9},{"row":4,"col":10}],
    focus: "Berpikir Komputasional - Pengenalan Pola dan Algoritma Dasar: Mengenali pola gerakan kendaraan agar dapat menyusun urutan langkah sederhana untuk membebaskan Taxi Kuning.",
    outcomes: [
      "Mengenali kendaraan yang menghalangi jalan keluar Taxi Kuning.",
      "Menentukan arah potensial kendaraan berdasarkan orientasinya (mendatar/tegak).",
      "Menyusun urutan langkah berurutan untuk membebaskan jalan keluar."
    ]
  },
  {
    id: 2,
    name: "Tingkat 2: Hambatan Berantai",
    description: "Tantangan mulai meningkat! Papan parkir vertikal seperti Tingkat 1. Taxi Kuning terhalang langsung oleh Mobil Putih, namun Mobil Putih sendiri terkunci oleh Mobil Cyan di kiri dan Mobil Biru di kanan. Bebaskan kuncian ini!",
    difficulty: "Sedang",
    optimalSteps: 6,
    gridRows: 11,
    gridCols: 12,
    exitRow: 2,
    vehicles: [
      {
        id: "R",
        direction: "vertical",
        row: 5,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true
      },
      {
        id: "A",
        direction: "vertical",
        row: 5,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Merah"
      },
      {
        id: "B",
        direction: "horizontal",
        row: 7,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Biru"
      },
      {
        id: "C",
        direction: "horizontal",
        row: 7,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Putih"
      },
      {
        id: "D",
        direction: "vertical",
        row: 5,
        col: 9,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Hijau"
      },
      {
        id: "E",
        direction: "vertical",
        row: 5,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cokelat"
      },
      {
        id: "F",
        direction: "vertical",
        row: 5,
        col: 2,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cyan"
      },
      {
        id: "G",
        direction: "horizontal",
        row: 7,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cyan"
      }
    ],
    quizQuestions: [
      {
        id: "q2_1",
        question: "Kendaraan manakah yang menghalangi jalan keluar [1] Taxi Kuning secara langsung?",
        options: ["Tidak ada", "[7] Bak Putih", "[8] Bak Biru dan [4] Hatchback Abu-abu", "Semua mobil"],
        correctAnswerIndex: 1,
        explanation: "[7] Bak Putih berada di baris 7 kolom 5-6, sehingga secara langsung menutup lintasan vertikal [1] Taxi Kuning di kolom 6."
      },
      {
        id: "q2_2",
        question: "Urutan strategi atau algoritma logis manakah yang tepat untuk menyelesaikan tingkat ini?",
        options: [
          "Geser [1] Taxi Kuning ke bawah langsung",
          "Geser [3] Bak Merah ke bawah → Geser [1] Taxi Kuning ke bawah",
          "Geser [6] Hatchback Cyan ke kiri (atau [8] Bak Biru ke kanan) → Geser [7] Bak Putih ke samping → Geser [1] Taxi Kuning ke bawah",
          "Geser [1] Taxi Kuning ke atas"
        ],
        correctAnswerIndex: 2,
        explanation: "Kita perlu membuka ruang gerak untuk [7] Bak Putih dengan menggeser [6] Hatchback Cyan ke kiri 1 petak terlebih dahulu, baru kemudian menggeser [7] Bak Putih ke kiri 1 petak agar kolom 6 bersih, lalu menjalankan [1] Taxi Kuning ke bawah."
      }
    ],
    focus: "Berpikir Komputasional - Dekomposisi: Menguraikan masalah kemacetan yang berantai menjadi langkah-langkah kecil yang saling bergantung.",
    outcomes: [
      "Mengidentifikasi kendaraan yang terkunci oleh kendaraan lain (hambatan berantai).",
      "Menentukan urutan pelepasan yang tepat agar setiap kendaraan dapat bergerak.",
      "Menyusun algoritma bertahap untuk mengosongkan kolom jalan keluar."
    ]
  },
  {
    id: 3,
    name: "Tingkat 3: Labirin Parkir Padat",
    description: "Tantangan parkir dengan dua Taxi Kuning yang terhalang jalan keluarnya oleh Truk Abu-abu yang sangat panjang. Geser truk tersebut untuk membebaskan kedua Taxi!",
    difficulty: "Menengah",
    optimalSteps: 14,
    gridRows: 11,
    gridCols: 12,
    exitRow: 2,
    vehicles: [
      {
        id: "R",
        direction: "vertical",
        row: 5,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true
      },
      {
        id: "T",
        direction: "vertical",
        row: 5,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 3
      },
      {
        id: "A",
        direction: "vertical",
        row: 5,
        col: 4,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Merah"
      },
      {
        id: "B",
        direction: "vertical",
        row: 5,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Biru"
      },
      {
        id: "D",
        direction: "horizontal",
        row: 7,
        col: 6,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Abu-abu"
      },
      {
        id: "E",
        direction: "vertical",
        row: 5,
        col: 2,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cokelat"
      },
      {
        id: "F",
        direction: "horizontal",
        row: 7,
        col: 4,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cyan"
      },
      {
        id: "G",
        direction: "vertical",
        row: 5,
        col: 9,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Cyan"
      },
      {
        id: "H",
        direction: "horizontal",
        row: 7,
        col: 1,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Biru"
      }
    ],
    quizQuestions: [
      {
        id: "q3_1",
        question: "Kendaraan manakah yang menghalangi jalan keluar [1] Taxi Kuning secara langsung di kolom 3?",
        options: ["[9] Truk Abu-abu", "[3] Hatchback Abu-abu", "[5] Hatchback Biru", "[7] Truk Biru"],
        correctAnswerIndex: 3,
        explanation: "[7] Truk Biru melintang di baris 7 kolom 1-3, sehingga secara langsung menutup lintasan vertikal [1] Taxi Kuning di kolom 3."
      },
      {
        id: "q3_2",
        question: "Bagaimana cara yang logis untuk memindahkan [9] Truk Abu-abu agar tidak menghalangi jalan keluar [2] Taxi Kuning (kolom 7)?",
        options: [
          "Geser [6] Truk Cyan ke bawah terlebih dahulu, lalu geser [9] Truk Abu-abu ke kanan",
          "Langsung geser [9] Truk Abu-abu ke atas",
          "[9] Truk Abu-abu tidak perlu dipindahkan",
          "Geser [5] Hatchback Biru ke kanan, lalu geser [9] Truk Abu-abu ke kiri"
        ],
        correctAnswerIndex: 0,
        explanation: "[6] Truk Cyan di kolom 9 menghalangi [9] Truk Abu-abu untuk bergeser ke kanan. Dengan menurunkan [6] Truk Cyan ke bawah 3 petak, [9] Truk Abu-abu memiliki ruang untuk bergeser 2 petak ke kanan sehingga kolom 7 menjadi bersih untuk [2] Taxi Kuning."
      }
    ],
    focus: "Berpikir Komputasional - Abstraksi: Memilah informasi penting (kendaraan penghambat) dari detail yang tidak relevan untuk merancang strategi labirin parkir padat.",
    outcomes: [
      "Menemukan kendaraan terpanjang yang menjadi hambatan utama (dekomposisi).",
      "Merancang urutan langkah efisien untuk membebaskan dua Taxi Kuning.",
      "Membaca dan menjelaskan alasan di balik setiap langkah yang dipilih."
    ]
  },
  {
    id: 4,
    name: "Tingkat 4: Labirin 3 Taxi",
    description: "Tantangan parkir tingkat lanjut! Terdapat tiga Taxi Kuning yang harus dibebaskan dari kepungan kendaraan. Susun strategi paling efisien untuk meloloskan ketiganya!",
    difficulty: "Sulit",
    optimalSteps: 16,
    gridRows: 11,
    gridCols: 12,
    exitRow: 2,
    vehicles: [
      {
        id: "R",
        direction: "vertical",
        row: 3,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true
      },
      {
        id: "T",
        direction: "vertical",
        row: 3,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 3
      },
      {
        id: "S",
        direction: "vertical",
        row: 6,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 5
      },
      {
        id: "A",
        direction: "vertical",
        row: 3,
        col: 4,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Merah"
      },
      {
        id: "B",
        direction: "vertical",
        row: 3,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Biru"
      },
      {
        id: "D",
        direction: "horizontal",
        row: 2,
        col: 6,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Abu-abu"
      },
      {
        id: "E",
        direction: "vertical",
        row: 3,
        col: 2,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cokelat"
      },
      {
        id: "F",
        direction: "horizontal",
        row: 2,
        col: 4,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cyan"
      },
      {
        id: "H",
        direction: "horizontal",
        row: 2,
        col: 1,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Biru"
      },
      {
        id: "J",
        direction: "horizontal",
        row: 8,
        col: 2,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Jeep Hijau"
      },
      {
        id: "P",
        direction: "horizontal",
        row: 8,
        col: 4,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Oren"
      },
      {
        id: "K",
        direction: "vertical",
        row: 6,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Jeep Putih"
      },
      {
        id: "L",
        direction: "vertical",
        row: 6,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Sedan Hijau"
      },
      {
        id: "N",
        direction: "horizontal",
        row: 8,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Sedan Merah"
      }
    ],
    quizQuestions: [
      {
        id: "q4_1",
        question: "Kendaraan manakah yang secara langsung menghalangi jalan keluar [2] Taxi Kuning ke atas di kolom 7?",
        options: ["[9] Mobil Biru", "[4] Truk Biru", "[6] Truk Abu-abu", "[11] Sedan Hijau"],
        correctAnswerIndex: 2,
        explanation: "[6] Truk Abu-abu melintang di baris 2 kolom 6-8, tepat menutup lintasan vertikal [2] Taxi Kuning di kolom 7 menuju gerbang EXIT atas."
      },
      {
        id: "q4_2",
        question: "Bagaimana cara yang logis untuk membebaskan [3] Taxi Kuning agar bisa keluar ke bawah melalui kolom 5?",
        options: [
          "Langsung geser [3] Taxi Kuning ke bawah tanpa memindahkan kendaraan lain",
          "Geser [12] Jeep Hijau ke kiri (atau [14] Sedan Merah ke kanan) → Geser [13] Truk Oren ke samping → Geser [3] Taxi Kuning ke bawah",
          "Geser [13] Truk Oren ke atas agar tidak menghalangi",
          "Geser [10] Jeep Putih ke atas melewati dinding pembatas"
        ],
        correctAnswerIndex: 1,
        explanation: "[13] Truk Oren di baris 8 kolom 4-6 menghalangi [3] Taxi Kuning. Namun [13] Truk Oren terkunci oleh [12] Jeep Hijau di kiri dan [14] Sedan Merah di kanan. Kita perlu menggeser [12] Jeep Hijau ke kiri atau [14] Sedan Merah ke kanan terlebih dahulu agar [13] Truk Oren memiliki ruang untuk bergeser ke samping, baru [3] Taxi Kuning bisa meluncur ke bawah."
      }
    ],
    walls: [{"row":5,"col":1},{"row":5,"col":2},{"row":5,"col":3},{"row":5,"col":4},{"row":5,"col":5},{"row":5,"col":6},{"row":5,"col":7},{"row":5,"col":8},{"row":5,"col":9},{"row":5,"col":10}],
    focus: "Berpikir Komputasional - Algoritma dan Perencanaan: Merancang strategi terkoordinasi untuk membebaskan tiga Taxi Kuning secara bersamaan dalam labirin padat.",
    outcomes: [
      "Menguraikan masalah multi-Taxi menjadi sub-masalah yang lebih kecil.",
      "Memprioritaskan urutan pelepasan kendaraan penghambat yang saling terkunci.",
      "Merancang algoritma efisien dan mengevaluasi jumlah langkah minimal."
    ]
  },
  {
    id: 5,
    name: "Tingkat 5: Kemacetan Total 5 Taxi (Grand Master)",
    description: "Tantangan pamungkas Computational Thinking! Terdapat 5 Taxi Kuning (2 di area atas dan 3 di area bawah) yang terperangkap di dalam labirin parkir ganda. Rencanakan langkah dekomposisi paling presisi untuk membebaskan kelima Taxi!",
    difficulty: "Ahli",
    optimalSteps: 23,
    gridRows: 11,
    gridCols: 12,
    exitRow: 2,
    vehicles: [
      {
        id: "R",
        direction: "vertical",
        row: 3,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 3
      },
      {
        id: "T",
        direction: "vertical",
        row: 3,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 7
      },
      {
        id: "S",
        direction: "vertical",
        row: 6,
        col: 3,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 3
      },
      {
        id: "U",
        direction: "vertical",
        row: 6,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 5
      },
      {
        id: "V",
        direction: "vertical",
        row: 6,
        col: 7,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Taxi Kuning (Pemain)",
        isPlayer: true,
        exitCol: 7
      },
      {
        id: "A",
        direction: "vertical",
        row: 3,
        col: 4,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Merah"
      },
      {
        id: "B",
        direction: "vertical",
        row: 3,
        col: 6,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Biru"
      },
      {
        id: "D",
        direction: "horizontal",
        row: 2,
        col: 2,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Abu-abu"
      },
      {
        id: "C",
        direction: "horizontal",
        row: 2,
        col: 5,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cyan"
      },
      {
        id: "E",
        direction: "vertical",
        row: 3,
        col: 1,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Mobil Cokelat"
      },
      {
        id: "H",
        direction: "horizontal",
        row: 2,
        col: 7,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Biru"
      },
      {
        id: "J",
        direction: "horizontal",
        row: 8,
        col: 1,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Oren"
      },
      {
        id: "P",
        direction: "horizontal",
        row: 8,
        col: 5,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Hijau"
      },
      {
        id: "K",
        direction: "vertical",
        row: 6,
        col: 2,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Jeep Putih"
      },
      {
        id: "L",
        direction: "vertical",
        row: 6,
        col: 8,
        length: 2,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Sedan Hijau"
      },
      {
        id: "N",
        direction: "horizontal",
        row: 8,
        col: 8,
        length: 3,
        color: "bg-rose-500 shadow-rose-300 border-rose-600",
        label: "Truk Merah"
      }
    ],
    quizQuestions: [
      {
        id: "q5_1",
        question: "Kendaraan manakah yang secara langsung menghalangi jalan keluar [1] Taxi Kuning (kolom 3) dan [2] Taxi Kuning (kolom 7) ke atas di area atas?",
        options: [
          "[6] Truk Abu-abu dan [8] Truk Biru",
          "[10] Mobil Merah dan [11] Mobil Biru",
          "[9] Mobil Cokelat dan [7] Mobil Cyan",
          "Tidak ada kendaraan yang menghalangi"
        ],
        correctAnswerIndex: 0,
        explanation: "[6] Truk Abu-abu (kolom 2-4) dan [8] Truk Biru (kolom 7-9) melintang di baris 2, secara langsung menutup lintasan vertikal [1] Taxi Kuning (kolom 3) dan [2] Taxi Kuning (kolom 7) menuju gerbang EXIT atas."
      },
      {
        id: "q5_2",
        question: "Bagaimana urutan strategi yang tepat untuk membebaskan 3 Taxi di area bawah ([3] Taxi Kuning, [4] Taxi Kuning, dan [5] Taxi Kuning)?",
        options: [
          "Langsung menjalankan ketiga Taxi ke bawah tanpa memindahkan kendaraan lain",
          "Geser [12] Jeep Putih ke kiri (atau [16] Truk Merah ke kanan) → Geser [14] Truk Oren dan [15] Truk Hijau ke samping → Bebaskan [3] Taxi Kuning, [4] Taxi Kuning, dan [5] Taxi Kuning ke bawah",
          "Menggeser [1] Taxi Kuning dan [2] Taxi Kuning di area atas ke bawah untuk membantu",
          "Menggeser [15] Truk Hijau ke atas melewati dinding pembatas"
        ],
        correctAnswerIndex: 1,
        explanation: "[14] Truk Oren dan [15] Truk Hijau di baris 8 menghalangi jalur keluar ketiga Taxi di bawah. Dengan menggeser [12] Jeep Putih atau [16] Truk Merah terlebih dahulu, ruang gerak horizontal [14] Truk Oren dan [15] Truk Hijau terbuka sehingga jalur keluar [3] Taxi Kuning, [4] Taxi Kuning, dan [5] Taxi Kuning menjadi bersih."
      }
    ],
    walls: [{"row":5,"col":1},{"row":5,"col":2},{"row":5,"col":3},{"row":5,"col":4},{"row":5,"col":5},{"row":5,"col":6},{"row":5,"col":7},{"row":5,"col":8},{"row":5,"col":9},{"row":5,"col":10}],
    focus: "Berpikir Komputasional - Integrasi dan Evaluasi: Menerapkan seluruh konsep computational thinking untuk memecahkan kemacetan paling kompleks secara presisi.",
    outcomes: [
      "Mengintegrasikan dekomposisi, pengenalan pola, abstraksi, dan algoritma.",
      "Merencanakan strategi panjang yang akurat untuk membebaskan lima Taxi Kuning.",
      "Mengevaluasi solusi dan menyajikan alasan setiap langkah secara logis."
    ]
  }
];
