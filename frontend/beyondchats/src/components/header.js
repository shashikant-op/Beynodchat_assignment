'use client'
import React from "react";
import { useRouter } from "next/navigation";
function Header() {
    const router=useRouter();
  return (
    <header className="header">
      <div onClick={()=>{
        router.push("/")
      }} className="logo cursor-pointer flex pl-10   align-center  flex-row  bg-[#CAC8BE]  text-xl font-serif font-bold uppercase italic">
        <div className=" w-10 p-1"><img src="/output-onlinepngtools.png" alt="Beyond Chats" /> </div>
        <div  className="text-white flex align-center  p-2 flex align-center">Beyond Chats</div>
      </div>
      
    </header>
  );
}
export default Header;