import Slider from '@react-native-community/slider';
import React, {useEffect, useMemo, useState} from 'react';
import {Button, Text, View} from 'react-native';
import {VideoInfo} from './PlayerTypes';
import {formatTime} from './TimeUtils';

export type Props = {
  videoInfo?: VideoInfo;
  position: number;
  paused: boolean;
  onPaused: (paused: boolean) => void;
  onChangePosition: (position: number) => void;
  audioTrack?: number;
  onChangeAudioTrack?: (track: number) => void;
  textTrack?: number;
  onChangeTextTrack?: (track: number) => void;
};

const MediaControl: React.FC<Props> = ({
  videoInfo,
  position,
  paused,
  onPaused,
  onChangePosition,
  /*
  audioTrack,
  onChangeAudioTrack,
  textTrack,
  onChangeTextTrack,
  */
}) => {
  const [changingSlider, setChangingSlider] = useState<boolean>(false);
  const [sliderValue, setSliderValue] = useState<number>(0);

  useEffect(() => {
    if (!changingSlider && videoInfo && videoInfo.duration > 0) {
      setSliderValue(position / videoInfo.duration);
    }
  }, [videoInfo, position, changingSlider]);

  const duration = useMemo(
    () => (videoInfo ? videoInfo.duration : 0),
    [videoInfo],
  );
  return (
    <View
      style={{
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Button
        color="#841584"
        title={paused ? 'Start' : 'Stop'}
        onPress={() => onPaused(!paused)}
        disabled={duration === 0}
      />
      <Text>{formatTime(sliderValue * duration)}</Text>
      <Slider
        style={{flex: 1, height: 40}}
        minimumValue={0}
        maximumValue={1}
        value={sliderValue}
        disabled={duration === 0}
        onSlidingStart={() => setChangingSlider(true)}
        onSlidingComplete={value => {
          setChangingSlider(false);
          onChangePosition(value * duration);
        }}
        onValueChange={value => setSliderValue(value)}
      />
      <Text>{formatTime(duration)}</Text>
    </View>
  );
};

export default MediaControl;
