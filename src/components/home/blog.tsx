import Link from "next/dist/client/link"
import Img from 'next/image'
import { useState } from "react"
import { FaArrowRight } from "react-icons/fa6"

type category ={
  name: string
  slug: string
}

type post = {
  id: string
  title: string
  image: string
  postDate: string
  slug: string
  category: category
  content: string
}

export default function Blog({ postData } : {postData: post[]}) {

  const [activeIndex, setActiveIndex] = useState(0)

  let posts
  if (postData) {
    posts = postData.map((post:post, index:number) => {
      return (
        <button className={`postPreviewSelect ${index === activeIndex ? 'active' : ''}`} key={post.id} onClick={() => setActiveIndex(index)}>
          <h2>{post.title}</h2>
          <p>{post.category.name}</p>
          <p className="postPreview" dangerouslySetInnerHTML={{__html: post.content}}/>
        </button>
      )
    })    
  }
  else {
    posts = <div>No posts</div>
  }



  return (
    <div className='blogPanel panel' id='blog'>
      <h2 className="blogTitle">Blog</h2>
      <div className="articlePreview">
        <Img src={postData[activeIndex].image} fill={true} alt='blog image' style={{objectFit: 'cover', zIndex: -1}} />
        <div className="gradientOverlay">
          <h3>{postData[activeIndex].title}</h3>
          <p className="postPreview" dangerouslySetInnerHTML={{__html: postData[activeIndex].content}}/> 
          <Link className="readMore" href={`/${postData[activeIndex].slug}`}>Read More <FaArrowRight /></Link>

        </div>
      </div>
      <div className="previewSelect">
        {posts}
      </div>
    </div>
  )
}