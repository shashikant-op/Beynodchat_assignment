'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from 'next/navigation';
export default function NextCard({ article }) {
    const Articlecontent=article.contentBlocks.slice(360,510);
    const router= useRouter();
  return (
    <div
      className="relative w-[720px] flex flex-row rounded-[24px] m-3 bg-[#D9D9D4] p-4"
      style={{
        boxShadow:
          "0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)",
      }}
    >
      {/* Left Section */}
      <div className="w-[260px] h-[200px] overflow-hidden rounded-[16px] flex-shrink-0">
        <img
          src={article.heroImage}
          alt="Beyond Chats"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Section */}
      <div className="flex flex-col pl-6 pr-4 pt-2 flex-1">
        <p className="text-[11px] uppercase tracking-wider text-[#8b8b87] mb-2">
          Design — 5 min read
        </p>

        <h2
          className="font-serif text-[22px] leading-[1.25] text-[#1f1f1f] mb-2"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {article ? article.title : "Title"}
        </h2>

        <div className="flex flex-row">
          <div>
            <p
              className="text-[14px] text-[#5f5f5b] leading-[1.6] mb-4"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
             <ReactMarkdown>
                {typeof Articlecontent === "string" ?`${Articlecontent}   ...` : ""}
                </ReactMarkdown>
            </p>
            <button onClick={()=>{
                        router.push(`/article/${article._id}`)
                    }} className="text-[14px] cursor-pointer text-blue-700 underline underline-offset-4">
              Read More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
