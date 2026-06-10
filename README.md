# Praktikum 11 — VueJS

## Tujuan

1. Mahasiswa mampu memahami konsep dasar API.
2. Mahasiswa mampu memahami konsep dasar Framework VueJS.
3. Mahasiswa mampu membuat Frontend API menggunakan Framework VueJS 3.

---

## Apa itu VueJS?

VueJS merupakan sebuah framework JavaScript yang digunakan untuk membangun tampilan antarmuka website agar lebih interaktif. Framework ini bisa digunakan untuk membuat halaman web, aplikasi mobile, maupun aplikasi desktop.

VueJS menawarkan beberapa fitur utama seperti reactive data binding dan component-based architecture. Library VueJS sendiri berfokus pada view layer sehingga mudah diimplementasikan dan diintegrasikan dengan library lain. Selain itu, VueJS juga dikenal mudah digunakan karena memiliki sintaksis yang sederhana dan intuitif.

Dokumentasi lengkap VueJS bisa dipelajari di: https://vuejs.org/guide/introduction

---

## Langkah-langkah Praktikum

### Persiapan

Untuk praktikum ini kita menggunakan cara manual dengan CDN, tanpa perlu install npm. Library yang dibutuhkan ada dua yaitu VueJS dan Axios.

Library VueJS:
```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
```

Library Axios:
```html
<script src="https://unpkg.com/axios/dist/axios.min.js"></script>
```

---

### Struktur Direktori

Buat project baru dengan struktur file dan folder seperti berikut:

```
│   index.html
└───assets
    ├───css
    │       style.css
    └───js
            app.js
```

---

### Menampilkan Data

Langkah pertama adalah membuat tampilan tabel untuk menampilkan daftar artikel yang diambil dari API.

**`index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Frontend Vuejs</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div id="app">
        <h1>Daftar Artikel</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Judul</th>
                    <th>Status</th>
                    <th>Aksi</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, index) in artikel">
                    <td class="center-text">{{ row.id }}</td>
                    <td>{{ row.judul }}</td>
                    <td>{{ statusText(row.status) }}</td>
                    <td class="center-text">
                        <a href="#" @click="edit(row)">Edit</a>
                        <a href="#" @click="hapus(index, row.id)">Hapus</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <script src="assets/js/app.js"></script>
</body>
</html>
```

**`assets/js/app.js`**

```javascript
const { createApp } = Vue

// Tentukan lokasi API REST End Point
const apiUrl = 'http://localhost/labci4/public'

createApp({
    data() {
        return {
            artikel: ''
        }
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            axios.get(apiUrl + '/post')
                .then(response => {
                    this.artikel = response.data.artikel
                })
                .catch(error => console.log(error))
        },
        statusText(status) {
            if (!status) return ''
            return status == 1 ? 'Publish' : 'Draft'
        }
    },
}).mount('#app')
```

Pada tahap ini VueJS akan memanggil endpoint `/post` menggunakan Axios saat halaman pertama kali dimuat (`mounted()`), lalu hasilnya ditampilkan di tabel menggunakan directive `v-for`.

---

### Form Tambah dan Ubah Data

Selanjutnya kita menambahkan tombol dan modal form untuk keperluan tambah dan ubah data artikel.

Sisipkan kode berikut pada `index.html` sebelum tag `<table>`:

```html
<button id="btn-tambah" @click="tambah">Tambah Data</button>

<div class="modal" v-if="showForm">
    <div class="modal-content">
        <span class="close" @click="showForm = false">&times;</span>
        <form id="form-data" @submit.prevent="saveData">
            <h3 id="form-title">{{ formTitle }}</h3>
            <div>
                <input type="text" name="judul" id="judul"
                    v-model="formData.judul" placeholder="Judul" required>
            </div>
            <div>
                <textarea name="isi" id="isi" rows="10"
                    v-model="formData.isi"></textarea>
            </div>
            <div>
                <select name="status" id="status" v-model="formData.status">
                    <option v-for="option in statusOptions" :value="option.value">
                        {{ option.text }}
                    </option>
                </select>
            </div>
            <input type="hidden" id="id" v-model="formData.id">
            <button type="submit" id="btnSimpan">Simpan</button>
            <button @click="showForm = false">Batal</button>
        </form>
    </div>
</div>
```

Kemudian lengkapi file `app.js` dengan seluruh method yang dibutuhkan:

**`assets/js/app.js` (lengkap)**

```javascript
const { createApp } = Vue

// Tentukan lokasi API REST End Point
const apiUrl = 'http://localhost/labci4/public'

createApp({
    data() {
        return {
            artikel: '',
            formData: {
                id: null,
                judul: '',
                isi: '',
                status: 0
            },
            showForm: false,
            formTitle: 'Tambah Data',
            statusOptions: [
                { text: 'Draft',   value: 0 },
                { text: 'Publish', value: 1 },
            ],
        }
    },
    mounted() {
        this.loadData()
    },
    methods: {
        loadData() {
            axios.get(apiUrl + '/post')
                .then(response => {
                    this.artikel = response.data.artikel
                })
                .catch(error => console.log(error))
        },
        tambah() {
            this.showForm  = true
            this.formTitle = 'Tambah Data'
            this.formData  = {
                id: null,
                judul: '',
                isi: '',
                status: 0
            }
        },
        hapus(index, id) {
            if (confirm('Yakin menghapus data?')) {
                axios.delete(apiUrl + '/post/' + id)
                    .then(response => {
                        this.artikel.splice(index, 1)
                    })
                    .catch(error => console.log(error))
            }
        },
        edit(data) {
            this.showForm  = true
            this.formTitle = 'Ubah Data'
            this.formData  = {
                id:     data.id,
                judul:  data.judul,
                isi:    data.isi,
                status: data.status
            }
        },
        saveData() {
            if (this.formData.id) {
                // Update data yang sudah ada
                axios.put(apiUrl + '/post/' + this.formData.id, this.formData)
                    .then(response => {
                        this.loadData()
                    })
                    .catch(error => console.log(error))
            } else {
                // Tambah data baru
                axios.post(apiUrl + '/post', this.formData)
                    .then(response => {
                        this.loadData()
                    })
                    .catch(error => console.log(error))
            }

            // Reset form setelah disimpan
            this.formData = {
                id: null,
                judul: '',
                isi: '',
                status: 0
            }
            this.showForm = false
        },
        statusText(status) {
            if (!status) return ''
            return status == 1 ? 'Publish' : 'Draft'
        }
    },
}).mount('#app')
```

Di sini method `saveData()` akan otomatis memilih antara `PUT` (update) atau `POST` (tambah baru) tergantung apakah `formData.id` terisi atau tidak. Setelah data disimpan, form akan direset dan ditutup secara otomatis.

---

### Styling (CSS)

**`assets/css/style.css`**

```css
#app {
    margin: 0 auto;
    width: 900px;
}

table {
    min-width: 700px;
    width: 100%;
}

th {
    padding: 10px;
    background: #5778ff !important;
    color: #ffffff;
}

tr td {
    border-bottom: 1px solid #eff1ff;
}

tr:nth-child(odd) {
    background-color: #eff1ff;
}

td {
    padding: 10px;
}

.center-text {
    text-align: center;
}

td a {
    margin: 5px;
}

#form-data {
    width: 600px;
}

form input {
    width: 100%;
    margin-bottom: 5px;
    padding: 5px;
    box-sizing: border-box;
}

form select {
    margin-bottom: 5px;
    padding: 5px;
    box-sizing: border-box;
}

form textarea {
    width: 100%;
    margin-bottom: 5px;
    padding: 5px;
    box-sizing: border-box;
}

form div {
    margin-bottom: 5px;
    position: relative;
}

form button {
    padding: 10px 20px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
    cursor: pointer;
}

#btn-tambah {
    margin-bottom: 15px;
    padding: 10px 20px;
    cursor: pointer;
    background-color: #3152d6;
    color: #ffffff;
    border: 1px solid #3152d6;
}

#btnSimpan {
    background-color: #3152d6;
    color: #ffffff;
    border: 1px solid #3152d6;
}

.modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.4);
}

.modal-content {
    background-color: #fefefe;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 600px;
}

.close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
    cursor: pointer;
}
```

---

## Pertanyaan dan Tugas

Selesaikan program sesuai langkah-langkah yang ada. Boleh melakukan improvisasi tambahan.

---

*Laporan Praktikum 11 — VueJS | Pemrograman Web*

# Praktikum 12 — VueJS Komponen dan Routing (Single Page Application)

## Tujuan

1. Mahasiswa mampu memahami konsep komponen pada Framework VueJS.
2. Mahasiswa mampu memahami konsep Client-Side Routing untuk membangun Single Page Application (SPA).
3. Mahasiswa mampu mengimplementasikan komponen dan routing menggunakan Vue Router berbasis CDN pada aplikasi Frontend API yang telah dibuat.

---

## Apa itu Vue Components dan Vue Router?

**Vue Components** adalah elemen UI modular yang dapat digunakan kembali (reusable). Dengan komponen, kita bisa memecah antarmuka aplikasi menjadi bagian-bagian yang lebih kecil dan terisolasi, seperti Header, Footer, Sidebar, atau halaman tertentu. Hasilnya kode jadi lebih bersih dan mudah dikelola.

**Vue Router** adalah library resmi untuk VueJS yang menangani perpindahan halaman di sisi klien (Client-Side Routing). Kalau di aplikasi web biasa setiap klik tautan akan me-refresh seluruh halaman, dengan Vue Router kita bisa berpindah tampilan tanpa reload browser sama sekali. Inilah yang disebut **Single Page Application (SPA)**.

---

## Langkah-langkah Praktikum

### Persiapan

Buka kembali folder `lab8_vuejs` dari praktikum sebelumnya, lalu tambahkan library Vue Router di dalam tag `<head>` pada `index.html`, tepat setelah library VueJS dan Axios:

```html
<script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
```

---

### Struktur Direktori Baru

Sesuaikan struktur folder project menjadi seperti berikut untuk menjaga modularitas kode:

```
Lab11_vuejs
│   index.html
└───assets
    ├───css
    │       style.css
    └───js
        │   app.js
        └───components
                Home.js
                Artikel.js
```

---

### 1. Membuat Komponen Halaman Utama

Buat file baru `assets/js/components/Home.js` untuk menampilkan halaman beranda:

**`assets/js/components/Home.js`**

```javascript
const Home = {
    template: `
        <div class="home-container">
            <h2>Selamat Datang di Portal Admin Artikel</h2>
            <p>Gunakan menu navigasi di atas untuk mengelola data artikel secara real-time
            memanfaatkan RESTful API CodeIgniter 4 dan VueJS.</p>
        </div>
    `
};
```

Komponen ini hanya berisi template statis yang ditampilkan ketika pengguna membuka halaman utama (`/`).

---

### 2. Memindahkan Fitur Artikel ke Komponen Terpisah

Pindahkan seluruh logika CRUD artikel dari `app.js` lama ke dalam file komponen baru `assets/js/components/Artikel.js`:

**`assets/js/components/Artikel.js`**

```javascript
const Artikel = {
    template: `
        <div>
            <h2>Manajemen Data Artikel</h2>
            <button id="btn-tambah" @click="tambah">Tambah Data</button>

            <div class="modal" v-if="showForm">
                <div class="modal-content">
                    <span class="close" @click="showForm = false">&times;</span>
                    <form id="form-data" @submit.prevent="saveData">
                        <h3>{{ formTitle }}</h3>
                        <div>
                            <input type="text" v-model="formData.judul"
                                placeholder="Judul Artikel" required>
                        </div>
                        <div>
                            <textarea v-model="formData.isi" rows="6"
                                placeholder="Isi Artikel" required></textarea>
                        </div>
                        <div>
                            <select v-model="formData.status">
                                <option v-for="option in statusOptions" :value="option.value">
                                    {{ option.text }}
                                </option>
                            </select>
                        </div>
                        <input type="hidden" v-model="formData.id">
                        <button type="submit" id="btnSimpan">Simpan</button>
                        <button type="button" @click="showForm = false">Batal</button>
                    </form>
                </div>
            </div>

            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Judul</th>
                        <th>Status</th>
                        <th>Aksi</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(row, index) in artikel" :key="row.id">
                        <td class="center-text">{{ row.id }}</td>
                        <td>{{ row.judul }}</td>
                        <td>{{ statusText(row.status) }}</td>
                        <td class="center-text">
                            <a href="#" @click.prevent="edit(row)">Edit</a>
                            <a href="#" @click.prevent="hapus(index, row.id)">Hapus</a>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `,
    data() {
        return {
            artikel: [],
            formData: { id: null, judul: '', isi: '', status: 0 },
            showForm: false,
            formTitle: 'Tambah Data',
            statusOptions: [
                { text: 'Draft',   value: 0 },
                { text: 'Publish', value: 1 }
            ]
        }
    },
    mounted() {
        this.loadData();
    },
    methods: {
        loadData() {
            axios.get(apiUrl + '/post')
                .then(response => {
                    this.artikel = response.data.artikel;
                })
                .catch(error => console.log(error));
        },
        tambah() {
            this.showForm  = true;
            this.formTitle = 'Tambah Data';
            this.formData  = { id: null, judul: '', isi: '', status: 0 };
        },
        edit(data) {
            this.showForm  = true;
            this.formTitle = 'Ubah Data';
            this.formData  = {
                id:     data.id,
                judul:  data.judul,
                isi:    data.isi,
                status: data.status
            };
        },
        hapus(index, id) {
            if (confirm('Yakin menghapus data?')) {
                axios.delete(apiUrl + '/post/' + id)
                    .then(response => {
                        this.artikel.splice(index, 1);
                    })
                    .catch(error => console.log(error));
            }
        },
        saveData() {
            if (this.formData.id) {
                axios.put(apiUrl + '/post/' + this.formData.id, this.formData)
                    .then(response => { this.loadData(); })
                    .catch(error => console.log(error));
            } else {
                axios.post(apiUrl + '/post', this.formData)
                    .then(response => { this.loadData(); })
                    .catch(error => console.log(error));
            }
            this.formData = { id: null, judul: '', isi: '', status: 0 };
            this.showForm = false;
        },
        statusText(status) {
            if (!status) return 'Draft';
            return status == 1 ? 'Publish' : 'Draft';
        }
    }
};
```

Dengan cara ini, seluruh logika CRUD artikel terisolasi di dalam komponen `Artikel` dan tidak bercampur dengan konfigurasi routing di `app.js`.

---

### 3. Mengonfigurasi Vue Router di app.js

Edit file `assets/js/app.js` untuk mendaftarkan rute dan melakukan mounting aplikasi:

**`assets/js/app.js`**

```javascript
const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Tentukan lokasi API REST End Point sesuai project CI4
const apiUrl = 'http://localhost/labci4/public';

// 1. Definisikan mapping rute URL ke Komponen
const routes = [
    { path: '/',        component: Home },
    { path: '/artikel', component: Artikel }
];

// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Inisialisasi aplikasi Vue dan gunakan router
const app = createApp({});
app.use(router);
app.mount('#app');
```

`createWebHashHistory()` digunakan agar routing berbasis hash (`/#/`) sehingga tidak memerlukan konfigurasi server tambahan.

---

### 4. Memodifikasi index.html

Sesuaikan isi `index.html` dengan menambahkan navigasi menggunakan `<router-link>` dan tempat penampil halaman dinamis menggunakan `<router-view>`:

**`index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPA Frontend VueJS & Vue Router</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>Aplikasi Panel Single Page (SPA)</h1>
            <nav class="nav-menu">
                <router-link to="/">Beranda</router-link> |
                <router-link to="/artikel">Kelola Artikel</router-link>
            </nav>
        </header>
        <main style="margin-top: 20px;">
            <!-- Komponen aktif akan dirender di sini -->
            <router-view></router-view>
        </main>
    </div>

    <!-- Load komponen sebelum app.js -->
    <script src="assets/js/components/Home.js"></script>
    <script src="assets/js/components/Artikel.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
```

`<router-view>` adalah tempat dimana komponen yang sesuai dengan rute aktif akan ditampilkan. Urutan pemuatan script penting: komponen harus di-load sebelum `app.js`.

---

### 5. Tambahan CSS pada style.css

Tambahkan rule berikut pada `assets/css/style.css` untuk styling navigasi dan halaman beranda:

```css
.nav-menu {
    padding: 10px;
    background: #eff1ff;
    border-radius: 5px;
    margin-bottom: 15px;
}

.nav-menu a {
    text-decoration: none;
    color: #3152d6;
    font-weight: bold;
    padding: 5px 10px;
}

/* Style otomatis saat route sedang aktif */
.router-link-exact-active {
    background-color: #3152d6;
    color: #ffffff !important;
    border-radius: 3px;
}

.home-container {
    padding: 20px;
    border: 1px solid #eff1ff;
    background: #fafafa;
}
```

Class `.router-link-exact-active` secara otomatis ditambahkan oleh Vue Router ke tautan yang sedang aktif, sehingga menu yang dipilih akan terlihat berbeda dari yang lain.

---

## Pertanyaan dan Tugas

### 1. Selesaikan semua langkah praktikum di atas.

### 2. Tambahkan rute `/about` beserta komponen `About.js`

Buat file baru `assets/js/components/About.js` yang berisi profil singkat (Nama, NIM, Kelas, dan Foto/Avatar), lalu daftarkan rutenya di `app.js` dan tambahkan tautannya di navigasi `index.html`.

**Contoh `About.js`:**
```javascript
const About = {
    template: `
        <div class="home-container">
            <h2>Tentang Saya</h2>
            <p><b>Nama  :</b> Nama Lengkap</p>
            <p><b>NIM   :</b> 123456789</p>
            <p><b>Kelas :</b> TI-XX</p>
        </div>
    `
};
```

Tambahkan rute di `app.js`:
```javascript
{ path: '/about', component: About }
```

Tambahkan tautan di navigasi `index.html`:
```html
<router-link to="/about">About</router-link>
```

### 3. Pengujian SPA

Lakukan pengujian perpindahan halaman antar menu (Beranda, Kelola Artikel, dan About) dan pastikan browser tidak melakukan hard-reload. Ciri SPA bekerja dengan benar adalah URL berubah tapi halaman tidak refresh secara keseluruhan.

---

## Laporan Praktikum

1. Lanjutkan pada repository dengan nama `Lab11Web_VueJS` atau buat baru jika diperlukan.
2. Kerjakan semua latihan dan tugas modifikasi sesuai urutannya.
3. Ambil screenshot setiap perubahan langkah dan hasil running di browser.
4. Update file `README.md` dengan penjelasan lengkap setiap langkah beserta screenshotnya.
5. Lakukan commit dan push ke repository GitHub masing-masing.
6. Kirimkan URL repository GitHub pada platform e-learning ecampus.

---

*Laporan Praktikum 12 — VueJS Komponen dan Routing (SPA) | Pemrograman Web*
