import axios from "axios"
import { useState } from "react"
import { useS3Upload } from "next-s3-upload"
import Tiptap from "@/components/admin/Tiptap";
import { PrismaClient } from "@prisma/client";
import { InferGetStaticPropsType } from "next";
import Router, { useRouter } from "next/router";
import Img from 'next/image'

export default function CreatePost({categories}: InferGetStaticPropsType<typeof getStaticProps>) {

    // initialize s3 dependencies
    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

    // initialize error and loading states
    const [error, setError] = useState()
    const [loading, setLoading] = useState(false)

    // Initialize types for postData
    interface postData {
        title: string
        content: string
        image: string
        catSlug: string
        slug: string
    }

    // initialize types for category
    interface category {
        id: string
        name: string
        slug: string
    }

    // Initialize state for the post content and set type to postData
    const [postData, setPostData] = useState<postData>({
        title: '',
        content: '',
        image: '',
        catSlug: categories[0].slug,
        slug: '',
    })

    // input handler function
    function inputHanlder(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {

        const field: string = e.target.name
        const value: string = e.target.value

        // Update postData state with the incoming values. Assign values to the matching field from input name property.
        setPostData((prevState) => ({
            ...prevState,
            [field]: value,
        }));

        // if field is title, create URL string from title and add to postData
        if ( field == 'title' ){
            const slug = value.replace(/[^a-zA-Z ]/g, "").replace(/\s+/g, '-').toLowerCase();

            setPostData((prevState) => ({
                ...prevState,
                slug: slug
            }));
        }
    }

    // S3 image upload function
    let handleFileChange = async (file: any) => {
        let { url } = await uploadToS3(file);

        // Add the image url to the postData object
        setPostData((prevState) => ({
            ...prevState,
            image: url
        }))
    };

    // handle tiptap content
    function changeContent(incomingHTML:string) {
        setPostData((prevContent) => ({
            ...prevContent,
            content: incomingHTML
        }));
    }

    // redirection function to fire after post succeeds
    const router = useRouter()
    function redirectAfterPost() {
        router.push('/' + postData.catSlug + '/' + postData.slug)
    }

    // Axios Post Article Function
    async function postArticle() {

        // if post is already loading, disable function
        if (loading){
            return
        }

        // If not already loading, set loading status to true
        setLoading(true)

        // run validation API
        let {data} = await axios.post('/api/blog/validate-post', {
            data: postData
        })

        // if validation fails (caPost is false from API)
        if (!data.canPost) {
            // set error message, set loading false, return without posting
            setError(data.message)
            setLoading(false)
            return
        }

        // if validation succeeds
        try{
            let {data} = await axios.post('/api/blog/new-post', {
                data: postData
            })            
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
            redirectAfterPost()
        }
    }

    // debugging
    // function logData() {
    //     console.log(postData)
    // }

    // generate the category dropdown options
    const catOptions = categories.map((cat:category, index:number) => {
        return (
            <option value={cat.slug} key={`${index}category`}>{cat.name}</option>
        )
    })

    return (
        <div className="createPost container" id="createPost">
            <div className="postTop">
                <div className="featuredImage">
                    {postData.image && <Img src={postData.image} fill={true} style={{objectFit: 'cover'}} alt="blogImage"/>}
                </div>
                <div className="postTopContent">
                    <h1>Create New Post</h1>
                    <input type="text" name="title" className="titleInput" placeholder="Post Title" onChange={(e) => inputHanlder(e)} />
                    <label>
                        Select a Category
                        <select name="catId" id="catId" onChange={(e) => inputHanlder(e)}>
                            {catOptions}
                        </select>                       
                    </label>
                    <FileInput onChange={handleFileChange} />
                    <button className="uploadFeaturedImage" onClick={openFileDialog}>Upload Featured Image</button>
                    {
                        error? (
                            <div className="validationError">
                                <span>{error}</span>
                            </div>                    
                        )
                        : 
                        <></>
                    }
                </div>
            </div>

            <Tiptap
                updater={changeContent}
            />

            <button onClick={postArticle} className="postArticle" style={loading? {background: '#444'} : {background: '#000'}}>{loading? <Img src='/dots-loading-animation.gif' width={50} height={16} alt="loading"/> : <span>Post Article</span>}</button>
            {/* <button onClick={logData}>log data</button> */}

        </div>
    )
}

// pull categories from database to propogate select options
export async function getStaticProps(){

    const prisma = new PrismaClient()

    const categoriesRaw = await prisma.postCategories.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
        }
    })

    // close prisma connection
    prisma.$disconnect

    // make the JSON result from prisma usable
    const categories = JSON.parse(JSON.stringify(categoriesRaw))

    return {
        props: {
            categories
        }, 
        revalidate: 10
    }
}
