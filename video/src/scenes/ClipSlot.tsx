import {
  AbsoluteFill,
  OffthreadVideo,
  staticFile,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import { useEffect, useState } from 'react';
import { Backdrop } from '../components/Backdrop';
import { ChunkyText } from '../components/ChunkyText';
import { Sticker } from '../components/Sticker';
import { colors } from '../colors';

type ClipSlotProps = {
  clipFile: string;        // e.g. 'clips/demo-1.mp4'
  caption: string;         // overlay text
  captionColor?: string;
  clipStartFrame?: number; // offset into the source clip
};

/**
 * Shows a real user-supplied demo clip framed in a chunky sticker card.
 * Falls back to an obvious "DROP CLIP HERE" placeholder if the file is missing.
 *
 * Drop your actual recordings at:
 *   video/public/clips/demo-1.mp4
 *   video/public/clips/demo-2.mp4
 *   video/public/clips/demo-3.mp4
 */
export const ClipSlot = ({
  clipFile,
  caption,
  captionColor = colors.amber,
  clipStartFrame = 0,
}: ClipSlotProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const [clipExists, setClipExists] = useState(true);

  useEffect(() => {
    fetch(staticFile(clipFile), { method: 'HEAD' })
      .then((r) => setClipExists(r.ok))
      .catch(() => setClipExists(false));
  }, [clipFile]);

  const cardScale = interpolate(frame, [0, 18], [0.85, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [10, 30], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionOpacity = interpolate(frame, [10, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <Backdrop />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
          gap: 40,
        }}
      >
        <div
          style={{
            transform: `scale(${cardScale})`,
            background: colors.panel,
            border: `5px solid ${colors.border}`,
            borderRadius: 20,
            boxShadow: `12px 12px 0 ${colors.border}`,
            overflow: 'hidden',
            width: 1400,
            height: 790,
            position: 'relative',
          }}
        >
          {clipExists ? (
            <OffthreadVideo
              src={staticFile(clipFile)}
              startFrom={clipStartFrame}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              volume={0}
            />
          ) : (
            <ClipPlaceholder file={clipFile} />
          )}
        </div>

        <div
          style={{
            opacity: captionOpacity,
            transform: `translateY(${captionY}px) rotate(-2deg)`,
          }}
        >
          <Sticker background={captionColor} padding="18px 36px">
            <span style={{ fontSize: 48, letterSpacing: 2 }}>{caption}</span>
          </Sticker>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const ClipPlaceholder = ({ file }: { file: string }) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: `repeating-linear-gradient(45deg, ${colors.panel2}, ${colors.panel2} 40px, ${colors.panel} 40px, ${colors.panel} 80px)`,
        color: colors.fg,
      }}
    >
      <ChunkyText size={84} color={colors.amber}>
        DROP CLIP HERE
      </ChunkyText>
      <div
        style={{
          fontFamily: 'monospace',
          fontSize: 28,
          color: colors.muted,
          background: 'rgba(0,0,0,0.55)',
          padding: '10px 20px',
          borderRadius: 10,
          border: `2px solid ${colors.border}`,
        }}
      >
        public/{file}
      </div>
    </div>
  );
};
