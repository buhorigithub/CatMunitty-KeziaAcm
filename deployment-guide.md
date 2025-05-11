# Panduan Deployment untuk Catmunitty

## Persiapan Sebelum Deployment

1. Export kode dari Replit (Download as ZIP)
2. Extract file ZIP ke komputer lokal Anda
3. Pastikan Anda memiliki Node.js versi terbaru terinstal (minimal versi 16)

## Opsi Deployment

### 1. Vercel Deployment (Direkomendasikan)

Vercel adalah platform terbaik untuk aplikasi React yang sudah dikonfigurasi dengan file `vercel.json`.

1. Buat akun di [Vercel](https://vercel.com)
2. Instal Vercel CLI:
   ```
   npm install -g vercel
   ```
3. Login ke Vercel:
   ```
   vercel login
   ```
4. Tambahkan dependensi yang diperlukan:
   ```
   npm install --save serverless-http
   ```
5. Deploy aplikasi:
   ```
   vercel
   ```
6. Ikuti petunjuk interaktif dan pilih opsi berikut:
   - Set up and deploy: Yes
   - Root directory: ./
   - Override settings: Yes
   - Build Command: npm run build
   - Output Directory: dist
   - Development Command: npm run dev

### 2. Netlify Deployment

Netlify juga cocok dengan aplikasi ini dengan menggunakan file `netlify.toml`.

1. Buat akun di [Netlify](https://www.netlify.com/)
2. Instal Netlify CLI:
   ```
   npm install -g netlify-cli
   ```
3. Login ke Netlify:
   ```
   netlify login
   ```
4. Tambahkan dependensi yang diperlukan:
   ```
   npm install --save serverless-http
   ```
5. Deploy aplikasi:
   ```
   netlify deploy
   ```
6. Ikuti petunjuk interaktif dan pilih opsi berikut:
   - Create & configure a new site
   - Team: Pilih team Anda
   - Site name: catmunitty (atau nama lain yang Anda inginkan)
   - Publish directory: dist

### 3. Hosting di VPS/Cloud

Jika Anda ingin men-deploy ke VPS (seperti DigitalOcean, AWS, atau Google Cloud):

1. Siapkan server dengan Node.js
2. Clone repository Anda ke server
3. Install dependencies:
   ```
   npm install
   ```
4. Build aplikasi:
   ```
   npm run build
   ```
5. Jalankan aplikasi:
   ```
   npm start
   ```
6. Atau gunakan PM2 untuk menjalankan aplikasi sebagai service:
   ```
   npm install -g pm2
   pm2 start dist/index.js --name catmunitty
   ```

## Memecahkan Masalah Build Error

Jika mengalami error saat build:

1. Hapus file-file cache (jika ada):
   ```
   rm -rf node_modules/.cache
   rm -rf ./dist
   ```

2. Pastikan membersihkan dependensi dan install ulang:
   ```
   rm -rf node_modules
   npm install
   ```

3. Jika ada dependensi yang missing pada server, tambahkan ke package.json:
   ```
   npm install --save serverless-http
   ```

4. Jika error terkait TypeScript, pastikan untuk menginstall @types yang diperlukan:
   ```
   npm install --save-dev @types/serverless-http
   ```

5. Tambahkan script khusus ke package.json lokal Anda (setelah export dari Replit):
   ```json
   "vercel-build": "npm run build",
   "netlify-build": "npm run build"
   ```

## Penting: Environment Variables

Untuk aplikasi production, pastikan untuk mengatur environment variables yang diperlukan di dashboard Vercel/Netlify atau di file .env Anda (untuk hosting VPS).

Minimal environment variables yang dibutuhkan:
- NODE_ENV=production
- PORT=5000 (atau port lainnya sesuai kebutuhan)