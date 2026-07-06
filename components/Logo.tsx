import Image from "next/image";
import Link from "next/link";

type LogoProps = {
  compact?: boolean;
};

export default function Logo({ compact = false }: LogoProps) {
  return (
    <Link className="brand" href="/" aria-label="VettaLume home">
      <Image
        className="brandLogo"
        src="/logo-mark.png"
        alt="VettaLume"
        width={112}
        height={68}
        priority
      />
      {!compact ? (
        <span className="brandText">
          VETTA<em>LUME</em>
        </span>
      ) : null}
    </Link>
  );
}
