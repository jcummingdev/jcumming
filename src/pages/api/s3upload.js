import { S3} from "aws-sdk";

const s3 = new S3({
  region: 'us-east-2',
  accessKeyId: process.env.S3_UPLOAD_KEY,
  secretAccessKey: process.env.S3_UPLOAD_SECRET,
  signatuerVersion: 'v4',
});

export const config ={
  api: {
    bodyParser: {
      sizeLimit: '8mb',
    }
  }
}

export default async function s3Upload(req, res){
  if (req.method != 'POST'){
    return res.status(405).json({message: 'method not allowed'})
  }

  try {
    let { name, type } = req.body;

    const fileParams = {
      Bucket: process.env.S3_UPLOAD_BUCKET,
      Key: name,
      Expires: 600,
      ContentType: type,
      ACL: "public-read"
    };

    const url = await s3.getSignedUrlPromise("putObject", fileParams);

    res.status(200).json({ url })
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err})
  }
}