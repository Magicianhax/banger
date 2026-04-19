import { Composition } from 'remotion';
import { loadFont as loadAnton } from '@remotion/google-fonts/Anton';
import { loadFont as loadInter } from '@remotion/google-fonts/Inter';
import { Video } from './Video';

// Pre-load the brand fonts so every scene has them ready.
loadAnton();
loadInter();

// Total duration = sum of scene durations inside Video.tsx (1800 frames @ 30fps = 60s).
const DURATION = 1800;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BangerPromo"
        component={Video}
        durationInFrames={DURATION}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BangerPromoVertical"
        component={Video}
        durationInFrames={DURATION}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
