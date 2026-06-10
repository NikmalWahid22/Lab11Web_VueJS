const { createApp } = Vue;
const { createRouter, createWebHashHistory } = VueRouter;
// Tentukan lokasi API REST End Point sesuai project CI4 Anda
const apiUrl = 'http://localhost:8080';
// 1. Definisikan mapping rute URL ke Komponen
const routes = [
    { path: '/', component: Home },
    { path: '/artikel', component: Artikel },
    { path: '/about', component: About }
];
// 2. Buat instance router
const router = createRouter({
    history: createWebHashHistory(),
    routes
});
// 3. Inisialisasi Aplikasi Vue dan gunakan Router
const app = createApp({});
app.use(router);
app.mount('#app');