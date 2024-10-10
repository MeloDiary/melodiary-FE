import { theme } from "../styles/theme";

export const colors = [
  { name: 'default', background: theme.diaryColor.default.background },
  { name: 'orange', background: theme.diaryColor.orange.background },
  { name: 'beige', background: theme.diaryColor.beige.background },
  { name: 'yellow', background: theme.diaryColor.yellow.background },
  { name: 'green', background: theme.diaryColor.green.background },
  { name: 'mint', background: theme.diaryColor.mint.background },
  { name: 'blue', background: theme.diaryColor.blue.background },
  { name: 'coolblue', background: theme.diaryColor.coolblue.background },
  { name: 'purple', background: theme.diaryColor.purple.background },
  { name: 'pink', background: theme.diaryColor.pink.background },
  { name: 'gray', background: theme.diaryColor.gray.background },
];

export const moods = ["😍", "😆", "🙂", "😟", "😡"];

export const privacies = ["public", "mate", "private"];

export const modules = {
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

export const formats = [
  'font', 'size', 'bold', 'italic', 'underline', 'strike', 'color', 'background', 'header', 'blockquote', 'code-block', 'list', 'bullet',
  'align', 'link', 'image'
];