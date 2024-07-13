import { useState } from "react"
import axios from "axios"
import nProgress from "nprogress"
import Link from "next/link"
import { FaGithub, FaInstagram, FaLinkedin, FaTwitter, FaX, FaXTwitter } from "react-icons/fa6"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  })
  const [error, setError] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    nProgress.start()

    if (!formData.name || !formData.email || !formData.message) {
      setError('All fields are required')
      return
    }

    // validate the email address field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address')
      return
    }

    try {
      const res = await axios.post('/api/contact', {
        name: formData.name,
        email: formData.email,
        message: formData.message
      })
      if (res.status !== 200) {
        setError('Failed to send message. Please try again later.')
      }
    } catch (error) {
      console.error(error)
      setError('Failed to send message. Please try again later.')
    } finally {
      nProgress.done()
      setError("Your message has been sent!")
      setFormData({
        name: '',
        email: '',
        message: '',
      })
    }
  }

  return (
    <div className='contactPanel' id='contact'>
      <div className="container">
        <div className="contactPanelLeft">
          <h1>Contact Me</h1>
          <p>Fill in the form to the right to get in touch with me. I&apos;ll get back to you as soon as possible.</p>
          <p>Alternatively, feel free to connect and drop me a line on social media!</p>
          <div className="socialMediaIcons">
            <Link href="https://github.com/jcummingdev" target="_blank" rel="noopener noreferrer"><FaGithub size={32} /></Link>
            <Link href="https://www.linkedin.com/in/jrcumming/" target="_blank" rel="noopener noreferrer"><FaLinkedin size={32} /></Link>
            <Link href="https://www.instagram.com/j.r.cumming/" target="_blank" rel="noopener noreferrer"><FaInstagram size={32} /></Link>
            <Link href="https://x.com/jcumming_" target="_blank" rel="noopener noreferrer"><FaXTwitter size={32} /></Link>
          </div>
        </div>
        <div className="contactPanelRight">
          <form onSubmit={handleSubmit}>
            <div className="formGroup">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="formGroup">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>
            <button type="submit">Send</button>
            {error && <p className={error === "Your message has been sent!" ? "success" : "error"}>{error}</p>}
          </form>
        </div>


      </div>
    </div>
  )
}
