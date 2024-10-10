import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApexOptions } from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useMyPage } from '../../hooks/useMyPage'; 
import { moods } from '../../constants/writeDiary';

dayjs.locale('ko');

const MoodGraph = () => {
  const { mood, fetchMoodGraphData } = useMyPage();
  
  const years = new Date().getFullYear();
  const yearsArray = [years-2, years-1, years];

  const [year, setYear] = useState<number>(dayjs().year());
  const [month, setMonth] = useState<number>(dayjs().month() + 1);
  const [week, setWeek] = useState<number>(1);
  const [datesArray, setDatesArray] = useState<string[]>([]);

  useEffect(() => {
    fetchMoodGraphData(year, month);
  }, [year, month]);

  useEffect(() => {
    // 주차 계산
    const startOfMonth = dayjs(`${year}-${month}-01`);
    const startOfWeek = startOfMonth.startOf('month').subtract(1, 'day').day(0);
    const startDate = startOfWeek.add((week - 1) * 7, 'day');
    const endDate = startDate.add(6, 'day');
    
    const dates = [];
    for (let date = startDate; date.isBefore(endDate, 'day'); date = date.add(1, 'day')) {
      dates.push(date.format('YYYY-MM-DD'));
    }
    // 마지막 날짜 포함
    dates.push(endDate.format('YYYY-MM-DD'));
    setDatesArray(dates);
  }, [year, month, week]);

  // 일기를 쓴 날짜에 점을 찍는 데이터 생성
  const seriesData = datesArray.map((date) => {
    const moodEntry = mood?.moods.find(m => dayjs.tz(m.date).format('YYYY-MM-DD') === date);
    return moodEntry ? moods.length - moods.indexOf(moodEntry.mood) : 0; 
  });

  // 주차 선택 함수
  const getWeekOptions = () => {
    const startOfMonth = dayjs(`${year}-${month}-01`);
    const endOfMonth = startOfMonth.endOf('month');
    const weeks = [];
    
    let startOfWeek = startOfMonth.startOf('month').subtract(1, 'day').day(0);
    while (startOfWeek.isBefore(endOfMonth)) {
      weeks.push(startOfWeek.format('YYYY-MM-DD'));
      startOfWeek = startOfWeek.add(7, 'day');
    }
    
    return weeks;
  };

  useEffect(() => {
    // 현재 날짜를 기준으로 주차를 초기화
    const today = dayjs();
    const startOfMonth = dayjs(`${today.year()}-${today.month() + 1}-01`);
    const startOfWeek = startOfMonth.startOf('month').subtract(1, 'day').day(0);
    
    const currentWeekStart = startOfWeek;
    const weekNumber = Math.floor(today.diff(currentWeekStart, 'day') / 7) + 1;
    
    setYear(today.year());
    setMonth(today.month() + 1);
    setWeek(weekNumber);
  }, []);

  const options: ApexOptions = {
    chart: {
      id: 'mood-graph',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    xaxis: {
      categories: datesArray.map(date => dayjs(date).format('M.D (ddd)')),
    },
    yaxis: {
      min: 0,
      max: 5,
      tickAmount: 5,
      labels: {
        formatter: (value: number) => {
          return value === 0 ? '' : moods[moods.length - value];
        },
        style: {
          fontSize: '22px',
          fontFamily: 'Arial, sans-serif', 
        },
      },
    },
    stroke: {
      width: 2,
    },
    markers: {
      size: 5,
    },
  };

  const series = [{
    name: '기분',
    data: seriesData,
  }];

  return (
    <MoodGraphWrapper>
      <SelectorWrapper>
        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
          {yearsArray.map(yearOption => (
            <option key={yearOption} value={yearOption}>{yearOption}년</option>
          ))}
        </select>
        <select value={month} onChange={(e) => setMonth(Number(e.target.value))}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map(monthOption => (
            <option key={monthOption} value={monthOption}>{monthOption}월</option>
          ))}
        </select>
        <select value={week} onChange={(e) => setWeek(Number(e.target.value))}>
          {getWeekOptions().map((weekStart, index) => (
            <option key={weekStart} value={index + 1}>{index + 1}주차</option>
          ))}
        </select>
      </SelectorWrapper>
      <MoodGraphContent>
        <ReactApexChart 
          options={options} 
          series={series} 
          type="line" 
          height="100%" 
        />
      </MoodGraphContent>
    </MoodGraphWrapper>
  );
};

export default MoodGraph;

const MoodGraphWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 805px;
  /* height: 100%; */
  height: 433px;
  padding: 20px 40px;
  border: 1px solid ${({ theme }) => theme.color.gray999};
  border-radius: 12px;
`;

const SelectorWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;

  select {
    margin-left: 10px;
    padding: 8px 10px;
    border: none;
    outline: none;
    font-family: ${({ theme }) => theme.fontFamily.kor};
    font-size: ${({ theme }) => theme.text.text2};
  }
`;

const MoodGraphContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
