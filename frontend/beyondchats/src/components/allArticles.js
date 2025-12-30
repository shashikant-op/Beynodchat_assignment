"use client";
import Card from "@/components/card";
import NextCard from "@/components/nextcard";
import axios from "axios";
import { useState,useEffect } from "react";


function ArticlePage() {
     const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;
    const fetchArticles = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/articles`);
        setArticles(res.data);
        console.log(res.data);
        
      } catch (err) {
        console.error(err);
        setError("Failed to load articles");
      } finally {
        setLoading(false);
      }
    };
     

    fetchArticles();
  }, []);
   if (!articles) return <h1>Loading...</h1>;
  return (
    <div>
     <div className="justify-center  bg-[var(--background)] min-h-screen py-5">
         <div className="flex flex-row justify-center flex-wrap">
            {articles.slice(0, 1).map((article) => (
                <Card key={article.id} article={article} />
            ))}
            </div>

            <div className="flex justify-center flex-col items-center p-4 text-gray-600 hover:text-gray-800 cursor-pointer">
            <span className="text-3xl my-4">Next Article</span>
            <div>
                {articles.slice(1).map((article) => (
                <NextCard key={article.id} article={article} />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
export default ArticlePage;