import React from 'react';
import {
  AbsoluteFill, Audio, Img, OffthreadVideo, Sequence,
  interpolate, staticFile, useCurrentFrame, useVideoConfig
} from 'remotion';
import type {Scene, VideoProject} from './types';

const isVideo = (path: string) => /\.(mp4|mov|webm)$/i.test(path);
const SceneView: React.FC<{scene: Scene; index: number; count: number; durationFrames: number}> =
({scene, index, count, durationFrames}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const portrait = height > width;
  const appear = interpolate(frame, [0, Math.max(1, Math.min(18, durationFrames / 3))],
    [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(appear, interpolate(frame,
    [Math.max(0, durationFrames - 12), durationFrames],
    [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const accent = scene.accent ?? '#8B5CF6';
  return (
    <AbsoluteFill style={{background: '#0A1125', color: 'white', fontFamily: 'Arial, sans-serif'}}>
      {scene.media && (isVideo(scene.media)
        ? <OffthreadVideo src={staticFile(scene.media)} muted style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.40}} />
        : <Img src={staticFile(scene.media)} style={{width: '100%', height: '100%', objectFit: 'cover', opacity: 0.40}} />)}
      <AbsoluteFill style={{background: 'linear-gradient(140deg, #05081788, #11182FD9)', padding: portrait ? 76 : 100}}>
        <div style={{fontSize: 23, color: accent, fontWeight: 700, letterSpacing: 4}}>PROMPT MOTION STUDIO</div>
        <div style={{marginTop: 'auto', marginBottom: 'auto', opacity, transform: 'translateY(' + ((1 - appear) * 40) + 'px)'}}>
          <div style={{fontSize: portrait ? 79 : 90, lineHeight: 1.12, fontWeight: 900, overflowWrap: 'anywhere'}}>{scene.title}</div>
          <div style={{fontSize: portrait ? 39 : 37, lineHeight: 1.4, marginTop: 38, maxWidth: 1300}}>{scene.body}</div>
        </div>
        <div style={{height: 7, background: '#ffffff25', borderRadius: 8}}>
          <div style={{background: accent, height: '100%', width: (100 * (index + (frame / durationFrames)) / count) + '%'}} />
        </div>
      </AbsoluteFill>
      <AbsoluteFill style={{justifyContent: 'flex-end', alignItems: 'center', padding: portrait ? 70 : 45, pointerEvents: 'none'}}>
        {scene.caption && <div style={{background: '#050710E8', padding: '15px 28px', borderRadius: 16, maxWidth: '90%',
          textAlign: 'center', fontSize: portrait ? 34 : 30, fontWeight: 700, overflowWrap: 'anywhere'}}>{scene.caption}</div>}
      </AbsoluteFill>
      {scene.audio && <Audio src={staticFile(scene.audio)} />}
    </AbsoluteFill>
  );
};
export const StoryVideo: React.FC<{project: VideoProject}> = ({project}) => {
  let start = 0;
  return <AbsoluteFill style={{backgroundColor: '#0A1125'}}>{
    project.scenes.map((scene, index) => {
      const durationFrames = Math.max(1, Math.round(scene.durationSeconds * project.fps));
      const from = start; start += durationFrames;
      return <Sequence key={scene.id} from={from} durationInFrames={durationFrames} name={scene.title}>
        <SceneView scene={scene} index={index} count={project.scenes.length} durationFrames={durationFrames}/>
      </Sequence>;
    })
  }</AbsoluteFill>;
};
