import Image from "next/image";

export function UsBand({
  src,
  alt,
  eyebrow,
  title,
}: {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="relative h-[300px] w-full overflow-hidden sm:h-[380px]">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/75 to-ink/20" />
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto w-full max-w-content px-6">
          <p className="font-grotesk text-xs uppercase tracking-[0.2em] text-sky">{eyebrow}</p>
          <h3 className="mt-2 max-w-xl font-display text-[clamp(1.6rem,3.5vw,2.4rem)] font-bold leading-[1.15] tracking-tight text-white">
            {title}
          </h3>
        </div>
      </div>
    </section>
  );
}
