import Image from "next/image";

type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <a className="brand" href="#top" aria-label="VettaLume home">
      <Image
        className="brandLogo"
        src="/Vettalume-LOGO.png"
        alt=""
        width={96}
        height={60}
        priority
      />
      {!compact ? (
        <span className="brandText">
          VettaLume
        </span>
      ) : null}
    </a>
  );
}
