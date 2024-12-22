const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3-credentials");

module.exports = {
  putImageObject: async (file, fileName) => {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${fileName}`,
        Body: file,
        ContentType: "image/png, image/jpeg, image/jpg",
      }

      const command = new PutObjectCommand(params);
      const data = await s3Client.send(command);

      if (data.$metadata.httpStatusCode !== 200) {
        return;
      }

      let url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}amazonaws.com/${params.Key}`;
      return { url, key: params.Key };

    } catch (error) {
      console.log(error)
    }
  },
  deleteImageObject: async (key) => {
    try {
      const params = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: key
      };
      const command = new DeleteObjectCommand(params);
      const data = await s3Client.send(command);
      if (data.$metadata.httpStatusCode !== 204) {
        return { status: 400, data };
      }
      return { status: 204 }
    } catch (error) {
      console.log(error);
    }
  }
}