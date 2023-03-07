/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useMemo, useState} from 'react';
import {VideoInfo} from './PlayerTypes';
import {Platform, SafeAreaView, StatusBar, View} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {VLCPlayer} from 'react-native-vlc-media-player';
import MediaControl from './MediaControl';

const sources = [
  {
    name: 'Manifest',
    uri: 'https://media.axprod.net/TestVectors/v7-Clear/Manifest_1080p.mpd',
  },
  {
    name: 'big bunny',
    uri: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  },
  {
    name: 'anime with audio tracks and subtitles',
    uri: 'http://samples.mplayerhq.hu/Matroska/multiple_tracks.mkv',
  },
  {
    name: 'congress speech with audio tracks',
    uri: 'http://cdn.media.ccc.de/congress/2019/h264-hd/36c3-10505-eng-deu-fra-The_Great_Escape_of_ESXi_hd.mp4',
  },
];

function App(): JSX.Element {
  // console.log('Start app');

  const [uri, setUri] = useState<string>(sources[0].uri);

  const [paused, setPaused] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [seekPosition, setSeekPosition] = useState<number>(0);

  const [videoInfo, setVideoInfo] = useState<VideoInfo | undefined>(undefined);
  const [audioTrack, setAudioTrack] = useState<number | undefined>(undefined);
  const [textTrack, setTextTrack] = useState<number | undefined>(undefined);

  const changeUri = (_: any, index: number) => {
    setPaused(true);
    setCurrentTime(0);
    setSeekPosition(0);
    setVideoInfo(undefined);
    setAudioTrack(undefined);
    setTextTrack(undefined);
    setUri(sources[index].uri);
  };

  const duration = useMemo(
    () => (videoInfo ? videoInfo.duration : 0),
    [videoInfo],
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar barStyle={'dark-content'} />

      <SelectDropdown
        buttonStyle={{width: '100%', height: 40}}
        data={sources.map(source => source.name)}
        defaultValueByIndex={0}
        onSelect={changeUri}
        buttonTextAfterSelection={(_, index) => sources[index].name}
        onChangeSearchInputText={() => {}}
      />

      <View
        style={{
          flex: 1,
          marginVertical: 40,
          marginHorizontal: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'dark',
        }}>
        <VLCPlayer
          style={{width: '100%', height: '100%'}}
          source={{
            uri: uri,
          }}
          seek={
            Platform.OS === 'ios'
              ? seekPosition
              : (seekPosition * duration) / 1000
          }
          paused={paused}
          autoAspectRatio={true}
          audioTrack={audioTrack}
          textTrack={textTrack}
          onPlaying={(playInfo: any) => {
            console.log('onPlaying:', playInfo);
          }}
          onProgress={(progressInfo: any) => {
            setCurrentTime(Math.floor(progressInfo.currentTime / 1000) * 1000);
          }}
          onBuffering={(e: any) => console.log('onBuffering:', e)}
          onPaused={(e: any) => console.log('onPaused:', e)}
          onStopped={(e: any) => console.log('onStopped:', e)}
          onLoad={(info: VideoInfo) => {
            console.log('onLoad', info);
            setVideoInfo(info);
          }}
        />
        <MediaControl
          videoInfo={videoInfo}
          position={currentTime}
          paused={paused}
          onPaused={p => setPaused(p)}
          onChangePosition={position => {
            if (videoInfo) {
              setSeekPosition(position / duration);
              setCurrentTime(position);
            }
          }}
          // audioTrack={audioTrack}
          // onChangeAudioTrack={track => setAudioTrack(track)}
          // textTrack={textTrack}
          // onChangeTextTrack={track => setTextTrack(track)}
        />

        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          {videoInfo?.audioTracks && videoInfo.audioTracks.length > 1 && (
            <SelectDropdown
              defaultButtonText="select audio track"
              data={videoInfo.audioTracks.map(track => track.name)}
              onSelect={(_, index) =>
                setAudioTrack(videoInfo.audioTracks![index].id)
              }
              buttonTextAfterSelection={(_, index) =>
                videoInfo.audioTracks![index].name
              }
              onChangeSearchInputText={() => {}}
            />
          )}
          {videoInfo?.textTracks && videoInfo.textTracks.length > 1 && (
            <SelectDropdown
              defaultButtonText="select subtitles"
              data={videoInfo.textTracks.map(track => track.name)}
              onSelect={(_, index) =>
                setTextTrack(videoInfo.textTracks![index].id)
              }
              buttonTextAfterSelection={(_, index) =>
                videoInfo.textTracks![index].name
              }
              onChangeSearchInputText={() => {}}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

export default App;
