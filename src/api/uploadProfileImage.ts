import { httpClient } from './http';

export const uploadProfileImage = async (images: { file: File; filename: string }[]) => {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('images', image.file); // 이미지 파일 추가
    formData.append('filenames', image.filename); // 이미지 파일명 추가
  });

  try {
    const response = await httpClient.post('/api/aws/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data.image_urls; 
  } catch (error) {
    console.error('Error uploading images', error);
    throw error; 
  }
};

export const saveProfileImage = async ( imageUrl: string) => {
  const userId = localStorage.getItem("user_id");
  try {
    const response = await httpClient.put(`/api/users/${userId}/profile-image`, {
      img_url: imageUrl,
    });

    if (response.status === 200) {
      console.log('Profile image successfully saved.');
    } else {
      console.error('Failed to save profile image:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error saving profile image:', error);
  }

};

export const saveBackgroundImage = async ( imageUrl: string) => {
  const userId = localStorage.getItem("user_id");
  try {
    const response = await httpClient.put(`/api/users/${userId}/background-image`, {
      img_url: imageUrl,
    });

    if (response.status === 200) {
      console.log('background image successfully saved.');
    } else {
      console.error('Failed to save background image:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error saving background image:', error);
  }
};