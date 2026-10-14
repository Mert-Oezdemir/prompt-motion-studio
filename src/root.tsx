import React from 'react';
import {Composition} from 'remotion';
import projectData from '../project.json';
import {StoryVideo} from './story-video';
import type {VideoProject} from './types';

const project = projectData as VideoProject;
const totalFrames = project.scenes.reduce(
  (sum, scene) => sum + Math.max(1, Math.round(scene.durationSeconds * project.fps)), 0,
);
export const Root: React.FC = () => (
  <>
    <Composition id="InstagramVideo" component={StoryVideo} durationInFrames={totalFrames}
      fps={project.fps} width={1080} height={1920} defaultProps={{project}} />
    <Composition id="YouTubeVideo" component={StoryVideo} durationInFrames={totalFrames}
      fps={project.fps} width={1920} height={1080} defaultProps={{project}} />
  </>
);
