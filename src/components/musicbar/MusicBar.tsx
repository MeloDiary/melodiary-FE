import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { IoIosPause, IoIosPlay } from "react-icons/io";
import { FaVolumeUp, FaVolumeMute } from "react-icons/fa";
import { motion } from "framer-motion";

interface MusicBarProps {
  youtubeUrl: string;
  title: string;
  artist: string;
  isExpanded: boolean;
}

const MusicBar = ({ youtubeUrl, title, artist, isExpanded }: MusicBarProps) => {
  const playerRef = useRef<any>(null);
  const [player, setPlayer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getVideoId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (
        urlObj.hostname === "www.youtube.com" ||
        urlObj.hostname === "youtube.com"
      ) {
        return new URLSearchParams(urlObj.search).get("v");
      } else if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      }
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
    return null;
  };

  const videoId = getVideoId(youtubeUrl);

  useEffect(() => {
    const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    };

    const onYouTubeIframeAPIReady = () => {
      const YT = (window as any).YT;
      const newPlayer = new YT.Player(playerRef.current, {
        videoId: videoId,
        events: {
          onReady: (event: any) => {
            setPlayer(event.target);
            event.target.setVolume(volume);
            setDuration(formatTime(event.target.getDuration()));
          },
          onStateChange: (event: any) => {
            if (event.data === YT.PlayerState.PLAYING) {
              intervalRef.current = setInterval(() => {
                const currentTime = event.target.getCurrentTime();
                const duration = event.target.getDuration();
                setProgress((currentTime / duration) * 100);
                setCurrentTime(formatTime(currentTime));
              }, 1000);
            } else {
              if (intervalRef.current) {
                clearInterval(intervalRef.current);
              }
            }
          },
        },
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          loop: 1,
        },
      });
    };

    const loadYouTubeIframeAPI = () => {
      if (!(window as any).YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        if (firstScriptTag && firstScriptTag.parentNode) {
          firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        }
        (window as any).onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
      } else {
        onYouTubeIframeAPIReady();
      }
    };

    loadYouTubeIframeAPI();

    return () => {
      if (player) {
        player.destroy();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [youtubeUrl, videoId]);

  const handlePlayPause = () => {
    if (player) {
      if (isPlaying) {
        player.pauseVideo();
      } else {
        player.playVideo();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value, 10);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    if (player) {
      player.setVolume(newVolume);
    }
  };

  const toggleMute = () => {
    if (player) {
      setIsMuted((prevIsMuted) => {
        if (prevIsMuted) {
          player.setVolume(volume);
          return false;
        } else {
          player.setVolume(0);
          return true;
        }
      });
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newProgress = parseInt(e.target.value, 10);
    setProgress(newProgress);
    if (player) {
      const duration = player.getDuration();
      player.seekTo((duration * newProgress) / 100);
      if (!isPlaying) {
        player.playVideo();
        setIsPlaying(true);
      }
    }
  };

  return (
    <MusicBarContainer isExpanded={isExpanded}>
      <VideoContainer ref={playerRef} />
      <TrackInfo isExpanded={isExpanded}>
        <TrackText>
          <TrackTitle>{title}</TrackTitle>
          <TrackArtist>{artist}</TrackArtist>
        </TrackText>
        <ProgressContainer>
          <button onClick={handlePlayPause}>
            {isPlaying ? (
              <IoIosPause size={"24px"} />
            ) : (
              <IoIosPlay size={"24px"} />
            )}
          </button>
          <Time>{currentTime}</Time>
          <ProgressBar value={progress} isExpanded={isExpanded}>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={progress}
              onChange={handleProgressChange}
            />
          </ProgressBar>
          <Time>{duration}</Time>
        </ProgressContainer>
        <Controls>
          <VolumeButton onClick={toggleMute}>
            {isMuted || volume === 0 ? (
              <FaVolumeMute size={20} />
            ) : (
              <FaVolumeUp size={20} />
            )}
          </VolumeButton>
          <VolumeControl
            volume={volume}
            isMuted={isMuted}
            isExpanded={isExpanded}
          >
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
            />
          </VolumeControl>
        </Controls>
      </TrackInfo>
    </MusicBarContainer>
  );
};

export default MusicBar;

const MusicBarContainer = styled(motion.div)<{ isExpanded: boolean }>`
  position: fixed;
  bottom: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  width: 100%;
  height: 70px;
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.color.white};
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  transition: left 0.5s ease, width 0.5s ease;
`;

const VideoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 70px;
  margin-right: 20px;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;

const TrackInfo = styled.div<{ isExpanded: boolean }>`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  flex: 1;
  margin-right: ${({ isExpanded }) => (isExpanded ? "10%" : "55%")};
  overflow: hidden;
`;

const TrackText = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const TrackTitle = styled.div`
  font-size: ${({ theme }) => theme.text.text1};
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
`;

const TrackArtist = styled.div`
  font-size: ${({ theme }) => theme.text.text2};
  color: ${({ theme }) => theme.color.black};
`;

const ProgressContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;

  button {
    margin: 4px 2px 0 10px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: ${({ theme }) => theme.color.gray777};

    &:hover {
      color: ${({ theme }) => theme.color.grayblack};
    }
  }
`;

const Time = styled.div`
  width: 50px;
  text-align: center;
  font-size: ${({ theme }) => theme.text.text2};
  color: ${({ theme }) => theme.color.gray999};
`;

interface ProgressBarProps {
  value: number;
}

const ProgressBar = styled.div<ProgressBarProps & { isExpanded: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;

  input[type="range"] {
    width: ${({ isExpanded }) => (isExpanded ? "20vw" : "8vw")};
    height: 5px;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.color.primary} ${({ value }) => value}%,
      ${({ theme }) => theme.color.grayDF} 0%
    );
    border-radius: 5px;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.color.primary};
    border-radius: 50%;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }
`;

const Controls = styled.div`
  display: flex;
  justify-content: end;
  align-items: center;
  gap: 10px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

const VolumeButton = styled.button`
  margin-top: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray777};

  &:hover {
    color: ${({ theme }) => theme.color.grayblack};
  }
`;

const VolumeControl = styled.div<{
  volume: number;
  isMuted: boolean;
  isExpanded: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  input[type="range"] {
    width: ${({ isExpanded }) => (isExpanded ? "6vw" : "4vw")};
    height: 5px;
    background: linear-gradient(
      to right,
      ${({ theme, isMuted, volume }) =>
          isMuted ? theme.color.grayDF : theme.color.gray999}
        ${({ isMuted, volume }) => `${isMuted ? 0 : volume}%`},
      ${({ theme }) => theme.color.grayDF}
        ${({ isMuted, volume }) => `${isMuted ? 0 : volume}%`}
    );
    border-radius: 5px;
    -webkit-appearance: none;
    outline: none;
    cursor: pointer;
  }

  input[type="range"]::-webkit-slider-thumb {
    width: 10px;
    height: 10px;
    background: ${({ theme }) => theme.color.gray777};
    border-radius: 50%;
    -webkit-appearance: none;
    appearance: none;
    cursor: pointer;
  }
`;
