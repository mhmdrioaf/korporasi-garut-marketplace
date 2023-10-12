"use client";

import Link from "next/link";

interface IAdminDashboardCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
  className: string;
}

export default function AdminDashboardCard({
  title,
  description,
  icon,
  link,
  className,
}: IAdminDashboardCardProps) {
  return (
    <Link
      href={link}
      className={
        "w-full rounded-md p-4 flex flex-row items-center justify-start gap-4 " +
        className
      }
    >
      {icon}
      <div className="flex flex-col gap-1">
        <p
          className="font-bold text-lg whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p className="text-sm">{description}</p>
      </div>
    </Link>
  );
}
