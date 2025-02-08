import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Slider } from "antd";



const Player = ({ setIsShow }) => {
  const { curIdSong, isPlay, songs } = useSelector((state) => state.music);
  const [songInfo, setSongInfor] = useState(null);
  const [crsecond, setCrSecond] = useState(0);
  const [audio, setAudio] = useState(new Audio());
  const [volumes, setVolumes] = useState(0.5);
  const [isShuff, setIsShuff] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0);
  const dispatch = useDispatch();
  const runTimeref = useRef();
  const trackref = useRef();

  const onChangeValue = (value) => {
    setVolumes(value / 100);
    audio.volume = value / 100;
  };

  useEffect(() => {
    // Giả lập thông tin bài hát
    const mockSongInfo = {
      title: "Song Title",
      artistsNames: "Artist Name",
      thumbnail: "path/to/thumbnail.jpg",
      duration: 240, // 4 minutes
    };
    setSongInfor(mockSongInfo);
  }, []);

  useEffect(() => {
    if (isPlay && runTimeref.current) {
      audio.play();
      audio.volume = volumes;
    }
  }, [isPlay]);

  const handlePlayMusic = () => {
    if (isPlay) {
      audio.pause();
      dispatch(actions.play(false));
    } else {
      audio.play();
      dispatch(actions.play(true));
    }
  };

  const handleNextSong = () => {
    // Logic cho bài tiếp theo (giả lập)
  };

  const handlePrevSong = () => {
    // Logic cho bài trước đó (giả lập)
  };

  return (
    <div className="play_control">
      <div className="detail_song">
        <div className="ava_thumb">
          <img src={songInfo?.thumbnail} alt="thumbnail" />
        </div>
        <div className="song_infor">
          <p>{songInfo?.title}</p>
          <span>{songInfo?.artistsNames}</span>
        </div>
        <div className="like_action">
          <span>
            <AiOutlineHeart size={21} />
          </span>
          <span>
            <BiDotsHorizontalRounded size={21} />
          </span>
        </div>
      </div>

      <div className="main_control">
        <div className="control">
          <span
            title="Bật phát ngẫu nhiên"
            onClick={() => setIsShuff((prev) => !prev)}
            className={`${!isShuff ? "isFalse" : "isTrue"}`}
          >
            <PiShuffleLight size={21} />
          </span>
          <span>
            <BiSkipPrevious
              size={27}
              onClick={handlePrevSong}
              className={`${!songs ? "bur_next" : "btn_next"}`}
            />
          </span>
          <span onClick={handlePlayMusic}>
            {isPlay ? <FiPauseCircle size={40} /> : <BsPlayCircle size={40} />}
          </span>
          <span
            onClick={handleNextSong}
            className={`${!songs ? "bur_next" : "btn_next"}`}
          >
            <BiSkipNext size={27} />
          </span>
          <span
            title="Bật phát lại tất cả"
            className={`${!repeatMode ? "isFalse" : "isTrue"}`}
            onClick={() => setRepeatMode((prev) => (prev === 2 ? 0 : prev + 1))}
          >
            {repeatMode === 1 ? (
              <BsRepeat1 size={21} />
            ) : (
              <CiRepeat size={21} />
            )}
          </span>
        </div>
        <div className="progress_bar">
          <span className="time_progress">
            {moment.utc(crsecond * 1000).format("mm:ss")}
          </span>
          <div ref={trackref} className="track">
            <div ref={runTimeref} className="run_time">
              <div className="run_time-dot"></div>
            </div>
          </div>
          <span className="time_progress">
            {moment.utc(songInfo?.duration * 1000).format("mm:ss")}
          </span>
        </div>
      </div>

      <div className="volume">
        <div className="el_hover">
          <RiMovieLine size={27} />
        </div>
        <div className="el_hover">
          <LiaMicrophoneAltSolid size={27} />
        </div>
        <div className="el_hover">
          <BiWindows size={27} style={{ fontWeight: 200 }} />
        </div>
        <div className="volume_zone">
          <BsFillVolumeUpFill size={27} />
          <div>
            <Slider
              defaultValue={50}
              onChange={onChangeValue}
              className="volume_action"
              tooltip={{
                formatter: null,
              }}
            />
          </div>
        </div>
        <div className="btn_playlist">
          <div className="playlist_action" onClick={() => setIsShow((prev) => !prev)}>
            <BiSolidPlaylist size={23} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
