export function VibeSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="banger-slider-row">
      <span aria-hidden="true" style={{ fontSize: 14 }}>😌</span>
      <span>mild</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.currentTarget.value))}
        aria-label="Vibe intensity"
      />
      <span>savage</span>
      <span aria-hidden="true" style={{ fontSize: 14 }}>🔥</span>
    </div>
  );
}
