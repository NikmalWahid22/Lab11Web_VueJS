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

---

*Laporan Praktikum 11 — VueJS | Pemrograman Web*
