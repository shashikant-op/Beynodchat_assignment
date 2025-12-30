'use client'
import React from "react";
import ReactMarkdown from "react-markdown";
import { useRouter } from 'next/navigation';
export default function Card({article}) { 
    const router = useRouter();
    const Articlecontent=article.contentBlocks.slice(360,760);
    return (
        
        <div className="relative w-[360px] rounded-[24px] m-3 bg-[#E1E0DA] px-4 pt-6 pb-8" 
            style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)", }} >
                <div className="w-full h-[160px] overflow-hidden rounded-[18px]">
                    <img src={article.heroImage} alt="Beyond Chats" />
                </div>
                <div className="textsection  p-1 mt-1">
                    <p className="text-[11px] uppercase tracking-wider text-[#8b8b87] mb-2">
                    Design — 5 min read
                    </p>
                    <h2
                    className="font-serif text-[22px] leading-[1.25] text-[#1f1f1f] mb-8"
                    style={{ fontFamily: "Playfair Display, serif" }}
                    >
                    {article ? article.title : "Temp Title"}
                    </h2>
                    <div className="flex flex-row">
                    {/* Divider */}
                    <div className="w-[5px] mr-3 h-[90px] bg-blue-700" />
                    
                         {/* Content */}
                         <div>
                    <p
                    className="text-[14px] text-[#5f5f5b] leading-[1.6] mb-6"
                    style={{ fontFamily: "Inter, sans-serif" }}
                    >
                    
                     <ReactMarkdown>
                                   {typeof Articlecontent === "string" ? `${Articlecontent}   ...`  : "" }
                    </ReactMarkdown>
                                
                    </p>

                    {/* Read More */}
                    <button onClick={()=>{
                        router.push(`/article/${article._id}`)
                    }} className="text-[14px] cursor-pointer text-blue-700 underline underline-offset-4">
                    Read More
                    </button>
                    </div>
                    </div>
                   
                </div>
  </div>

); }