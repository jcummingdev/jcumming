import { error } from "console"

export default function Contact(req: any, res: any) {
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Unauthorized' })
        return
    }

    // upload the post content to the database

    console.log(req.body)
    
    try {
        sendEmail(req.body)
    } catch (err) {
        res.status(500).send({message: 'the post failed'})
    } finally {
        res.status(200).send({message: 'success'})
    }
}

export async function sendEmail(body: {
    name: string
    email: string
    message: string
}) {

    console.log(body)

    const nodemailer = require("nodemailer");

    const transport = nodemailer.createTransport({
        host: "email-smtp.us-east-2.amazonaws.com",
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PW,
        },
    })
    async function main() {

        const info = await transport.sendMail({
            from: body.email,
            to: process.env.EMAIL_TO,
            subject: `New message from ${body.name}`,
            text: body.message,
            html: `
                <p>Name: ${body.name}</p>
                <p>Email: ${body.email}</p>
                <p>Message: ${body.message}</p>
            `
        })
        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(error => console.log(error));
}