import React, { useState } from "react";
import styled from "styled-components";

interface HelpStep {
  image: string; 
  text: string; 
}

interface HelpOverlayProps {
  steps: HelpStep[]; 
  onClose: () => void;
}

const HelpOverlay: React.FC<HelpOverlayProps> = ({ steps, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  return (
    <Overlay>
      <CloseButton onClick={onClose}>X</CloseButton>

      <SlideContainer>
        <ArrowButtonLeft onClick={handlePrev}>&lt;</ArrowButtonLeft>
        <SlideContent>
          <SlideImage
            src={steps[currentStep].image}
            alt={`Help step ${currentStep + 1}`}
          />
          <TextContainer>{steps[currentStep].text}</TextContainer>

        </SlideContent>
        <ArrowButtonRight onClick={handleNext}>&gt;</ArrowButtonRight>
      </SlideContainer>
      <PageIndicator>
            {steps.map((_, index) => (
              <Dot key={index} active={index === currentStep} />
            ))}
          </PageIndicator>
    </Overlay>
  );
};

export default HelpOverlay;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const SlideContainer = styled.div`
  position: relative;
  background-color: #feffff;
  padding: 16px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  width: 550px;
  height: 570px;
`;

const SlideContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const SlideImage = styled.img`
  width: 440px;
  height: 410px;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const TextContainer = styled.div`
  font-size: 16px;
  margin-bottom: 20px;
  width: 450px;
  height: 50px;
  color: ${({ theme }) => theme.color.black};
  text-align: center;
`;

const ArrowButtonLeft = styled.button`
  position: absolute;
  left: -50px; 
  background: none;
  border: none;
  font-size: 36px;
  color: #ffffff;
  cursor: pointer;
`;

const ArrowButtonRight = styled.button`
  position: absolute;
  right: -50px; 
  background: none;
  border: none;
  font-size: 36px;
  color: #ffffff;
  cursor: pointer;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
`;

const PageIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

const Dot = styled.div<{ active: boolean }>`
  width: 10px;
  height: 10px;
  background-color: ${({ active }) => (active ? "#333" : "#ddd")};
  border-radius: 50%;
  margin: 0 5px;
`;

