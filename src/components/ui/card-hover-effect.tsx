"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import Image from "next/image";

interface CardDemoProps {
  title: string;
  description: string;
  link: string;
  image: string;
  hoverImage: string;
}

export function HoverEffect({
  title,
  description,
  link,
  image,
  hoverImage,
}: CardDemoProps) {
  return (
    <Link
      href={link}
      className="block w-full sm:max-w-[190px] md:max-w-[230px] lg:max-w-[250px] z-40"
    >
      <div
        className={cn(
          "group cursor-pointer overflow-hidden relative h-[170px] sm:h-[190px] md:h-[210px] lg:h-[230px] w-full rounded-2xl mx-auto flex flex-col justify-end p-4 border border-yellow-500/50 dark:border-neutral-800/50",
          "transition-all duration-300 ease-in-out",
          "shadow-lg shadow-blue-300",
          "hover:shadow-lg hover:shadow-yellow-300",
          "hover:scale-105 hover:border-yellow-500/80 dark:hover:border-neutral-700/80",
          "before:absolute before:inset-0 before:bg-gradient-to-b before:from-transparent before:to-black/60 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100"
        )}
      >
        <Image
          src={image}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="transition-transform duration-300 group-hover:scale-110"
        />
        <Image
          src={hoverImage}
          alt={`${title} hover`}
          layout="fill"
          objectFit="cover"
          className="opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="text relative z-50 transform transition-transform duration-300 group-hover:translate-y-[-8px]">
          <h1 className="font-bold text-base sm:text-md md:text-xl lg:text-2xl text-white relative mb-2">
            {title}
          </h1>
          <p className="font-normal text-sm sm:text-xs  text-white relative">
            {description}
          </p>
        </div>
      </div>
    </Link>
  );
}
