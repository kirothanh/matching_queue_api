const { DeleteObjectCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const { s3Client } = require("./s3-credentials");

const deleteImageObject = async (key) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: key,
    };
    const command = new DeleteObjectCommand(params);
    const data = await s3Client.send(command);
    if (data.$metadata.httpStatusCode !== 204) {
      return { status: 400, data };
    }
    return { status: 204 };
  } catch (error) {
    console.error("Error in deleteImageObject:", error);
    throw error;
  }
};

const putImageObject = async (file, fileName, oldKey = null) => {
  try {
    if (oldKey) {
      const deleteResult = await deleteImageObject(oldKey);
      if (deleteResult.status !== 204) {
        console.error("Failed to delete old image:", deleteResult.data);
      }
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${fileName}`,
      Body: file,
      ContentType: "image/png, image/jpeg, image/jpg",
    };

    const command = new PutObjectCommand(params);
    const data = await s3Client.send(command);

    if (data.$metadata.httpStatusCode !== 200) {
      throw new Error("Failed to upload file to S3.");
    }

    const url = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
    return { url, key: params.Key };
  } catch (error) {
    console.error("Error in putImageObject:", error);
    throw error;
  }
};

module.exports = {
  putImageObject,
  deleteImageObject,
};
