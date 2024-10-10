import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const Modal: React.FC<ModalProps> = ({ message, onConfirm, onCancel }) => {
  const formattedMessage = message.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

  return (
    <ModalWrapper>
      <ModalContent>
        <Message>{formattedMessage}</Message>
        <ButtonWrapper>
          <ConfirmButton onClick={onConfirm}>확인</ConfirmButton>
          <CancelButton onClick={onCancel}>취소</CancelButton>
        </ButtonWrapper>
      </ModalContent>
    </ModalWrapper>
  );
};

export default Modal;

const ModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
`;

const ModalContent = styled.div`
  background: ${({ theme }) => theme.color.white};
  padding: 40px;
  border-radius: 10px;
  text-align: center;
`;

const Message = styled.div`
  font-family: ${({ theme }) => theme.fontFamily.kor};
  margin-bottom: 20px;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CancelButton = styled.button`
  background: ${({ theme }) => theme.color.gray777};;
  color: ${({ theme }) => theme.color.white};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ConfirmButton = styled.button`
  background: ${({ theme }) => theme.color.primary};
  color: ${({ theme }) => theme.color.white};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
