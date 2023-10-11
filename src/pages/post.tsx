import axios from "axios"
import { useState } from "react"
import { useS3Upload } from "next-s3-upload"
import Tiptap from "@/components/admin/Tiptap";

export default function CreatePost() {

    let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

    // Initialize types for postData
    interface postData {
        title: string
        content: string
        image: string
    }

    // Initialize state for the post content and set type to postData
    const [postData, setPostData] = useState<postData>({
        title: '',
        content: '',
        image: ''
    })


    // input handler function
    function inputHanlder(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {

        const field: string = e.target.name
        const value: string = e.target.value

        // Update postData state with the incoming values. Assign values to the matching field from input name property.
        setPostData((prevState) => ({
            ...prevState,
            [field]: value,
        }));
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

    // Axios Post Article Function
    async function postArticle() {
        let {data} = await axios.post('/api/blog/new-post', {
            data: postData
        })
    }

    // debugging
    function logData() {
        console.log(postData)
    }

    return (
        <div className="createPost" id="createPost">

            <button onClick={logData}>log data</button>
            <input type="text" name="title" onChange={(e) => inputHanlder(e)} />

            <FileInput onChange={handleFileChange} />

            <button onClick={openFileDialog}>Upload file</button>

            {postData.image && <img src={postData.image} alt="blogImage"/>}

            <Tiptap
                updater={changeContent}
            />

            <button onClick={postArticle}>Post Article</button>

        </div>
    )
}

