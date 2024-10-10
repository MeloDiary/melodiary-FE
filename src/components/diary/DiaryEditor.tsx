import styled from 'styled-components';
import { useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { formats, modules } from '../../constants/writeDiary';

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
