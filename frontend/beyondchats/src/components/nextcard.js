'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from 'next/navigation';

export default function NextCard({ article }) {
  const Articlecontent = article?.contentBlocks?.slice(360, 510);
  const router = useRouter();

  return (
    <div
      className="
        relative
        w-full sm:w-[720px]
        flex flex-row
        rounded-[16px] sm:rounded-[24px]
        md:m-2
        bg-[#D9D9D4]
        p-2 sm:p-4
      "
      style={{
        boxShadow:
          "0 20px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      <div
        className="
          w-[110px] h-[80px]
          sm:w-[260px] sm:h-[200px]
          overflow-hidden
          rounded-[12px] sm:rounded-[16px]
          flex-shrink-0
        "
      >
        <img
          src={article.heroImage}
          alt={article.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col pl-3 sm:pl-6 pr-2 flex-1">
        <p className="text-[9px] sm:text-[11px] uppercase tracking-wider text-[#8b8b87] mb-1 sm:mb-2">
          Design — 5 min read
        </p>

        <h2
          className="
            font-serif
            text-[15px] sm:text-[22px]
            leading-tight
            text-[#1f1f1f]
            mb-1
          "
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {article?.title}
        </h2>

        <p
          className="
            text-[11px] sm:text-[14px]
            text-[#5f5f5b]
            leading-[1.4] sm:leading-[1.6]
            line-clamp-2 sm:line-clamp-none
            mb-2
          "
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          <ReactMarkdown>
            {typeof Articlecontent === "string"
              ? `${Articlecontent} ...`
              : ""}
          </ReactMarkdown>
        </p>

        <button
          onClick={() => router.push(`/article/${article._id}`)}
          className="text-[11px] sm:text-[14px] text-blue-700 underline underline-offset-4 self-start"
        >
          Read More
        </button>
      </div>
    </div>
  );
}
