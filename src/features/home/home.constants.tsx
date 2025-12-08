import { LuNewspaper, LuShieldCheck, LuStickyNote } from "react-icons/lu";

export const homeConstants = {
  features: [
    {
      title: "Sertifikat Terverifikasi",
      description:
        "Setiap sertifikat dicatat dalam blockchain, menjamin keaslian dan mencegah pemalsuan data.",
      icon: <LuNewspaper />,
    },
    {
      title: "Tes TOEFL Standar",
      description:
        "Soal dan penilaian tes TOEFL kami dirancang sesuai dengan standar internasional untuk hasil yang akurat.",
      icon: <LuStickyNote />,
    },
    {
      title: "Keamanan Transparan",
      description:
        "Dengan smart contract, data Anda aman dan transparan, memberikan ketenangan selama proses tes.",
      icon: <LuShieldCheck />,
    },
  ],
  testimonials: [
    {
      content:
        "Prosesnya sangat mudah dan cepat. Fitur verifikasi blockchain memberikan rasa aman karena saya tahu sertifikat saya tidak dapat dipalsukan. Sangat direkomendasikan untuk para pencari beasiswa!",
      name: "Aisha Rahmawati",
      role: "Mahasiswa S2",
    },
    {
      content:
        "Saya mengambil tes prediksi di SIMPEKA dan hasilnya sangat membantu saya mempersiapkan diri untuk tes resmi. Platformnya stabil dan antarmukanya sangat ramah pengguna",
      name: "Budi Santoso",
      role: "Profesional",
    },
  ],
};
