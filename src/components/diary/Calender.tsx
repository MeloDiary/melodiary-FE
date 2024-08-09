import React, { useState } from 'react';
import styled from 'styled-components';
import emojiX from '../../assets/icons/rectangle1.png';
import future from '../../assets/icons/rectangle2.png';
import { IoIosArrowForward, IoIosArrowBack } from "react-icons/io";

interface Emojis {
  [key: number]: string | JSX.Element;
}

const Calendar = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();
  const [year, setYear] = useState<number>(currentYear);
  const [month, setMonth] = useState<number>(currentMonth);
  const [showSelector, setShowSelector] = useState<boolean>(false);

  const emojis: Emojis = {
    1: '🐵',
    2: '🐒',
    3: '🐵',
    4: '😎',
    5: '🔥',
    6: '🐟',
    9: '',
    10: '',
    12: '',
    13: '🌸',
    14: '🍀',
    15: '',
    16: '💙',
    17: '💎',
    19: '',
    30: '',
  };

  const handleYearChange = (direction: number) => {
    setYear((prevYear) => prevYear + direction);
  };

  const handleMonthClick = (index: number) => {
    setMonth(index);
    setShowSelector(false);
  };

  const handleMonthChange = (direction: number) => {
    setMonth((prevMonth) => {
      const newMonth = prevMonth + direction;
      if (newMonth < 0) {
        setYear((prevYear) => prevYear - 1);
        return 11;
      }
      if (newMonth > 11) {
        setYear((prevYear) => prevYear + 1);
        return 0;
      }
      return newMonth;
    });
  };


  const renderCalendar = () => {
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const weeks: JSX.Element[] = [];
    let days: JSX.Element[] = [];

    for (let i = 0; i < startDay; i++) {
      days.push(<td key={`empty-start-${i}`}></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      let emoji = emojis[day];
      if (year > currentYear || (year === currentYear && month > currentMonth) || (year === currentYear && month === currentMonth && day > currentDate)) {
        emoji = <EmojiX src={future} alt="Future" />; // 미래 날짜에 추가할 특정 이모지
      }
      days.push(
        <td key={day}>
          <DayContainer>
            <div>{day}</div>
            <DayEmoji>
              {emoji ? emoji : emoji === '' ? <EmojiX src={emojiX} alt="emojiX" /> : null}
            </DayEmoji>
          </DayContainer>
        </td>
      );
      if ((day + startDay) % 7 === 0 || day === daysInMonth) {
        weeks.push(<tr key={day}>{days}</tr>);
        days = [];
      }
    }
    return weeks;
  };

  return (
    <CalendarContainer>
      <Table>
        <thead>
          <tr>
            <td colSpan={7}>
              <ControlsWrapper>
                <Control>
                  <Dropdown onClick={() => setShowSelector(!showSelector)}>
                    <span>{year}년 {month + 1}월</span>
                    <Arrow>▼</Arrow>
                  </Dropdown>
                  <IconWrapper>
                    <ArrowIcon as={IoIosArrowBack} onClick={() => handleMonthChange(-1)} />
                    <ArrowIcon as={IoIosArrowForward} onClick={() => handleMonthChange(1)} />
                  </IconWrapper>
                  {showSelector && (
                    <MonthYearSelector>
                      <SelectorHeader>
                        <button onClick={() => handleYearChange(-1)}>◀</button>
                        <span>{year}</span>
                        <button onClick={() => handleYearChange(1)}>▶</button>
                      </SelectorHeader>
                      <MonthGrid>
                        {['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'].map((m, index) => (
                          <MonthButton
                            key={index}
                            className={index === month ? 'active' : ''}
                            onClick={() => handleMonthClick(index)}
                          >
                            {m}
                          </MonthButton>
                        ))}
                      </MonthGrid>
                    </MonthYearSelector>
                  )}
                </Control>
              </ControlsWrapper>
            </td>
          </tr>
          <tr className="day">
            <th>S</th>
            <th>M</th>
            <th>T</th>
            <th>W</th>
            <th>T</th>
            <th>F</th>
            <th>S</th>
          </tr>
        </thead>
        <tbody>{renderCalendar()}</tbody>
      </Table>
    </CalendarContainer>
  );
};

export default Calendar;

const CalendarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  font-family: ${({ theme }) => theme.fontFamily.kor};
`;

const ControlsWrapper = styled.div`
  position: relative; 
  padding: 4px 14px 9px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.color.grayDF};
  text-align: left;
`;

const Control = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 0px 0;
  text-align: left;
`;

const Dropdown = styled.div`
  display: flex;
  align-items: center;
  font-size: ${({ theme }) => theme.text.text3};
  cursor: pointer;
  span {
    padding: 5px 5px;
    padding-right: 0px;
  }
`;

const Arrow = styled.span`
  padding: 0px;
`;

const IconWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 10px;
`;

const ArrowIcon = styled.div`
  width: 17px;
  height: 17px;
  color: ${({ theme }) => theme.color.grayblack};
  cursor: pointer;
`;

const MonthYearSelector = styled.div`
  position: absolute;
  top: 100%; 
  left: 0;
  z-index: 10;
  margin-top: 5px; 
  padding: 10px;
  background: ${({ theme }) => theme.color.white};;
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
`;

const SelectorHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
  }
`;

const MonthGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
`;

const MonthButton = styled.button`
  padding: 10px;
  border: none;
  background-color: #f2f2f2;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  &:hover {
    background-color: ${({ theme }) => theme.color.grayDF};
  }
  &.active {
    background-color: ${({ theme }) => theme.color.lightblue};
  }
`;

const Table = styled.table`
  width: 100%;
  max-width: 700px;
  padding-bottom: 20px;
  overflow: hidden;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.grayDF};
  th, td {
    padding-top: 5px;
    border: none;
    text-align: center;
  }
  th {
    padding: 10px 0 15px;
    background-color: transparent;
    font-weight: 400;
  }
`;

const DayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 60px; 
`;

const DayEmoji = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 21.5px;
  padding-top: 10px;
`;

const EmojiX = styled.img`
  width: 22px;
  height: 22px;
`;