# DESIGN.md — Marugo Porto Design System & Art Direction

> **Dokumen Panduan Desain Resmi & Spesifikasi Visual Marugo Porto**  
> Identitas visual unik berbasis **Pop-Brutalism x Kawaii Scrapbook Zine** — menggabungkan estetika buku sketsa ilustrator independen, mainan retro Y2K, tipografi ekspresif bernada ceria, serta interaksi fisik (drag-and-drop, rubberband physics, dan easter eggs tersembunyi).

---

## 1. Filosofi Desain & Persona Visual

Marugo Porto bukan sekadar portfolio korporat atau website minimalis modern biasa. Desain ini dirancang sebagai **taman bermain ilustrator (artist's playground)** yang menyampaikan kehangatan, kreativitas personal, dan selera humor yang ramah.

### Prinsip Utama (Core Tenets)
1. **Tactile Scrapbook (Fisik & Berwujud)**:
   Setiap elemen antarmuka dirancang menyerupai stiker vinyl timbul, pin bulat, badge kain, dan potongan kertas memo yang ditempel di atas buku sketsa pastel.
2. **Playful Pop-Brutalism (Brutalisme Berwarna)**:
   Mengadopsi kontur garis tepi hitam tegas (`border-black-200`), bayangan offset keras tanpa blur (*hard-offset drop shadows*), dan bentuk pil (*capsule*), namun diimbangi dengan warna-warna pastel ceria (*dopamine palette*).
3. **Living & Bouncy Motion**:
   UI tidak statis; elemen mengapung perlahan (*idle floating loop*), bereaksi ketika ditekan (*squash and stretch*), dan dapat digeser secara fisik menggunakan fisika pegas (*spring drag physics*).
4. **Delight & Gamification (Easter Eggs)**:
   Interaksi tersembunyi menjadi ciri khas utama — alur penting seperti login admin tidak ditaruh di tombol navbar biasa, melainkan dibuka dengan interaksi rahasia (seperti menyeret kue ke mulut kucing).

---

## 2. Sistem Warna (Dopamine Pastel Palette)

Palet warna dikonfigurasi langsung di dalam Tailwind CSS v4 `@theme` (`src/index.css`) dengan kombinasi kontras tinggi antara latar pastel dan garis aksen pop.

### Palet Dasar (Canvas & Backgrounds)
| Token Tailwind | Kode Hex | Peran & Penggunaan |
|---|---|---|
| `--color-pink` | `#ff9bc2` | **Primary Canvas**: Latar belakang utama halaman (`Home`, `AboutMe`, `Portfolio`, `404`). Memberi impresi hangat dan ramah. |
| `--color-white-300` | `#fff5e4` | **Parchment / Creamy**: Latar kartu sekunder, modal pop-up, dan kontras lembut seperti kertas sketsa. |
| `--color-white` | `#ffffff` | Warna teks heading utama, kartu dialog, dan outline stiker. |

### Palet Aksen Pop & Stiker
| Token Tailwind | Kode Hex | Peran & Penggunaan |
|---|---|---|
| `--color-blue` | `#64a0ad` | **Vintage Teal**: Header Nav bar, footer utama, kartu portofolio, dan border tebal pembatas bagian. |
| `--color-yellow-200` | `#fedc70` | **Sunshine Yellow**: Kartu kategori tengah, border garis aksen, dan spinner loading putar. |
| `--color-yellow-100` | `#fbfbd5` | **Soft Butter**: Border bingkai foto profil hero, latar hover tombol toggle. |
| `--color-orange` | `#ffa500` | **Tangerine**: Tombol kapsul aksi utama pada kartu Home (Portfolio CTA). |
| `--color-purple` | `#b603fc` | **Electric Violet**: Tombol kapsul aksi koleksi. |
| `--color-purple-100` | `#cb9df0` | **Lavender Lilac**: Aksen kartu sekunder dan dekorasi pop. |
| `--color-teal` | `#7ed7c1` | **Mint Tahiti**: Tombol kapsul aksi About Me. |
| `--color-lime-green` | `#a1fc03` | **Acid Lime**: Aksen hover interaktif pada footer dan tombol. |
| `--color-green` | `#16c47f` | **Emerald Green**: Status aktif toggle switch dan pesan sukses. |
| `--color-red` | `#f93827` | **Strawberry Red**: Pesan validasi error dan tombol tutup modal (X). |

### Palet Kontras & Hard Shadows
| Token Tailwind | Kode Hex | Peran & Penggunaan |
|---|---|---|
| `--color-black-100` | `#1c1c1c` | **Hard Shadow**: Bayangan mati di balik tombol kapsul (`top-2 left-3`). |
| `--color-black-200` | `#0d0d0d` | **Crisp Stroke**: Garis batas tipis pada tombol kapsul (`border border-black-200`). |

---

## 3. Sistem Tipografi (Expressive Typography Hierarchy)

Typography di Marugo Porto mengandalkan 6 jenis font ekspresif yang masing-masing memiliki peran karakter spesifik:

```
[ Londrina Shadow ]  --> Display Headline & Hero Judul Besar
[ Schoolbell ]       --> Subheading, Suara Pribadi Penulis, Catatan Kaki, Copyright
[ Delius ]           --> Teks Cerita Panjang, Bio, Riwayat Pengalaman Kerja
[ Sour Gummy ]       --> Label Bubbly, Nama Kategori & Stiker
[ Pacifico ]         --> Identitas Brand Navbar Cursive
[ Magnifico ]        --> Local Font (@font-face) untuk sentuhan retro editorial
```

### Panduan Penerapan Tipografi
1. **Display Hero (Besar & Menarik Perhatian)**:
   - Font: `font-londrina`
   - Ukuran: `text-6xl` hingga `text-7xl`, `font-bold`
   - Karakter: Spasi renggang antar-huruf manual (`H e l l o`), warna putih kontras di atas kanvas pink.
2. **Suara Penulis / Handwritten Subtitle**:
   - Font: `font-school`
   - Ukuran: `text-xl` hingga `text-2xl`
   - Karakter: Gaya tulisan tangan santai untuk dialog langsung dengan pengunjung (*"Welcome to my website, hope you like it :D"*).
3. **Deskripsi Naratif / Storybook Body**:
   - Font: `font-desc` (`Delius`)
   - Karakter: Sangat mudah dibaca dengan nuansa komik santai. Digunakan di dalam kartu bio bersudut tumpul dengan border putih tebal 4px (`border-4 border-white rounded-xl`).
4. **Outline Text (.text-outline)**:
   - Menggunakan `-webkit-text-stroke: 2px white; color: white;` untuk efek teks berbingkai tebal.

---

## 4. Anatomi Komponen & Konstruksi Visual

### A. Tombol Kapsul Pop-Brutalist (`CapsuleButton`)
Bukan tombol web standar, melainkan tombol 3D pipih berlapis:
- **Lapisan Bayangan Mati**: Elemen `absolute -z-60 top-2 left-3 w-full h-full rounded-full opacity-85 bg-black-100`.
- **Lapisan Utama**: `relative px-6 py-1 border border-black-200 rounded-full hover:bg-gray-100`.
- Memberikan sensasi tombol retro fisik yang dapat ditekan ke bawah.

### B. Kartu Stiker Berlapis (`Card` & `HomeCard`)
- Bentuk: Bulat sempurna atau lonjong kapsul (`rounded-full`).
- Konstruksi: Double-layer stack. Lapisan belakang digeser `left-3` dengan opacity 60% warna senada untuk ilusi ketebalan stiker vinyl timbul.
- Interaksi: Floating idle bounce (`animate={{ y: [0, -10, 0] }}`) dan zoom saat hover (`group-hover:scale-110`).

### C. Panah Penghubung Sketsa (`ArrowIcon`)
- Menghubungkan kartu satu ke kartu berikutnya secara horizontal di desktop (`hidden md:block w-48`).
- Mengarahkan alur jelajah pengunjung secara natural (*Portfolio ➔ Collection ➔ About Me*).

### D. Karakter Mengintip (*Corner Peeking Characters*)
- Ilustrasi kucing (`corner_cat.png`, `cat_woman.png`) ditempatkan secara asimetris di sudut-sudut kartu (`absolute -right-5 -bottom-10 h-24`).
- Menghilangkan kesan kaku grid layout dan menambahkan sentuhan personal ilustrator.

### E. Spinner Dashed Lembut (`LoadingSpinner`)
- Menghindari spinner SVG bundar standar.
- Menggunakan lingkaran bergaris putus-putus berwarna kuning cerah:
  `border-4 border-yellow-200 border-dashed rounded-full animate-spin`.

---

## 5. Pola Gerak, Fisika & Interaksi Mikro (Motion DNA)

Gerakan diatur menggunakan **Framer Motion** dengan parameter fisika responsif:

1. **Idle Floating Loop (Efek Melayang)**:
   - Gerakan osilasi lembut sumbu Y: `[0, -10, 0]` berulang secara kontinu (*infinite loop*), durasi 3 detik, `ease: "easeInOut"`.
   - Menggunakan `delayTime` bertingkat antar kartu (0.2s, 0.4s, 0.6s) agar gerakan tidak sinkron kaku melainkan bergelombang alami.
2. **Rubberband Drag-and-Snap**:
   - Stiker dan ikon interaktif menggunakan properti `drag` dengan `dragSnapToOrigin={true}`.
   - Efek rotasi saat ditarik: `whileDrag={{ scale: 0.9, rotate: 5 }}`.
   - Saat dilepaskan, elemen membal kembali ke posisi awal secara elastis.
3. **Squash and Stretch Feedback**:
   - Pada halaman 404 dan tombol penting, penekanan memicu efek kompresi: `whileTap={{ scaleY: 0.8, scaleX: 0.95 }}`.
4. **Click Fatigue & Stage Progression (Halaman Khusus / Gamifikasi)**:
   - Seperti pada halaman `Happy21`, klik cepat berturut-turut memicu getaran acak (*random angular wiggle*) dan pengecilan skala bertahap sebelum membuka hadiah akhir (*celebration burst*).

---

## 6. Layout, Grid & Komposisi Halaman

### Tata Letak Halaman
- **Latar Layar Penuh**: `min-h-screen flex flex-col bg-pink relative`.
- **Header Navigasi**:
  - Tombol menu hamburger melingkar di kiri (`hover:bg-white/10 rounded-full`).
  - Dropdown melayang di atas kanvas dengan bayangan lembut dan teks berwarna biru laut.
  - Teks halaman tengah dibungkus gaya letter-spacing renggang (`- H O M E -`, `ABOUT - ME`).
- **Footer Scrapbook**:
  - Area biru laut (`bg-blue`) dengan tautan sosial Instagram dan TikTok berbingkai badge.
  - Sudut kanan bawah memuat elemen rahasia (ikon kue tersembunyi).

### Responsivitas Mobile-First
- **Breakpoints Khusus**:
  - `ssm: 375px` (ponsel ringkas)
  - `sm: 640px` (ponsel standar)
  - `md: 768px` (tablet & desktop awal)
  - `lg: 1024px` (desktop lebar)
- **Transformasi Tata Letak**:
  - Pada layar kecil, kartu bertumpuk vertikal menyerupai susunan stiker buku harian. Panah pemisah disembunyikan.
  - Pada layar desktop, kartu berjejer horizontal dengan panah sketsa yang memandu mata pembaca.

---

## 7. Arsitektur Easter Egg & Keamanan Visual

Salah satu ciri paling unik dari Marugo Porto adalah **ketiadaan tombol login yang terlihat secara eksplisit di navigasi umum**:

1. **The Secret Cookie Mechanism**:
   - Ikon kue kecil (`KeyPic` dari `src/assets/cookie.png`) ditaruh di pojok kanan bawah footer.
   - Pengunjung biasa hanya melihatnya sebagai dekorasi lucu.
   - Ketika diklik atau diseret (*dragged*) tepat ke atas ikon kucing di footer, modal tersembunyi terbuka:
     `"You Found The Secret! 😭"`.
2. **Modal Login Pop-up**:
   - Dialog mengambang di atas overlay gelap transparan (`bg-black/50 backdrop-blur-sm`).
   - Berisi formulir autentikasi ringkas (Username & Password) dengan toggle bergaya pil kapsul (`ToggleSwitch`).

---

## 8. Panduan Menambahkan Halaman / Komponen Baru (Invariants)

Setiap pengembang atau desainer yang menambahkan fitur baru ke Marugo Porto **WAJIB** mematuhi aturan berikut:

1. **JANGAN gunakan tombol kotak tajam atau bayangan blur lembut standar Tailwind** (`shadow-md`, `rounded-none`). Gunakan selalu `CapsuleButton` atau `rounded-full` dengan hard shadow.
2. **JANGAN gunakan latar belakang putih polos atau abu-abu korporat**. Gunakan selalu palet kanvas (`bg-pink`, `bg-white-300`, atau `bg-blue`).
3. **Pertahankan karakter tipografi**:
   - Judul besar: `font-londrina`
   - Subjudul personal: `font-school`
   - Teks bacaan/paragraf: `font-desc`
4. **Sertakan interaksi gerak halus**: Tambahkan efek hover (`scale-105` atau `scale-110`) dan transisi halus pada setiap elemen yang dapat diklik.
5. **Gunakan format aset web ringan (WebP / SVG)** untuk menjaga kecepatan muat halaman dan kelancaran animasi 60fps.
