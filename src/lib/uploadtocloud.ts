// const cloudinary = require("cloudinary").v2;
import { v2 as cloudinary } from "cloudinary";
import { type UploadApiOptions } from "cloudinary";

const opts: UploadApiOptions = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const uploadResource = ({ image }: { image: string }) => {
  //imgage = > base64
  return new Promise((resolve, reject) => {
    // cloudinary.uploader.upload(image, opts, (error, result) => {
    //   console.log(result);
    //   if (result && result.secure_url) {
    //     // console.log(result.secure_url,"URL");
    //     return resolve(result.secure_url);
    //   }
    //   console.log(error?.message, "");
    //   return reject({ msg: error?.message as string });
    // });
  });
};

export async function uploadImage(file: Blob) {
  try {
    const url = `https://api.cloudinary.com/v1_1/${"da8bmubdv"}/upload`;
    const fd = new FormData();
    fd.append("upload_preset", "imagesharer");
    fd.append("tags", "browser_upload");
    fd.append("file", file);

    const response = await fetch(url, {
      method: "POST",
      body: fd,
    });
    const data = await response.json();

    return data.secure_url;
  } catch (error) {
    return;
  }
}
