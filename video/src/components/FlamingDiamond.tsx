import { Img, staticFile } from 'remotion';

/**
 * The brand logo — we ship the user-supplied PNG in `public/logo.png`.
 * Rendered as an Img with a drop-shadow-like black outline via CSS filter.
 */
export const FlamingDiamond = ({
  size = 260,
  shake = 0,
}: {
  size?: number;
  shake?: number;
}) => {
  return (
    <div
      style={{
        display: 'inline-block',
        transform: `rotate(${shake}deg)`,
        filter: 'drop-shadow(6px 6px 0 #000)',
      }}
    >
      <Img
        src={staticFile('logo.png')}
        alt="Banger flaming diamond"
        style={{
          width: size,
          height: size,
          objectFit: 'contain',
        }}
      />
    </div>
  );
};
