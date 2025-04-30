import { VideoTransformation } from './types';

export const mockHistory: VideoTransformation[] = [
  {
    id: '1',
    sourceVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/elephants.mp4',
    sourceVideoName: 'beach_sunset.mp4',
    transformedVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/elephants.mp4',
    parameters: {
      style: 'cinematic',
      intensity: 0.7,
      resolution: '720p',
      duration: 25,
    },
    status: 'completed',
    createdAt: '2023-10-15T14:23:45Z',
    updatedAt: '2023-10-15T14:28:12Z',
  },
  {
    id: '2',
    sourceVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/sea-turtle.mp4',
    sourceVideoName: 'city_timelapse.mp4',
    transformedVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/sea-turtle.mp4',
    parameters: {
      style: 'anime',
      intensity: 0.9,
      resolution: '1080p',
      duration: 15,
    },
    status: 'completed',
    createdAt: '2023-10-14T09:12:33Z',
    updatedAt: '2023-10-14T09:18:22Z',
  },
  {
    id: '3',
    sourceVideoUrl: 'https://res.cloudinary.com/demo/video/upload/v1624539269/samples/cld-sample-video.mp4',
    sourceVideoName: 'drone_mountain.mp4',
    transformedVideoUrl: null,
    parameters: {
      style: 'sketch',
      intensity: 0.5,
      resolution: '720p',
      duration: 30,
    },
    status: 'failed',
    createdAt: '2023-10-13T18:45:11Z',
    updatedAt: '2023-10-13T18:50:29Z',
  },
];