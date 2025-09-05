import axios from "axios";

/**
 * imageUrl is your blob: URL from URL.createObjectURL(file)
 * We read it in the browser, wrap it as a File, and POST to the backend.
 */
export const generateFromHuggingFaceModel = async (imageUrl, prompt) => {
  // read the blob: URL in the browser
  const resp = await fetch(imageUrl);
  if (!resp.ok) throw new Error("Failed to read image from blob URL");

  const blob = await resp.blob();
  const file = new File([blob], "input.png", {
    type: blob.type || "image/png",
  });

  const form = new FormData();
  form.append("image", file);
  form.append("prompt", prompt);

  const { data } = await axios.post(
    "http://localhost:5000/api/room-visualize",
    form,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return data?.image;
};
