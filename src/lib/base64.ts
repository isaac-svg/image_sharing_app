export function convertFileToBase64(file: Blob) {
  if (!file) return;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file); // Read the file as data URL
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}
