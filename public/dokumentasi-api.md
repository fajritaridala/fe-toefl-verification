```json
[
  {
    "group": "Authentication",
    "endpoints": [
      {
        "path": "/api/auth/register",
        "method": "POST",
        "description": "Mendaftarkan pengguna baru dengan alamat wallet, nama pengguna, dan email.",
        "authentication": false,
        "roles": [],
        "request": {
          "body": {
            "type": "object",
            "properties": {
              "address": { "type": "string", "description": "Alamat wallet pengguna.", "required": true },
              "username": { "type": "string", "description": "Nama pengguna.", "required": true },
              "email": { "type": "string", "format": "email", "description": "Email pengguna.", "required": true },
              "roleToken": { "type": "string", "description": "Token opsional untuk mendaftar sebagai admin.", "required": false }
            }
          }
        },
        "responses": {
          "200": { "description": "Registrasi berhasil." },
          "400": { "description": "Data tidak valid atau alamat/email sudah terdaftar." }
        }
      },
      {
        "path": "/api/auth/login",
        "method": "POST",
        "description": "Login pengguna menggunakan alamat wallet. Mengembalikan JWT jika berhasil, atau status `needsRegistration` jika alamat tidak ditemukan.",
        "authentication": false,
        "roles": [],
        "request": {
          "body": {
            "type": "object",
            "properties": {
              "address": { "type": "string", "description": "Alamat wallet pengguna.", "required": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Login berhasil, mengembalikan JWT atau status registrasi." },
          "400": { "description": "Gagal login." }
        }
      },
      {
        "path": "/api/auth/me",
        "method": "GET",
        "description": "Mendapatkan profil pengguna yang sedang login berdasarkan token JWT.",
        "authentication": true,
        "roles": ["admin", "peserta"],
        "request": {},
        "responses": {
          "200": { "description": "Data pengguna berhasil diperoleh." },
          "401": { "description": "Tidak terautentikasi." },
          "404": { "description": "Pengguna tidak ditemukan." }
        }
      }
    ]
  },
  {
    "group": "Services",
    "endpoints": [
      {
        "path": "/api/services",
        "method": "GET",
        "description": "Mendapatkan daftar semua layanan TOEFL yang tersedia. Mendukung paginasi dan pencarian.",
        "authentication": false,
        "roles": [],
        "request": {
          "query": [
            { "name": "page", "type": "number", "description": "Nomor halaman." },
            { "name": "limit", "type": "number", "description": "Jumlah item per halaman." },
            { "name": "search", "type": "string", "description": "Pencarian berdasarkan nama layanan." }
          ]
        },
        "responses": {
          "200": { "description": "Daftar layanan berhasil ditemukan." }
        }
      },
      {
        "path": "/api/services",
        "method": "POST",
        "description": "Membuat layanan TOEFL baru. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "body": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "required": true },
              "description": { "type": "string", "required": true },
              "price": { "type": "number", "required": true },
              "duration": { "type": "number", "required": true },
              "notes": { "type": "string", "required": false }
            }
          }
        },
        "responses": {
          "200": { "description": "Layanan berhasil dibuat." },
          "401": { "description": "Tidak terautentikasi." },
          "403": { "description": "Akses ditolak." }
        }
      },
      {
        "path": "/api/services/:id",
        "method": "PATCH",
        "description": "Memperbarui layanan TOEFL yang sudah ada berdasarkan ID. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "params": [
            { "name": "id", "type": "string", "description": "ID Layanan" }
          ],
          "body": {
            "type": "object",
            "properties": {
              "name": { "type": "string", "required": false },
              "description": { "type": "string", "required": false },
              "price": { "type": "number", "required": false },
              "duration": { "type": "number", "required": false },
              "notes": { "type": "string", "required": false }
            }
          }
        },
        "responses": {
          "200": { "description": "Layanan berhasil diupdate." },
          "401": { "description": "Tidak terautentikasi." },
          "403": { "description": "Akses ditolak." }
        }
      },
      {
        "path": "/api/services/:id",
        "method": "DELETE",
        "description": "Menghapus layanan TOEFL berdasarkan ID. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "params": [
            { "name": "id", "type": "string", "description": "ID Layanan" }
          ]
        },
        "responses": {
          "200": { "description": "Layanan berhasil dihapus." },
          "401": { "description": "Tidak terautentikasi." },
          "403": { "description": "Akses ditolak." }
        }
      }
    ]
  },
  {
    "group": "Schedules",
    "endpoints": [
      {
        "path": "/api/schedules",
        "method": "GET",
        "description": "Mendapatkan daftar jadwal. Jika pengguna adalah admin, akan mengembalikan data paginasi. Jika tidak, mengembalikan data yang diformat untuk kalender pendaftaran.",
        "authentication": "optional",
        "roles": ["admin", "peserta"],
        "request": {
          "query": [
            { "name": "page", "type": "number", "description": "Nomor halaman (untuk admin)." },
            { "name": "limit", "type": "number", "description": "Jumlah item per halaman (untuk admin)." },
            { "name": "search", "type": "string", "description": "Pencarian berdasarkan tanggal atau nama layanan (untuk admin)." },
            { "name": "service_id", "type": "string", "description": "Filter berdasarkan ID layanan." }
          ]
        },
        "responses": {
          "200": { "description": "Jadwal berhasil ditemukan." }
        }
      },
      {
        "path": "/api/schedules",
        "method": "POST",
        "description": "Membuat jadwal baru. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "body": {
            "type": "object",
            "properties": {
              "service_id": { "type": "string", "description": "ID Layanan.", "required": true },
              "schedule_date": { "type": "string", "format": "YYYY-MM-DD", "description": "Tanggal jadwal.", "required": true },
              "quota": { "type": "number", "description": "Kuota peserta.", "required": false }
            }
          }
        },
        "responses": {
          "200": { "description": "Jadwal berhasil dibuat." },
          "409": { "description": "Jadwal dengan layanan dan tanggal yang sama sudah ada." }
        }
      },
      {
        "path": "/api/schedules/:scheduleId/participants",
        "method": "GET",
        "description": "Mendapatkan daftar peserta dari sebuah jadwal. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "params": [
            { "name": "scheduleId", "type": "string", "description": "ID Jadwal." }
          ],
          "query": [
            { "name": "page", "type": "number" },
            { "name": "limit", "type": "number" },
            { "name": "status", "type": "string", "enum": ["pending", "approved", "rejected"] },
            { "name": "search", "type": "string" },
            { "name": "sort", "type": "string", "enum": ["newest", "oldest"] }
          ]
        },
        "responses": {
          "200": { "description": "Peserta berhasil ditemukan." }
        }
      },
      {
        "path": "/api/schedules/:scheduleId/participants",
        "method": "PATCH",
        "description": "Mendaftarkan peserta yang sedang login ke sebuah jadwal. Hanya untuk peserta.",
        "authentication": true,
        "roles": ["peserta"],
        "request": {
          "contentType": "multipart/form-data",
          "params": [
            { "name": "scheduleId", "type": "string", "description": "ID Jadwal." }
          ],
          "body": {
            "type": "object",
            "properties": {
              "fullName": { "type": "string", "required": true },
              "gender": { "type": "string", "required": true },
              "birth_date": { "type": "string", "format": "YYYY-MM-DD", "required": true },
              "phone_number": { "type": "string", "required": true },
              "NIM": { "type": "string", "required": true },
              "faculty": { "type": "string", "required": true },
              "major": { "type": "string", "required": true },
              "payment_date": { "type": "string", "format": "YYYY-MM-DD", "required": true },
              "file": { "type": "file", "description": "File bukti pembayaran.", "required": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Registrasi Berhasil." },
          "400": { "description": "Jadwal penuh atau pendaftaran sudah ditutup." }
        }
      },
      {
        "path": "/api/schedules/:scheduleId/participants/:participantId/scores",
        "method": "PATCH",
        "description": "Memasukkan atau memperbarui nilai seorang peserta. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "params": [
            { "name": "scheduleId", "type": "string", "description": "ID Jadwal." },
            { "name": "participantId", "type": "string", "description": "ID Peserta." }
          ],
          "body": {
            "type": "object",
            "properties": {
              "listening": { "type": "number", "required": true },
              "reading": { "type": "number", "required": true },
              "writing": { "type": "number", "required": true }
            }
          }
        },
        "responses": {
          "200": { "description": "Nilai berhasil disimpan." }
        }
      }
    ]
  },
  {
    "group": "Registrants",
    "endpoints": [
      {
        "path": "/api/registrants",
        "method": "GET",
        "description": "Mendapatkan daftar semua pendaftar di semua jadwal (agregat). Mendukung paginasi, filter, dan pencarian. Hanya untuk admin.",
        "authentication": true,
        "roles": ["admin"],
        "request": {
          "query": [
            { "name": "page", "type": "number" },
            { "name": "limit", "type": "number" },
            { "name": "status", "type": "string", "enum": ["pending", "approved", "rejected"] },
            { "name": "search", "type": "string" },
            { "name": "sort", "type": "string", "enum": ["newest", "oldest"] }
          ]
        },
        "responses": {
          "200": { "description": "Pendaftar berhasil ditemukan." }
        }
      }
    ]
  },
  {
    "group": "Participants",
    "endpoints": [
      {
        "path": "/api/participants/history",
        "method": "GET",
        "description": "Mendapatkan riwayat pendaftaran tes untuk peserta yang sedang login. Hanya untuk peserta.",
        "authentication": true,
        "roles": ["peserta"],
        "request": {},
        "responses": {
          "200": { "description": "Riwayat pendaftaran berhasil ditemukan." }
        }
      }
    ]
  }
]
```
