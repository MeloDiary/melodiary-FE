import { httpClient } from "./http";
import { IDiary, IWeather } from "../models/diary.model";

export const fetchWriteDiary = async (data: IDiary["body"]) => {
  try {
    const response = await httpClient.post<IDiary["body"]>("/api/diaries", data);
    return response.data;
  } catch (err) {
    console.log("일기 저장에 실패했습니다.", err);
  }
};

export const fetchWeather = async () => {
  try {
    const response = await httpClient.get<IWeather>("/api/weather");
    console.log(response.data);
    return response.data;
  } catch (err) {
    console.log("날씨를 가져오는 데에 실패했습니다.");
  }
};

export const fetchDiaryById = async (diaryId: number): Promise<IDiary> => {
  const response = await httpClient.get<IDiary>(`/api/diaries/${diaryId}`);
  return response.data;
};

export const fetchPutDiary = async (diaryId: number, data: IDiary["body"]): Promise<IDiary> => {
  try {
    const response = await httpClient.put<IDiary>(`/api/diaries/${diaryId}`, data);
    return response.data;
  } catch (err) {
    console.error("Failed to update diary", err);
    throw err;
  }
};

export const fetchDeleteDiary = async (diaryId: number) => {
  try {
    const response = await httpClient.delete(`/api/diaries/${diaryId}`);
    return response.data;
  } catch (err) {
    console.log("일기 삭제에 실패했습니다.", err);
    throw err;
  }
};

// 이미지 파일 추가
export const fetchUploadDiaryImage = async (images: { file: File; filename: string }[]) => {
  const formData = new FormData();
  images.forEach(image => {
    formData.append('files', image.file); // 이미지 파일 추가
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
    throw error; // 오류 발생 시 호출한 쪽에서 처리할 수 있도록 예외를 던집니다.
  }
};