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

<img width="958" height="360" alt="daftarartikel" src="https://github.com/user-attachments/assets/3feef2af-d499-4796-8d13-55b8a3c5799f" />
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

# Praktikum 13 — VueJS Autentikasi dan Navigation Guards (SPA Security)

## Tujuan

1. Mahasiswa mampu memahami konsep keamanan dan pembatasan hak akses rute pada sisi klien (Client-Side Security).
2. Mahasiswa mampu memahami konsep Navigation Guards (`beforeEach`) pada Vue Router.
3. Mahasiswa mampu membuat API Endpoint autentikasi pada backend CodeIgniter 4.
4. Mahasiswa mampu mengimplementasikan modul Login dan proteksi halaman admin pada aplikasi Single Page Application (SPA) Frontend API.

---

## Teori Singkat

### Apa itu Navigation Guards?

Pada aplikasi web tradisional berbasis server-side (seperti MVC standar CodeIgniter), proteksi halaman dilakukan menggunakan Filters atau Middleware sebelum halaman HTML dirender oleh server. Namun pada arsitektur **Single Page Application (SPA)**, seluruh struktur halaman web sudah dimuat di awal oleh browser klien.

Untuk mengamankan rute-rute tertentu (seperti halaman `/artikel`) agar tidak bisa dibuka oleh pengguna yang belum login, Vue Router menyediakan fitur **Navigation Guards** melalui fungsi `router.beforeEach()`. Fungsi ini bertindak sebagai pencegat perpindahan rute yang akan memeriksa status login pengguna (misalnya mengecek keberadaan token di `localStorage`) sebelum mengizinkan rute tersebut ditampilkan ke browser.

---

## Langkah-langkah Praktikum

### Struktur Direktori

Sesuaikan struktur folder project frontend `lab8_vuejs` dengan menambahkan file `Login.js`:

```
lab8_vuejs/
│   index.html
└───assets/
    ├───css/
    │       style.css
    └───js/
        │   app.js
        └───components/
                Home.js
                Artikel.js
                Login.js
```

---

## TAHAP 1 — Pembuatan API Endpoint Login (Backend CI4)

### Langkah 1.1 — Membuat Auth Controller

Buat file baru di `app/Controllers/Api/Auth.php`. Controller ini bertugas menerima data login dari frontend, memvalidasi ke database, dan mengembalikan token jika berhasil.

**`app/Controllers/Api/Auth.php`**

```php
<?php

namespace App\Controllers\Api;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function login()
    {
        // 1. Menerima data input dari request body
        $username = $this->request->getVar('username');
        $password = $this->request->getVar('password');

        $model = new UserModel();

        // 2. Cari user berdasarkan username atau email di database
        $user = $model->where('username', $username)
                      ->orWhere('useremail', $username)
                      ->first();

        if ($user) {
            // 3. Verifikasi password
            if ($password === $user['userpassword'] ||
                password_verify($password, $user['userpassword'])) {

                // Jika sukses, kirim data dan token ke klien
                return $this->respond([
                    'status'   => 200,
                    'error'    => null,
                    'messages' => 'Login Berhasil',
                    'data'     => [
                        'id'       => $user['id'],
                        'username' => $user['username'],
                        'token'    => base64_encode("TOKEN-SECRET-" . $user['username'])
                    ]
                ], 200);
            }
        }

        // 4. Jika gagal, kirim error 401
        return $this->failUnauthorized('Username atau Password yang Anda masukkan salah.');
    }
}
```

---

### Langkah 1.2 — Mendaftarkan Route API Login

Buka `app/Config/Routes.php`, lalu tambahkan route berikut:

```php
$routes->post('api/login', 'Api\Auth::login');
```

---

## TAHAP 2 — Pengembangan Integrasi Frontend (VueJS SPA)

### Langkah 2.1 — Membuat Komponen Login

Buat file baru `assets/js/components/Login.js`. Komponen ini menampilkan form login, merekam input pengguna, dan mengirimkannya ke API backend menggunakan Axios.

**`assets/js/components/Login.js`**

```javascript
const Login = {
    template: `
        <div class="login-container">
            <div class="login-box">
                <h2>Form Login Admin</h2>
                <form @submit.prevent="handleLogin">
                    <div class="form-group">
                        <label>Username / Email</label>
                        <input type="text" v-model="username"
                            placeholder="Masukkan username" required>
                    </div>
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" v-model="password"
                            placeholder="Masukkan password" required>
                    </div>
                    <button type="submit" class="btn-login">Masuk Aplikasi</button>
                </form>
                <p v-if="errorMessage" class="error-msg">{{ errorMessage }}</p>
            </div>
        </div>
    `,
    data() {
        return {
            username: '',
            password: '',
            errorMessage: ''
        }
    },
    methods: {
        handleLogin() {
            // Kirim data kredensial ke API Endpoint backend CI4
            axios.post(apiUrl + '/api/login', {
                username: this.username,
                password: this.password
            })
            .then(response => {
                if (response.data.status === 200) {
                    // Simpan status login dan token ke localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userToken', response.data.data.token);

                    // Alihkan ke halaman artikel
                    this.$router.push('/artikel');
                    window.location.reload();
                }
            })
            .catch(error => {
                // Tangkap pesan error dari backend jika login gagal
                if (error.response && error.response.data.messages) {
                    this.errorMessage = error.response.data.messages;
                } else {
                    this.errorMessage = 'Terjadi kesalahan jaringan atau server.';
                }
            });
        }
    }
};
```

Setelah login berhasil, komponen ini menyimpan dua hal ke `localStorage`: status login (`isLoggedIn`) dan token (`userToken`) yang akan digunakan oleh Axios Interceptors di praktikum berikutnya.

---

### Langkah 2.2 — Mengonfigurasi Proteksi Rute di app.js

Edit file `assets/js/app.js` untuk mendaftarkan komponen `Login`, menambahkan properti `meta: { requiresAuth: true }` pada rute yang perlu dilindungi, dan membuat fungsi `beforeEach` sebagai pencegat akses rute.

**`assets/js/app.js`**

```javascript
const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Tentukan lokasi API REST End Point sesuai project CI4
const apiUrl = 'http://localhost:8080';

// 1. Definisikan mapping rute URL ke Komponen beserta meta-auth
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    {
        path: '/artikel',
        component: Artikel,
        meta: { requiresAuth: true } // Hanya boleh diakses jika sudah login
    },
    {
        path: '/about',
        component: About,
        meta: { requiresAuth: true }
    }
];

// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Navigation Guards - Pencegat akses rute
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

    // Jika rute butuh autentikasi dan user belum login
    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        alert('Akses Ditolak! Anda harus login terlebih dahulu.');
        next('/login'); // Belokkan paksa ke halaman login
    } else {
        next(); // Izinkan akses
    }
});

// 4. Inisialisasi Aplikasi Vue dengan state login global
const app = createApp({
    data() {
        return {
            isLoggedIn: false
        }
    },
    mounted() {
        // Cek status login saat aplikasi pertama kali dimuat
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    },
    methods: {
        logout() {
            if (confirm('Apakah Anda yakin ingin keluar aplikasi?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userToken');
                this.isLoggedIn = false;
                this.$router.push('/');
            }
        }
    }
});

app.use(router);
app.mount('#app');
```

---

### Langkah 2.3 — Menyesuaikan index.html

Buka `index.html`, muat file `Login.js`, dan tambahkan direktif `v-if` / `v-else` pada navigasi agar tombol Login/Logout berubah secara dinamis sesuai status login pengguna.

**`index.html`**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Secured SPA Frontend VueJS</title>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <script src="https://unpkg.com/vue-router@4/dist/vue-router.global.js"></script>
    <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <div id="app">
        <header>
            <h1>Aplikasi Panel Single Page (SPA) - Secured</h1>
            <nav class="nav-menu">
                <router-link to="/">Beranda</router-link> |
                <router-link to="/artikel">Kelola Artikel</router-link> |
                <router-link to="/about">About</router-link> |

                <!-- Tampilkan Login jika belum login, Logout jika sudah login -->
                <router-link v-if="!isLoggedIn" to="/login">Login</router-link>
                <a v-else href="#" @click.prevent="logout">Logout</a>
            </nav>
        </header>
        <main style="margin-top: 20px;">
            <router-view></router-view>
        </main>
    </div>

    <script src="assets/js/components/Home.js"></script>
    <script src="assets/js/components/Artikel.js"></script>
    <script src="assets/js/components/Login.js"></script>
    <script src="assets/js/components/About.js"></script>
    <script src="assets/js/app.js"></script>
</body>
</html>
```

> 💡 **Catatan:** Direktif `v-if="!isLoggedIn"` akan menampilkan link "Login" saat pengguna belum terautentikasi, dan `v-else` akan menampilkan link "Logout" saat sudah login.

---

### Langkah 2.4 — Menambahkan CSS Form Login

Tambahkan kode CSS berikut di bagian paling bawah file `assets/css/style.css`:

**`assets/css/style.css`** (tambahan)

```css
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 40px 0;
}

.login-box {
    width: 350px;
    padding: 25px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #ffffff;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
    margin-top: 0;
    margin-bottom: 20px;
    text-align: center;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

.form-group input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.btn-login {
    width: 100%;
    padding: 10px;
    background-color: #3152d6;
    color: white;
    border: none;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
}

.btn-login:hover {
    background-color: #203ca3;
}

.error-msg {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
}
```

---

## Pertanyaan dan Tugas

### 1. Selesaikan seluruh pengerjaan kode di atas.

### 2. Pengujian Skenario Keamanan

**Skenario A — Kondisi Terkunci (Belum Login)**

Bersihkan `localStorage` browser (buka DevTools F12 → tab Application → Storage → Local Storage → klik Clear), lalu klik menu "Kelola Artikel".

Yang diharapkan terjadi:
- Muncul alert: *"Akses Ditolak! Anda harus login terlebih dahulu."*
- Halaman otomatis diarahkan ke form login (`/#/login`)
- Halaman artikel tidak bisa diakses sama sekali

Screenshot bagian ini untuk bukti laporan.

**Skenario B — Kondisi Login Terautentikasi**

Buka form login, masukkan username dan password yang valid sesuai data di database, lalu klik "Masuk Aplikasi".

Yang diharapkan terjadi:
- Axios mengirim request POST ke `/api/login`
- Server memvalidasi kredensial dan mengembalikan token
- Token dan status login tersimpan di `localStorage`
- Halaman berpindah ke tabel artikel
- Menu navigasi atas berubah: link "Login" berganti menjadi "Logout"


---

### 3. Proteksi Halaman About

Tambahkan `meta: { requiresAuth: true }` pada rute `/about` di `app.js` agar halaman profil mahasiswa juga terproteksi dari pengguna yang belum login. Hal ini sudah diterapkan pada konfigurasi `app.js` di langkah 2.2 di atas.

---

## Penjelasan Alur Kerja

### Alur `router.beforeEach`

```
User klik menu → beforeEach dipanggil → cek localStorage('isLoggedIn')
       │
       ├── Belum login + rute butuh auth → alert + redirect ke /login
       │
       └── Sudah login / rute bebas → lanjut ke halaman tujuan
```

Setiap kali pengguna berpindah halaman, fungsi `beforeEach` dipanggil terlebih dahulu. Fungsi ini mengecek apakah rute tujuan memiliki properti `meta.requiresAuth`. Jika iya dan pengguna belum login, akses langsung ditolak dan diarahkan ke halaman login.

### Alur Axios HTTP Post saat Login

```
User isi form → handleLogin() → axios.post('/api/login', {username, password})
       │
       ├── Sukses (200) → simpan isLoggedIn + userToken ke localStorage
       │                → redirect ke /artikel
       │
       └── Gagal (401) → tampilkan pesan error di bawah form
```

---

## Laporan Praktikum

1. Lanjutkan pada repository GitHub yang sama dengan nama `Lab11Web_VueJS`.
2. Ambil screenshot jalannya program di browser saat:
   - Penolakan akses rute (alert + redirect ke login)
   - Pengisian form login
   - Respons sukses login (masuk ke halaman artikel)
   - Setelah menekan tombol Logout
3. Tuliskan penjelasan analisis ringkas mengenai alur kerja `router.beforeEach` dan Axios HTTP Post di `README.md`.
4. Lakukan commit dan push seluruh perubahan ke repository GitHub.
5. Kirimkan URL repository pada platform e-learning ecampus.

---

*Laporan Praktikum 13 — VueJS Autentikasi dan Navigation Guards (SPA Security) | Pemrograman Web*

# Praktikum 14 — Keamanan API, Autentikasi Token, dan Axios Interceptors

## Tujuan

1. Mahasiswa mampu memahami konsep keamanan RESTful API menggunakan Token-Based Authentication.
2. Mahasiswa mampu mengimplementasikan Filters pada CodeIgniter 4 untuk mengamankan endpoint API dari akses ilegal.
3. Mahasiswa mampu memahami dan mengimplementasikan fungsi Axios Interceptors pada aplikasi Frontend VueJS.
4. Mahasiswa mampu melakukan pengujian transmisi data yang aman antara Frontend SPA dan Backend API secara end-to-end.

---

## Teori Singkat

Pada praktikum sebelumnya, keamanan yang diterapkan baru sebatas **Client-Side Security** menggunakan Vue Router Navigation Guards. Keamanan tersebut belum cukup, karena orang lain masih bisa menembak endpoint REST API secara langsung melalui tools seperti Postman tanpa harus melalui antarmuka web sama sekali.

Oleh karena itu, diperlukan **Server-Side Security** menggunakan token. Cara kerjanya:

1. Saat pengguna berhasil login, server memberikan sebuah string acak unik **(Token)**
2. Token tersebut wajib disimpan oleh aplikasi klien (di `localStorage`)
3. Setiap request ke endpoint yang diamankan harus menyertakan token di **HTTP Header**:
   ```
   Authorization: Bearer <token>
   ```
4. Server akan memeriksa token tersebut sebelum memproses request

Di sisi klien, untuk menghindari penulisan kode pelampiran token secara manual di setiap fungsi `axios.get` atau `axios.post`, digunakan **Axios Interceptors** — fitur yang mencegat setiap request keluar dan menyuntikkan token dari `localStorage` ke dalam HTTP Header secara otomatis.

---

## Langkah-langkah Praktikum

---

## TAHAP 1 — Mengamankan Endpoint API (Backend CI4)

### Langkah 1.1 — Membuat API Auth Filter

Buat file baru `app/Filters/ApiAuthFilter.php`. File ini bertugas sebagai "satpam" yang memeriksa setiap request masuk apakah membawa token valid atau tidak.

**`app/Filters/ApiAuthFilter.php`**

```php
<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\Http\RequestInterface;
use CodeIgniter\Http\ResponseInterface;
use Config\Services;

class ApiAuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        // 1. Ambil data Header Authorization dari request klien
        $authHeader = $request->getServer('HTTP_AUTHORIZATION');

        if (!$authHeader) {
            // Jika header tidak ditemukan, kirim respon error 401
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Akses Ditolak. Token tidak ditemukan pada request!'
            ]);
        }

        // 2. Ekstrak string token (memisahkan kata 'Bearer' dengan string token)
        $token = null;
        if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            $token = $matches[1];
        }

        // 3. Validasi Token
        // Catatan: pada production, bagian ini divalidasi menggunakan library JWT
        if (!$token || empty($token)) {
            $response = Services::response();
            $response->setStatusCode(401);
            return $response->setJSON([
                'status'   => 401,
                'error'    => 401,
                'messages' => 'Sesi Token tidak valid atau kedaluwarsa!'
            ]);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Tidak diperlukan aksi setelah request diproses
    }
}
```

---

### Langkah 1.2 — Mendaftarkan Filter

Buka file `app/Config/Filters.php`, lalu tambahkan alias `apiauth` di dalam array `$aliases`:

**`app/Config/Filters.php`**

```php
public array $aliases = [
    'csrf'          => CSRF::class,
    'toolbar'       => DebugToolbar::class,
    'honeypot'      => Honeypot::class,
    'auth'          => \App\Filters\Auth::class,
    'invalidchars'  => InvalidChars::class,
    'secureheaders' => SecureHeaders::class,
    'cors'          => Cors::class,
    'forcehttps'    => ForceHTTPS::class,
    'pagecache'     => PageCache::class,
    'performance'   => PerformanceMetrics::class,
    'apiauth'       => \App\Filters\ApiAuthFilter::class, // ← tambahkan baris ini
];
```

---

### Langkah 1.3 — Menerapkan Filter ke Route

Buka file `app/Config/Routes.php`, tambahkan 3 route berikut **sebelum** `$routes->resource('post')` agar filter `apiauth` diterapkan khusus untuk method POST, PUT, dan DELETE:

**`app/Config/Routes.php`**

```php
// Mengamankan method POST, PUT, dan DELETE untuk resource /post
$routes->post('post', 'Post::create', ['filter' => 'apiauth']);
$routes->put('post/(:segment)', 'Post::update/$1', ['filter' => 'apiauth']);
$routes->delete('post/(:segment)', 'Post::delete/$1', ['filter' => 'apiauth']);

$routes->resource('post');
```

> 💡 **Catatan:** Route GET `/post` (untuk melihat data) tetap bebas diakses tanpa token. Hanya operasi tambah, ubah, dan hapus yang wajib membawa token.

---

## TAHAP 2 — Implementasi Axios Interceptors (Frontend VueJS)

### Langkah 2.1 — Menambahkan Interceptor di app.js

Tambahkan blok Axios Interceptors pada file `assets/js/app.js`, tepat setelah deklarasi `apiUrl` dan sebelum konfigurasi `routes`. Blok ini akan otomatis menyuntikkan token ke setiap request yang keluar dari aplikasi VueJS.

**`assets/js/app.js` (full)**

```javascript
const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;

// Tentukan lokasi API REST End Point sesuai project CI4
const apiUrl = 'http://localhost:8080';

// =========================================================================
// IMPLEMENTASI AXIOS INTERCEPTORS (Penyuntik Token Otomatis)
// =========================================================================
axios.interceptors.request.use(
    (config) => {
        // Ambil token dari local storage browser
        const token = localStorage.getItem('userToken');

        // Jika token tersedia, masukkan ke dalam HTTP Header Authorization Bearer
        if (token) {
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Tangkap secara global jika server merespon dengan error 401 (Unauthorized)
axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            alert('Sesi Anda telah berakhir atau Token tidak sah. Silakan login kembali.');
            localStorage.clear();
            window.location.href = '#/login';
            window.location.reload();
        }
        return Promise.reject(error);
    }
);
// =========================================================================

// 1. Definisikan mapping rute URL ke Komponen beserta meta-auth
const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/artikel', component: Artikel, meta: { requiresAuth: true } },
    { path: '/about', component: About, meta: { requiresAuth: true } }
];

// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});

// 3. Navigation Guards - Pencegat akses rute
router.beforeEach((to, from, next) => {
    const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

    if (to.matched.some(record => record.meta.requiresAuth) && !isAuthenticated) {
        alert('Akses Ditolak! Anda harus login terlebih dahulu.');
        next('/login');
    } else {
        next();
    }
});

// 4. Inisialisasi Aplikasi Vue dengan state login global
const app = createApp({
    data() {
        return {
            isLoggedIn: false
        }
    },
    mounted() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    },
    methods: {
        logout() {
            if (confirm('Apakah Anda yakin ingin keluar aplikasi?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userToken');
                this.isLoggedIn = false;
                this.$router.push('/');
            }
        }
    }
});

app.use(router);
app.mount('#app');
```

---

## Pertanyaan dan Tugas

### 1. Terapkan seluruh langkah praktikum di atas

Semua langkah mulai dari pembuatan `ApiAuthFilter.php`, pendaftaran alias di `Filters.php`, penerapan filter ke route di `Routes.php`, hingga penambahan Axios Interceptors di `app.js` telah diterapkan sesuai urutan.

---

### 2. Simulasi Pengujian Pembobolan via Postman

Pengujian dilakukan dengan mengirim request **POST** ke endpoint `/post` tanpa menyertakan token pada header menggunakan aplikasi Postman.

**Konfigurasi request:**
- Method: `POST`
- URL: `http://localhost:8080/post`
- Body: `x-www-form-urlencoded` → `judul: Test Bobol`, `isi: Coba kirim tanpa token`
- Header `Authorization`: **tidak diisi**

**Hasil response:**

```json
{
    "status": 401,
    "error": 401,
    "messages": "Akses Ditolak. Token tidak ditemukan pada request!"
}
```

Server mengembalikan **HTTP 401 Unauthorized**, membuktikan bahwa filter `ApiAuthFilter` berhasil menolak request yang tidak membawa token.

![Screenshot Postman 401](screenshots/postman_401.png)

---

### 3. Pengujian CRUD melalui Browser dengan Axios Interceptors

Setelah login melalui antarmuka web VueJS, dilakukan pengujian tambah data artikel. Melalui tab **Network** di DevTools (F12), dapat dikonfirmasi bahwa token berhasil disisipkan secara otomatis oleh Axios Interceptors pada setiap request yang dikirim ke server.

**Bukti pada Request Headers:**

```
Request URL   : http://localhost:8080/post
Request Method: POST
Status Code   : 201 Created

Authorization : Bearer VE9LRU4tU0VDUkVULWFkbWlu
Content-Type  : application/json
```

Token berhasil terkirim secara otomatis tanpa ditulis manual di setiap fungsi axios, dan server merespons dengan **201 Created** — data berhasil disimpan.

![Screenshot Network DevTools](screenshots/network_token.png)

---

### 4. Kesimpulan — Perbedaan Navigation Guard vs CI4 Filter

Dari hasil praktikum ini, dapat disimpulkan perbedaan mendasar antara dua mekanisme keamanan yang diterapkan:

| Aspek | Vue Router Navigation Guard | CodeIgniter Filter (ApiAuthFilter) |
|-------|----------------------------|-------------------------------------|
| **Lokasi** | Sisi klien (browser) | Sisi server (backend) |
| **Cara kerja** | Mengecek `localStorage` sebelum pindah halaman | Mengecek header `Authorization` sebelum memproses request |
| **Yang dilindungi** | Akses ke halaman/tampilan | Akses ke data di database |
| **Kekuatan** | Lemah — bisa dilewati dengan edit `localStorage` atau langsung tembak API via Postman | Kuat — tidak bisa dilewati tanpa token valid, apapun tools yang digunakan |
| **Tujuan utama** | Pengalaman pengguna (UX) yang rapi | Keamanan data yang sesungguhnya |

**Kesimpulan:** Vue Router Navigation Guard hanya berfungsi sebagai "papan petunjuk" di sisi tampilan yang mengarahkan pengguna yang belum login ke halaman login. Namun perlindungan ini mudah dilewati karena hanya berjalan di browser. Sebaliknya, CodeIgniter Filter bertindak sebagai "kunci pintu" yang sesungguhnya di sisi server — setiap request yang masuk wajib membawa token valid, sehingga meskipun seseorang mencoba mengakses API langsung tanpa melalui aplikasi web, tetap akan ditolak dengan error 401. Kedua mekanisme ini saling melengkapi: Navigation Guard memberikan pengalaman pengguna yang baik, sedangkan CI4 Filter yang menjamin keamanan data secara nyata.

---

## Laporan Praktikum

1. Lanjutkan pada repository `Lab11Web_VueJS`.
2. Simpan screenshot bukti penolakan **401 Unauthorized** dari Postman.
3. Simpan screenshot tab **Network** DevTools yang menunjukkan header `Authorization: Bearer <token>` berhasil disisipkan otomatis.
4. Update file `README.md` dengan penjelasan setiap langkah beserta screenshotnya.
5. Lakukan commit dan push ke repository GitHub.
6. Kirimkan URL repository pada platform e-learning ecampus.

---

*Laporan Praktikum 14 — Keamanan API, Autentikasi Token, dan Axios Interceptors | Pemrograman Web*
