import { Button } from "@heroui/react";
import Link from "next/link";
import { homeConstants } from "./home.constants";
import TestimonyCard from "@/components/ui/Card/Testimony";

const Home = () => {
  return (
    <div className="bg-bg w-full">
      <section className="flex min-h-screen items-center justify-between gap-8 px-8 lg:px-20">
        <div className="flex-1 space-y-4">
          <h1 className="text-text text-5xl font-extrabold leading-snug md:text-6xl">
            Platform Tes TOEFL dengan{" "}
            <span className="text-primary">Verifikasi Blockchain</span>
          </h1>
          <p className="text-text-muted text-lg md:text-xl">
            Sistem terintegrasi untuk tes TOEFL dengan sertifikat terverifikasi
            blockchain. Transparan, aman, dan terpercaya.
          </p>
          <div className="flex gap-4 pt-4">
            <Button
              as={Link}
              href="/service"
              color="primary"
              size="lg"
              className="font-semibold"
            >
              Daftar Tes
            </Button>
            <Button
              as={Link}
              href="/verification"
              variant="bordered"
              size="lg"
              className="font-semibold"
            >
              Verifikasi Sertifikat
            </Button>
          </div>
        </div>
        <div className="hidden flex-1 lg:block">
          <div className="relative h-96 w-96">
            <div className="bg-primary absolute top-0 right-0 h-64 w-64 animate-float rounded-full opacity-30 blur-3xl" />
            <div className="bg-secondary absolute bottom-0 left-0 h-64 w-64 animate-float rounded-full opacity-30 blur-3xl" />
          </div>
        </div>
      </section>

      <section className="px-8 py-20 lg:px-20">
        <h2 className="text-text mb-12 text-center text-4xl font-bold">
          Mengapa Memilih SIMPEKA?
        </h2>
        <div className="grid gap-8 md:grid-cols-3">
          {homeConstants.features.map((feature, index) => (
            <div
              key={index}
              className="bg-bg-light rounded-lg border border-border-muted p-6 shadow-lg"
            >
              <div className="text-primary mb-4 text-4xl">{feature.icon}</div>
              <h3 className="text-text mb-2 text-xl font-bold">
                {feature.title}
              </h3>
              <p className="text-text-muted">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-20 lg:px-20">
        <h2 className="text-text mb-12 text-center text-4xl font-bold">
          Testimoni Peserta
        </h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {homeConstants.testimonials.map((testimony, index) => (
            <TestimonyCard
              key={index}
              name={testimony.name}
              job={testimony.role}
              testimony={testimony.content}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
