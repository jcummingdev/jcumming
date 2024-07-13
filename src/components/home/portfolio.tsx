import Img from 'next/image'
import { useSession } from "next-auth/react"
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { useS3Upload } from 'next-s3-upload'
import axios from 'axios'
import nProgress from 'nprogress'
import Link from 'next/link'
import { FaGithub, FaGlobe } from 'react-icons/fa6'

type ComponentProps = {
  scrollPos: number
}

type PortfolioItem = {
  name: string
  text: string
  link: string
  image: string
  tech: string
  type: string
  repo: string | null
  completed: string | null
}

export default function Portfolio({  portfolioItems } : { portfolioItems: PortfolioItem[]} ) {

  let { FileInput, openFileDialog, uploadToS3 } = useS3Upload();

  const [Items, setItems] = useState(portfolioItems)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [createNewItem, setCreateNewItem] = useState(false)
  const [newItem, setNewItem] = useState({name: '', text: '', link: '', image: '', tech: '', type: '', repo: null, completed: null})

  const { data: session, status } = useSession()

  function togglePortoflioEditor() {
    setCreateNewItem(!createNewItem)
  }

  function inputHandler(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) {
    setNewItem({
      ...newItem,
      [e.target.name]: e.target.value
    })
  }

  let handleFileChange = async (file: File) => {
    nProgress.start()

    let { url } = await uploadToS3(file);

    console.log(url)

    // Add the image url to the postData object
    setNewItem((prevState) => ({
        ...prevState,
        image: url
    }))

    nProgress.done()
  }

  async function submitChanges() {
    nProgress.start()
    let res = axios.post('/api/createPortfolioItem', {
      data: newItem
    })

    setItems([newItem, ...Items])
    togglePortoflioEditor()
    setNewItem({name: '', text: '', link: '', image: '', tech: '', type: '', repo: null, completed: null})

    nProgress.done()
  }

  const portfolioShowcase = Items.map((item, index) => {
    return (
      <div className='portfolioItem' key={index}>
        <div className='portfolioImg'>
          <Img src={item.image? item.image : 'https://placehold.co/1000x500'} alt="Portfolio Image" fill={true} style={{objectFit: 'cover'}} />
        </div>
        <div className='portfolioContent'>
          <h2>{item.name}</h2>
          <p>{item.type}</p>
          <p>{item.text}</p>
          <p><strong>Tech Used: {item.tech}</strong></p>
          <div className='portfolioLinks'>
            <Link href={item.link} target="_blank" rel="noreferrer"><FaGlobe /></Link>
            {
              item.repo?
              <Link href={item.repo} target="_blank" rel="noreferrer"><FaGithub /></Link>
              :
              <p>Private Repository</p>
            }
          </div>
        </div>
      </div>
    )
  })

  return (
    <div className='portfolioPanel panel' id='portfolio'>
      <div className="container">
        <h1 className="introHead">This is my <span>Portfolio</span></h1>
      </div>
      <div className='portfolioItems'>
        {
          status === 'authenticated' ? 
          <div className='portfolioAdminOptions'>
            <button onClick={togglePortoflioEditor} className='createNewItemToggle'><span style={createNewItem ? {rotate: '45deg'} : {}}><FiPlus /></span></button>
            {
              createNewItem ? 
                <div className='portfolioEditor'>
                  <div className='portfolioImg'>
                    <Img src={newItem.image? newItem.image : 'https://placehold.co/1000x500'} alt="New Portfolio Item Image" fill={true} style={{objectFit: 'cover'}} />
                    <FileInput onChange={handleFileChange} />
                    <button className="uploadPortfolioImage" onClick={openFileDialog}>Upload Featured Image</button>
                  </div>
                  <div className='portfolioContent'>
                    <form onSubmit={submitChanges}>
                      <input type="text" name='name' placeholder='Item Name' onChange={(e) => inputHandler(e)}/>
                      <input type="text" name='type' placeholder='Item Type' onChange={(e) => inputHandler(e)}/>
                      <textarea name="text" placeholder="Item Description" onChange={(e) => inputHandler(e)}></textarea>
                      <input type="text" name='link' placeholder='Item Link' onChange={(e) => inputHandler(e)}/>
                      <input type="text" name='tech' placeholder='Item Tech Stack' onChange={(e) => inputHandler(e)}/>
                      <button type='submit'>Create</button>                      
                    </form>

                  </div>
                </div>
              : <></>
            }
          </div> 
          : <></>
        }
      </div>

      {portfolioShowcase}
    </div>
  )
}