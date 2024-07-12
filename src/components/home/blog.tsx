import Link from "next/dist/client/link"
import Img from 'next/image'

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
}

type props = {
  postData: [post]
}

export default function Blog(props:props) {

  let posts
  if (props.postData) {
    posts = props.postData.map((post:post, index:number) => {
      return (
        <div className="post" key={post.id}>
          <h2>{post.title}</h2>
        </div>
      )
    })    
  }
  else {
    posts = <div>No posts</div>
  }



  return (
    <div className='blogPanel panel' id='blog'>
      <div className="container">
        <h1>Blog Section</h1>
        {posts}
      </div>
    </div>
  )
}