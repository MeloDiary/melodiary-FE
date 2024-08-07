import styled from 'styled-components';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'font': [] }, { 'size': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'color': [] }, { 'background': [] }],
    [{ 'header': '1' }, { 'header': '2' }, 'blockquote', 'code-block'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    [{ 'align': [] }],
    ['link', 'image']
  ]
};

const formats = [
  'font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'header', 'blockquote', 'code-block', 'list', 'bullet',
  'align', 'link', 'image'
];

const DiaryEditor = () => {
  const [text, setText] = useState('');

  const handleChange = (value: any) => {
    setText(value);
  };

  return (
    <DiaryEditorWrapper>
      <ReactQuill
        value={text} 
        onChange={handleChange} 
        modules={modules} 
        formats={formats} 
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