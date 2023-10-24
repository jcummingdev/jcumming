import axios from "axios"
import { useState } from "react"
import { useS3Upload } from "next-s3-upload"
import Tiptap from "@/components/admin/Tiptap";
import { PrismaClient } from "@prisma/client";
import { InferGetStaticPropsType } from "next";
import Router, { useRouter } from "next/router";

export default function CreatePost({categories}: InferGetStaticPropsType<typeof getStaticProps>) {

    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

    const [error, setError] = useState()

    // Initialize types for postData
    interface postData {
        title: string
        content: string
        image: string
        catSlug: string
        slug: string
    }

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

    function changeContent(incomingHTML:string) {
        setPostData((prevContent) => ({
            ...prevContent,
            content: incomingHTML
        }));
    }

    const router = useRouter()
    function redirectAfterPost() {
        router.push('/' + postData.catSlug + '/' + postData.slug)
    }

    // Axios Post Article Function
    async function postArticle() {
        let {data} = await axios.post('/api/blog/validate-post', {
            data: postData
        })

        if (!data.canPost) {
            setError(data.message)
            return
        }

        try{
            let {data} = await axios.post('/api/blog/new-post', {
                data: postData
            })            
        } catch (err) {
            console.log(err)
        } finally {
            redirectAfterPost()            
        }
    }

    // debugging
    function logData() {
        console.log(postData)
    }

    const catOptions = categories.map((cat:category, index:number) => {
        return (
            <option value={cat.slug} key={`${index}category`}>{cat.name}</option>
        )
    })

    return (
        <div className="createPost container" id="createPost">

            {
                error? (
                    <div className="validationError">
                        <h2>{error}</h2>
                    </div>                    
                )
                : 
                <></>
            }


            <input type="text" name="title" className="titleInput" placeholder="Post Title" onChange={(e) => inputHanlder(e)} />

            <select name="catId" id="catId" onChange={(e) => inputHanlder(e)}>
                {catOptions}
            </select>

            <FileInput onChange={handleFileChange} />

            <button onClick={openFileDialog}>Upload file</button>

            {postData.image && <img src={postData.image} alt="blogImage"/>}

            <Tiptap
                updater={changeContent}
            />

            <button onClick={postArticle} className="postArticle">Post Article</button>
            <button onClick={logData}>log data</button>

        </div>
    )
}


export async function getStaticProps(){

    const prisma = new PrismaClient()

    const categoriesRaw = await prisma.postCategories.findMany({
        select: {
            id: true,
            name: true,
            slug: true,
        }
    })

    const categories = JSON.parse(JSON.stringify(categoriesRaw))

    return {
        props: {categories}
    }
}
