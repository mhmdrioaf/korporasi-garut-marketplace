import { StaticImport } from "next/dist/shared/lib/get-img-props";
import Image from "next/image";
import Link from "next/link";

interface IAdminDashboardMenuProps {
  link: string;
  title: string;
  background: StaticImport;
}

export default function AdminDashboardMenu({
  link,
  title,
  background,
}: IAdminDashboardMenuProps) {
  return (
    <div className="w-full grid place-items-center relative rounded-md overflow-hidden px-8 py-16">
      <Image
        src={background}
        fill
        alt="Menu Background"
        className="object-cover"
        sizes="100vw"
      />
      <Link
        href={link}
        className="absolute w-full h-full grid place-items-center bg-gradient-to-t from-black to-transparent bg-opacity-50 text-white text-2xl font-bold"
      >
        {title}
      </Link>
    </div>
  );
}
