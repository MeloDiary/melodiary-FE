import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&family=Poppins:wght@100;200;300;400;500;600;700;800&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${({ theme }) => theme.fontFamily.en};
  }
  
  body {
    margin: 0;
    padding: 0;
    color: ${({ theme }) => theme.color.black};
    background-color: ${({ theme }) => theme.color.white};
  }

  a {
    text-decoration: none;
  }

  ol, ul, li {
    list-style: none;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 0;
    padding: 0;
    font-weight: 400;
  }
`;