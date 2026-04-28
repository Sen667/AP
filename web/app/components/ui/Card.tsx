import { ArrowRight } from "@deemlol/next-icons";
import Link from "next/link";

type CardProps = {
  title: string;
  description: string;
  linkText: string;
  linkPath: string;
};

export default function Card({
  title,
  description,
  linkText,
  linkPath,
}: CardProps) {
  return (
    <div className="h-full p-5 border border-gray-200 rounded-lg flex flex-col bg-white">
      <div className="mb-4">
        <h5 className="text-[1rem] font-semibold mb-2">{title}</h5>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <div className="mt-auto">
        <Link
          href={`${linkPath}`}
          className="group text-primary text-sm font-medium flex items-center gap-2 w-fit"
        >
          <span className="relative">
            {linkText}
            <span className="absolute -bottom-0.5 left-0 w-full h-0.5 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
          </span>
          <ArrowRight
            size={14}
            className="text-primary group-hover:translate-x-0.5 transition-transform duration-200"
          />
        </Link>
      </div>
    </div>
  );
}
