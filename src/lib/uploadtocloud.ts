// const cloudinary = require("cloudinary").v2;
import { v2 as cloudinary } from "cloudinary";
import { type UploadApiOptions } from "cloudinary";
cloudinary.config({
  api_key: import.meta.env.VITE_API_KEY,
  cloud_name: import.meta.env.VITE_CLOUD_NAME,
  api_secret: import.meta.env.VITE_API_SECRET,
});

const opts: UploadApiOptions = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
  //   folder: "sharer",
};

export const uploadImage = ({ image }: { image: string }) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(image, opts, (error, result) => {
      console.log(result);
      if (result && result.secure_url) {
        // console.log(result.secure_url,"URL");
        return resolve(result.secure_url);
      }
      console.log(error?.message, "");
      return reject({ msg: error?.message as string });
    });
  });
};
