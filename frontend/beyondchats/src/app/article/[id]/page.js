'use client';
import { use, useEffect, useState } from 'react';
import ReactMarkdown from "react-markdown";
import Header from '@/components/header';
export default function Page({ params }) {
  const { id } = use(params);
  const [article, setArticle] = useState(null);

  useEffect(() => {
    const backendUrl= process.env.NEXT_PUBLIC_API_URL;
    fetch(`${backendUrl}/api/articles/${id}`)
      .then(res => res.json())
      .then(data => setArticle(data));
  }, [id]);

  if (!article) return <h1>Loading...</h1>;

  return (
    <main>
      <div className='articlessectio flex flex-row gap-1 p-1'>
        <div className='old_article_section bg-[#E1E0DA] rounded-[24px] h-fit  m-3 w-full p-3'
        style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)", }} >
             <article className="markdown-container">
              <h4>Original Article</h4>
              <ReactMarkdown>
                {article.contentBlocks}
              </ReactMarkdown>
            </article>
        </div>
        <div className='ai_created_section h-fit bg-[#E1E0DA] rounded-[24px] m-3 w-full'
        style={{ boxShadow: "0 30px 60px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.6)", }} >
          <div className='overflow-hidden'>
          <img className="rounded-t-[24px] " src={article.heroImage} />
          </div>
            <article className="markdown-container  p-3 ">
              <ReactMarkdown>
                {article.aiContentBlocks}
              </ReactMarkdown>
              Refrence <br/>
              <span className='text-blue-600 text-sm'><a href={article.referenceUrl[0]}>{article.referenceUrl[0]}</a></span><br/>
              <span className='text-blue-600 text-sm'><a href={article.referenceUrl[1]}>{article.referenceUrl[1]}</a></span>

            </article>
            
        </div>

      </div>
    </main>
  );
}