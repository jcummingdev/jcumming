import {useEffect} from 'react'
import Img from 'next/image'

export default function Portfolio() {
  
  useEffect(() => {
    
    return (() => {
      
    })
  }), []
  
  return(
    <div className='portfolioPanel panel' id='portfolio'>
      <div className='background'>
        <code>{`// pages/posts/[id].js import { PrismaClient } from "@prisma/client" import Img from 'next/image' import Link from 'next/link' import MRU from "../../../components/template/ads/mru" import AuthorBio from "../../../components/template/author/authorBio" import NewsletterSignup from "../../../components/template/post/newsletterSignUpWidget" import Comment from "../../../components/template/post/comments/comment" import moment from 'moment'; import FeaturedStories from '../../../components/template/archive/featuredStories' import CommentBox from "../../../components/template/post/comments/commnetBox" import { useState, useEffect } from "react" import { useSession, signIn, signOut } from "next-auth/react" import axios from 'axios'; import Head from "next/head" import SocialShareButtons from "../../../components/template/post/socialShareButtons" import { useRouter } from 'next/router' import SidebarLayout from '../../../components/template/sidebar/sidebarLayout' import { Adsense } from "@ctrl/react-adsense" export async function returnData() { const prisma = new PrismaClient // get all posts and include category and parent data to build links const postsData = await prisma.articles.findMany({ include: { category: { include: { parent: true } } } }) // apparently disconnect statements aren't explicitly required. prisma will disconnect on it's own.  await prisma.$disconnect() return { postData: postsData } } // Generates /posts/1 and /posts/2 export async function getStaticPaths() { const posts = await returnData() // build links based on all posts in database const paths = posts.postData.map((post) => ( { params: { postId: post.slug, catId: post.category.slug, pCatId: post.category.parent.slug } } )) return { paths, fallback: 'blocking' }; } export async function getStaticProps({ params }) { const now = new Date const prisma = new PrismaClient const postRaw = await prisma.articles.findUnique({ where: { slug: params.postId },  select: { id: true, postDate: true, updatedDate: true, author: { select: { id: true, name: true, bio: true, firstName: true, lastName: true, image: true, facebook: true, instagram: true, linkedin: true, website: true, contact: true, medium: true, twitter: true, } }, title: true, exerpt: true, content: true, category: { include: { parent: true } }, featuredImage: true, slug: true, viewcount: true, keywords: true, paywall: true, status: true, Photographer: true, comments: { select: { id: true, commentDate: true, commentBody: true, commentorId: true, commentor: true, },  orderBy: { commentDate: 'desc' } } } }) const readMoreRaw = await prisma.articles.findMany({ where: { postDate: { lt: now, } }, orderBy: { postDate: 'desc' }, take: 10, include: { category: { include: { parent: true } } } }) // const commentsRaw = await prisma.Comments.findMany({ //     where: { //         article: { //             slug: { //                 equals: params.postId //             } //         } //     }, //     include: { //         commentor: true //     }, //     orderBy: { //         commentDate: 'desc' //     } // }) const pageRaw = { content: postRaw, // comments: commentsRaw, readMore: readMoreRaw } const pageContent = JSON.parse(JSON.stringify(pageRaw)) await prisma.$disconnect() return { // Passed to the page component as props props: { postData: pageContent, key: pageContent.content.id }, revalidate: 10, } } export default function Post({ postData }) { const { data: session, status } = useSession() const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]; function generateContent(postData){ const fixedData = postData.content.replace(/<li><p>/g, '<li>').replace(/<\/p><\/li>/g, '</li>') const arr = fixedData.split('</p>') const content = arr.map((p, index) => { p.replace('<p>', ' ') if (index == 3) { return ( <div key={index+'inline'}> <MRU /> <div dangerouslySetInnerHTML={{__html: p}}/> </div> ) } else if (index == 7) { return ( <div key={index+'inline'}> <NewsletterSignup /> <div dangerouslySetInnerHTML={{__html: p}}/> </div> ) } else if (index > 7 && index % 5 == 0) { return ( <div key={index+'inline'}> <MRU /> <div dangerouslySetInnerHTML={{__html: p}}/> </div> ) } else { return ( <div key={index+'inline'} dangerouslySetInnerHTML={{__html: p}}/> )                 } }) // return arr return content } const content = generateContent(postData.content) const [comments, setComments] = useState(postData.content.comments) function newComment(comment){ const commentContent = { commentBody: comment, commentDate: new Date(), commentor: { name: session.user.name, id: session.user.id, image: session.user.image? session.user.image : '/placeholder-user.png' } } setComments(prevState => [ commentContent, ...prevState ]); const addComment = async () => { const { data } = await axios.post('/api/addComment', { comment, postId: postData.content.id, commentor: session.user.id, }); }; addComment(); // scroll to "comments" section const commentsSection = document.getElementById("comments"); commentsSection.scrollIntoView({ behavior: "smooth" }); } const commentsSection = comments.map((comment,index) => { if (status === 'loading'){ <p>loading</p> } else if (status === 'authenticated' ){ return( <Comment key={'comment'+index} commentId={comment.id} commentorId={comment.commentor.id} commentorName={comment.commentor.name} commentorImg={comment.commentor.image} commentorRole={comment.commentor.role} date={moment.utc(comment.commentDate).local().startOf('seconds').fromNow()} body={comment.commentBody} commentAuthor={comment.commentorId == session.user.id ? true: false} /> )             } else { <Comment key={'comment'+index} commentId={comment.id} commentorId={comment.commentor.id} commentorName={comment.commentor.name} commentorImg={comment.commentor.image} commentorRole={comment.commentor.role} date={moment.utc(comment.commentDate).local().startOf('seconds').fromNow()} body={comment.commentBody} /> } }) const readMore = postData.readMore.map((story, index) => { return( <FeaturedStories content={story}  key={'topStory' + index} /> ) }) const date = new Date(postData.content.postDate) const postDate = months[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear() useEffect(() => { async function updateViewCount() { const { data } = await axios.post('/api/updateViewCount', { id: postData.content.id }); } if (postData && postData.content) { updateViewCount(); } }, [postData]) const { asPath } = useRouter() const title = postData.content.title + ' | GAME ON Hockey' // check if post date has passed const now = new Date() useEffect(() => { if (date > now ){ document.getElementById('header').classList.add('dark-header'); } }, [date, now]) if (date > now ){ const posted = false; return( <> <Head> <title>{title}</title> <meta property="og:url" content={'https://gameonhockey.com' + asPath} /> <meta property="og:type" content="GAME ON Hockey" /> <meta property="og:title" content={postData.content.title} /> <meta name="twitter:card" content='summary' /> <meta property="og:description" content={postData.content.exerpt} /> <meta property="og:image" content={postData.content.featuredImage} /> <meta name="description" content={postData.content.exerpt}></meta> </Head> <SidebarLayout> <div className="not-yet"> <h1>Sorry, this article isn&apos;t ready just yet!</h1> <p>This article is going live {moment.utc(date).local().endOf('seconds').fromNow()}</p> </div> </SidebarLayout> </> ) } return ( <> <Head> <title>{title}</title> <meta property="og:url" content={'https://gameonhockey.com' + asPath} /> <meta property="og:type" content="GAME ON Hockey" /> <meta property="og:title" content={postData.content.title} /> <meta name="twitter:card" content='summary' /> <meta property="og:description" content={postData.content.exerpt} /> <meta property="og:image" content={postData.content.featuredImage} /> <meta name="description" content={postData.content.exerpt}></meta> </Head> <div> <div style={{width: '100%', height: '95vh', position: 'relative'}}> <Img src={postData.content.featuredImage? postData.content.featuredImage : '/uploads/placeholder-featured.png'} fill={true} sizes="1000px" style={{objectFit: 'cover'}} alt={postData.content.title} /> <div className='article-overlay' style={{height: '100%'}}> <div className='article-intro-container'> <div className='article-intro-content'> <div className='meta'> <Link href={'/' + postData.content.category.parent.slug + '/' + postData.content.category.slug}><span className='category-marker'>{postData.content.category.name}</span></Link> <span className="header-date">{moment.utc(postData.content.postDate).local().startOf('seconds').fromNow()}</span> </div> <h1>{postData.content.title}</h1> <p className="post-preview">{postData.content.exerpt}</p> <p className="photography-credit">Photo by {postData.content.Photographer}</p> </div> </div> </div> </div> <SidebarLayout> <div className="post-author"> <div style={{width: '40px', height: '40px', position: 'relative'}}> <Img src={(postData.content.author.image? postData.content.author.image : '/placeholder-user.png')} fill={true} alt={postData.content.author.name + " author photo"} style={{objectFit: 'cover'}} />                         </div> <div className="author-date"> <div className="byline"> <span>By  <Link href={'/authors/' + postData.content.author.name.replace(/\s+/g, '-').toLowerCase()}> {' ' + postData.content.author.name} </Link> </span> <span className="date">{postDate}</span> </div> </div> </div>  <article className="article"> <SocialShareButtons  path={asPath} /> {content} <SocialShareButtons  path={asPath} /> </article> <div id="read-next" className="read-next-section"> <h4>Read Next</h4> <div className='featured-story-slider'> {readMore} </div> </div> <AuthorBio data={postData.content.author}/> <div id="comments" className="comment-section"> <h4>Comments</h4> {commentsSection} </div> </SidebarLayout> <CommentBox  clickHandler={newComment} /> </div> </> ) }`}</code>
      </div>
      <div className='container'>
        <h1>Portfolio</h1>

        <div className='workShowcase'>
          <span className='lastCard card'>
            <Img 
              src='http://placekitten.com/1000/1000'
              fill={true}
              style={{objectFit: 'cover'}}
              alt='Day Job Work'
            />
            <div className='cardContent'>
              <h2>This is what goes on at my day job</h2>
            </div>          </span>
          <span className='card'>
            <Img 
              src='http://placekitten.com/1000/1000'
              fill={true}
              style={{objectFit: 'cover'}}
              alt='Day Job Work'
            />
            <div className='cardContent'>
              <h2>This is what goes on at my day job</h2>
            </div>
          </span>
          <span className='card'>
            <Img 
              src='http://placekitten.com/1000/1000'
              fill={true}
              style={{objectFit: 'cover'}}
              alt='Day Job Work'
            />
            <div className='cardContent'>
              <h2>This is what goes on at my day job</h2>
            </div>
          </span>
          <span className='card'>
            <Img 
              src='http://placekitten.com/1000/1000'
              fill={true}
              style={{objectFit: 'cover'}}
              alt='Day Job Work'
            />
            <div className='cardContent'>
              <h2>This is what goes on at my day job</h2>
            </div>
          </span>
          <span className='firstCard card'>
            <Img 
              src='http://placekitten.com/1000/1000'
              fill={true}
              style={{objectFit: 'cover'}}
              alt='Day Job Work'
            />
            <div className='cardContent'>
              <h2>This is what goes on at my day job</h2>
            </div>
          </span>
        </div>
      </div>

    </div>
  )
}