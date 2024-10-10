import React from "react";
import styled from "styled-components";
import { ButtonSchema, ButtonSize } from "../../styles/theme";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  size: ButtonSize;
  schema: ButtonSchema;
}

const Button = ({ children, size, schema, ...props }: Props) => {
  return (
    <ButtonWrapper size={size} schema={schema} {...props}>
      {children}
    </ButtonWrapper>
  );
};

export default Button;

const ButtonWrapper = styled.button<Omit<Props, "children">>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme, size }) => theme.button[size].padding};
  border: ${({ theme, schema }) =>
    schema === "white" ? `1px solid ${theme.color.primary}` : "none"};
  border-radius: ${({ theme, size }) => theme.button[size].borderRadius};
  background-color: ${({ theme, schema }) =>
    theme.buttonSchema[schema].backgroundColor};
  font-size: ${({ theme, size }) => theme.button[size].fontSize};
  font-weight: ${({ theme, size }) => theme.button[size].fontWeight};
  color: ${({ theme, schema }) => theme.buttonSchema[schema].color};
  cursor: pointer;
  transition: all linear 0.15s;

  &:hover {
    background-color: ${({ theme, schema }) =>
      schema === "primary"
        ? "#0055AC"
        : theme.buttonSchema[schema].backgroundColor};
    transition: all linear 0.15s;
  }

  svg {
    margin-right: 8px;
  }
`;
