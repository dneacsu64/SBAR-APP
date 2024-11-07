export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // The result includes the data URL prefix which is what we want for OpenAI
      resolve(result);
    };
    reader.onerror = () => reject(new Error('Failed to read image file'));
  });
}

export function validateImageFile(file: File) {
  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload a JPEG or PNG image.');
  }

  const maxSize = 4 * 1024 * 1024; // 4MB
  if (file.size > maxSize) {
    throw new Error('File size too large. Maximum size is 4MB.');
  }
}