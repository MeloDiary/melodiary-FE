import styled from 'styled-components';
import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, modules } from '../../constants/writeDiary';
import { fetchUploadDiaryImage } from '../../api/diary.api';
import { useDiaries } from '../../hooks/useDiary';

interface DiaryEditorProps {
  content: string;
  onChange: (value: string) => void;
}

const DiaryEditor = ({ content, onChange }: DiaryEditorProps) => {
  const quillRef = useRef<ReactQuill | null>(null);

  return (
    <DiaryEditorWrapper>
      <ReactQuill
        ref={quillRef}
        value={content} 
        onChange={onChange}
        formats={formats}
        modules={modules}
      />
    </DiaryEditorWrapper>
  );
};

export default DiaryEditor;

const DiaryEditorWrapper = styled.div`
  width: 100%;

  .ql-container {
    width: 100%;
    height: 600px;
  }
`;


// import styled from 'styled-components';
// import { useRef, useState } from 'react';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
// import { formats, modules as defaultModules } from '../../constants/writeDiary';
// import { fetchUploadDiaryImage } from '../../api/diary.api';
// import { v4 as uuidv4 } from 'uuid';

// interface DiaryEditorProps {
//   content: string;
//   onChange: (value: string) => void;
//   userId: number;
// }

// const DiaryEditor = ({ content, onChange, userId }: DiaryEditorProps) => {
//   const quillRef = useRef<ReactQuill | null>(null);
//   const fileInputRef = useRef<HTMLInputElement>(null);
//   const [imageOrder, setImageOrder] = useState(0); // 이미지 순서를 관리하는 state

//   const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       try {
//         // 임시 파일명 생성
//         const tempFilename = `${userId}/diary/temp_${uuidv4()}_${imageOrder}.png`;

//         // 이미지 업로드 로직 (서버 API로 전송 후 URL을 받음)
//         const imageDetails = [{ file, filename: tempFilename }];
//         const [imageUrl] = await fetchUploadDiaryImage(imageDetails);

//         // Quill에 이미지 삽입
//         const quill = quillRef.current?.getEditor();
//         const range = quill?.getSelection();
//         if (range && quill) {
//           quill.insertEmbed(range.index, 'image', imageUrl);
//           // range.index가 undefined일 경우를 처리하기 위해 기본값을 설정
//           const newIndex = range.index !== undefined ? range.index + 1 : quill.getLength();
//           // quill.setSelection(newIndex);
//         }

//         // 이미지 순서 증가
//         setImageOrder(prevOrder => prevOrder + 1);

//       } catch (error) {
//         console.error('Error uploading image:', error);
//       }
//     }
//   };

//   const imageHandler = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.click();
//     }
//   };

//   const modules = {
//     ...defaultModules,
//     toolbar: {
//       ...defaultModules.toolbar,
//       handlers: {
//         image: imageHandler,
//       },
//     },
//   };

//   return (
//     <DiaryEditorWrapper>
//       <ReactQuill
//         ref={quillRef}
//         value={content}
//         onChange={onChange}
//         formats={formats}
//         modules={modules}
//       />
//       <input
//         ref={fileInputRef}
//         type="file"
//         style={{ display: 'none' }}
//         accept="image/*"
//         onChange={handleImageUpload}
//       />
//     </DiaryEditorWrapper>
//   );
// };

// export default DiaryEditor;

// const DiaryEditorWrapper = styled.div`
//   width: 100%;

//   .ql-container {
//     width: 100%;
//     height: 600px;
//   }
// `;
