import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Easing,
} from "remotion";

const COLORS = {
  black: "#0a0a0a",
  darkGray: "#1a1a1a",
  gold: "#c9a84c",
  softGold: "#e8c97a",
  white: "#f5f5f0",
  cream: "#faf8f2",
  red: "#8b1a1a",
  blue: "#1a3a5c",
  ash: "#888880",
};

function fadeIn(frame: number, start: number, duration = 30): number {
  return interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Animated Star of David
const StarOfDavid: React.FC<{ size: number; color: string; opacity: number }> = ({
  size,
  color,
  opacity,
}) => {
  const s = size;
  const h = (s * Math.sqrt(3)) / 2;
  const triangle1 = `0,${-s} ${h},${s / 2} ${-h},${s / 2}`;
  const triangle2 = `0,${s} ${h},${-s / 2} ${-h},${-s / 2}`;
  return (
    <svg
      width={s * 2.5}
      height={s * 2.5}
      viewBox={`${-s * 1.2} ${-s * 1.2} ${s * 2.4} ${s * 2.4}`}
      style={{ opacity }}
    >
      <polygon
        points={triangle1}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.06}
      />
      <polygon
        points={triangle2}
        fill="none"
        stroke={color}
        strokeWidth={s * 0.06}
      />
    </svg>
  );
};

// Scene 1: Dark opening — "Never Forget"
const OpeningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOpacity = interpolate(frame, [0, fps * 2], [1, 0.85], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });
  const titleOpacity = fadeIn(frame, fps * 0.5, fps * 1.5);
  const subtitleOpacity = fadeIn(frame, fps * 2, fps);
  const starOpacity = fadeIn(frame, fps * 1, fps * 2);
  const starScale = interpolate(frame, [fps, fps * 3], [0.6, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, #1a1208 0%, #0a0a0a 70%)`,
        opacity: bgOpacity,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ transform: `scale(${starScale})`, opacity: starOpacity }}>
        <StarOfDavid size={60} color={COLORS.gold} opacity={1} />
      </div>
      <div
        style={{
          color: COLORS.white,
          fontSize: 96,
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          letterSpacing: 12,
          textTransform: "uppercase",
          opacity: titleOpacity,
          marginTop: 24,
          textShadow: `0 0 60px ${COLORS.gold}44`,
        }}
      >
        NEVER FORGET
      </div>
      <div
        style={{
          color: COLORS.softGold,
          fontSize: 32,
          fontFamily: "Georgia, serif",
          letterSpacing: 4,
          opacity: subtitleOpacity,
          marginTop: 16,
        }}
      >
        The Holocaust & Jewish Resilience
      </div>
    </AbsoluteFill>
  );
};

// Reusable chapter scene
const ChapterScene: React.FC<{
  title: string;
  subtitle: string;
  body: string[];
  bgColor: string;
  accentColor: string;
  years: string;
}> = ({ title, subtitle, body, bgColor, accentColor, years }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps * 0.3, fps * 0.8);
  const titleY = interpolate(frame, [fps * 0.3, fps * 1.1], [40, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  });
  const subtitleOpacity = fadeIn(frame, fps * 0.8, fps * 0.8);
  const lineWidth = interpolate(frame, [fps * 0.6, fps * 1.5], [0, 600], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: bgColor,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 160px",
      }}
    >
      <div
        style={{
          color: accentColor,
          fontSize: 20,
          fontFamily: "Georgia, serif",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: subtitleOpacity,
          marginBottom: 8,
        }}
      >
        {years}
      </div>
      <div
        style={{
          color: COLORS.white,
          fontSize: 72,
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          lineHeight: 1.1,
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          marginBottom: 16,
        }}
      >
        {title}
      </div>
      <div
        style={{
          height: 3,
          width: lineWidth,
          backgroundColor: accentColor,
          marginBottom: 24,
        }}
      />
      <div
        style={{
          color: COLORS.ash,
          fontSize: 22,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          opacity: subtitleOpacity,
          marginBottom: 32,
        }}
      >
        {subtitle}
      </div>
      {body.map((line, i) => {
        const lineOpacity = fadeIn(frame, fps * (1.2 + i * 0.4), fps * 0.6);
        const lineX = interpolate(
          frame,
          [fps * (1.2 + i * 0.4), fps * (1.8 + i * 0.4)],
          [-30, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              color: COLORS.cream,
              fontSize: 26,
              fontFamily: "Georgia, serif",
              lineHeight: 1.7,
              opacity: lineOpacity,
              transform: `translateX(${lineX}px)`,
              marginBottom: 8,
              paddingLeft: 24,
              borderLeft: `3px solid ${accentColor}44`,
            }}
          >
            {line}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Candle memorial scene
const CandleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = fadeIn(frame, fps * 0.5, fps);
  const candleOpacity = fadeIn(frame, fps * 0.2, fps * 0.8);

  // Flickering candle flame
  const flicker = Math.sin(frame * 0.4) * 0.06 + Math.sin(frame * 1.1) * 0.04;
  const flameScale = 1 + flicker;

  const numberOpacity = fadeIn(frame, fps * 1.5, fps);
  const numberScale = interpolate(frame, [fps * 1.5, fps * 2.5], [0.5, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });

  const quoteOpacity = fadeIn(frame, fps * 2.5, fps);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at 50% 80%, #2a1a08 0%, #0a0808 60%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      {/* Candle */}
      <div style={{ opacity: candleOpacity, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Flame */}
        <div
          style={{
            width: 18,
            height: 50,
            background: "radial-gradient(ellipse at 50% 80%, #fff8e1, #ffcc44, #ff8800, transparent)",
            borderRadius: "50% 50% 30% 30%",
            transform: `scale(${flameScale})`,
            filter: "blur(1px)",
            boxShadow: "0 0 20px 10px #ffaa0044",
            marginBottom: 2,
          }}
        />
        {/* Wick */}
        <div style={{ width: 2, height: 8, backgroundColor: "#333", marginBottom: 0 }} />
        {/* Candle body */}
        <div
          style={{
            width: 28,
            height: 120,
            background: "linear-gradient(to right, #e8e0d0, #f5f0e8, #d8d0c0)",
            borderRadius: "3px 3px 2px 2px",
            boxShadow: "0 0 30px 5px #ffcc4422",
          }}
        />
      </div>

      {/* Number */}
      <div
        style={{
          color: COLORS.gold,
          fontSize: 110,
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          opacity: numberOpacity,
          transform: `scale(${numberScale})`,
          marginTop: 32,
          textShadow: `0 0 40px ${COLORS.gold}66`,
        }}
      >
        6,000,000
      </div>
      <div
        style={{
          color: COLORS.white,
          fontSize: 30,
          fontFamily: "Georgia, serif",
          letterSpacing: 4,
          opacity: titleOpacity,
          marginTop: 8,
        }}
      >
        Jewish lives lost in the Holocaust
      </div>
      <div
        style={{
          color: COLORS.ash,
          fontSize: 22,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          opacity: quoteOpacity,
          marginTop: 28,
          maxWidth: 800,
          textAlign: "center",
          lineHeight: 1.7,
        }}
      >
        "For the dead and the living, we must bear witness."
        <br />
        <span style={{ color: COLORS.gold, fontSize: 18 }}>— Elie Wiesel, Holocaust survivor & Nobel Peace Prize laureate</span>
      </div>
    </AbsoluteFill>
  );
};

// Resilience / hope scene
const ResilienceScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgLight = interpolate(frame, [0, fps * 2], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
  });

  const items = [
    "Israel declared independence in 1948",
    "Jewish communities rebuilt across the world",
    "Yad Vashem preserves the memory of every victim",
    "Holocaust education reaches millions each year",
    "\"Am Yisrael Chai\" — The People of Israel Live",
  ];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, #0d1f3c ${100 - bgLight * 30}%, #1a3a5c)`,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 160px",
      }}
    >
      <div
        style={{
          color: COLORS.gold,
          fontSize: 20,
          fontFamily: "Georgia, serif",
          letterSpacing: 6,
          textTransform: "uppercase",
          opacity: fadeIn(frame, fps * 0.2, fps * 0.6),
          marginBottom: 12,
        }}
      >
        Strength & Remembrance
      </div>
      <div
        style={{
          color: COLORS.white,
          fontSize: 72,
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          opacity: fadeIn(frame, fps * 0.3, fps),
          marginBottom: 32,
          lineHeight: 1.1,
        }}
      >
        Resilience
        <br />
        & Renewal
      </div>
      {items.map((item, i) => {
        const op = fadeIn(frame, fps * (1.0 + i * 0.35), fps * 0.5);
        const x = interpolate(
          frame,
          [fps * (1.0 + i * 0.35), fps * (1.5 + i * 0.35)],
          [-40, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        return (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              opacity: op,
              transform: `translateX(${x}px)`,
              marginBottom: 18,
            }}
          >
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: COLORS.gold,
                flexShrink: 0,
              }}
            />
            <div
              style={{
                color: COLORS.cream,
                fontSize: 26,
                fontFamily: "Georgia, serif",
                lineHeight: 1.5,
              }}
            >
              {item}
            </div>
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// Closing scene
const ClosingScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const op = fadeIn(frame, fps * 0.5, fps * 1.5);
  const starOp = fadeIn(frame, fps * 1, fps * 2);
  const starScale = interpolate(frame, [fps, fps * 3], [0.4, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.bezier(0.34, 1.56, 0.64, 1),
  });
  const quoteOp = fadeIn(frame, fps * 2, fps * 1.5);

  return (
    <AbsoluteFill
      style={{
        background: "radial-gradient(ellipse at center, #111a0d 0%, #080a05 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 0,
      }}
    >
      <div style={{ transform: `scale(${starScale})`, opacity: starOp }}>
        <StarOfDavid size={70} color={COLORS.gold} opacity={1} />
      </div>
      <div
        style={{
          color: COLORS.gold,
          fontSize: 80,
          fontFamily: "Georgia, serif",
          fontWeight: "bold",
          letterSpacing: 8,
          opacity: op,
          marginTop: 24,
          textShadow: `0 0 60px ${COLORS.gold}55`,
        }}
      >
        אם ישראל חי
      </div>
      <div
        style={{
          color: COLORS.softGold,
          fontSize: 32,
          fontFamily: "Georgia, serif",
          letterSpacing: 3,
          opacity: op,
          marginTop: 12,
        }}
      >
        Am Yisrael Chai — The People of Israel Live
      </div>
      <div
        style={{
          color: COLORS.ash,
          fontSize: 20,
          fontFamily: "Georgia, serif",
          fontStyle: "italic",
          opacity: quoteOp,
          marginTop: 48,
          maxWidth: 860,
          textAlign: "center",
          lineHeight: 1.8,
        }}
      >
        "To forget the dead would be akin to killing them a second time."
        <br />
        <span style={{ color: COLORS.gold, fontSize: 17 }}>
          — Elie Wiesel, Night (1956)
        </span>
      </div>
      <div
        style={{
          color: COLORS.ash,
          fontSize: 17,
          fontFamily: "Georgia, serif",
          letterSpacing: 2,
          opacity: quoteOp,
          marginTop: 48,
          textTransform: "uppercase",
        }}
      >
        In memory of the six million
      </div>
    </AbsoluteFill>
  );
};

export const HolocaustVideo: React.FC = () => {
  const { fps } = useVideoConfig();

  // Scene timings (in frames)
  const S = {
    opening: { start: 0, duration: fps * 6 },
    rise: { start: fps * 6, duration: fps * 8 },
    persecution: { start: fps * 14, duration: fps * 8 },
    candle: { start: fps * 22, duration: fps * 8 },
    liberation: { start: fps * 30, duration: fps * 8 },
    resilience: { start: fps * 38, duration: fps * 10 },
    closing: { start: fps * 48, duration: fps * 12 },
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.black }}>
      <Sequence from={S.opening.start} durationInFrames={S.opening.duration}>
        <OpeningScene />
      </Sequence>

      <Sequence from={S.rise.start} durationInFrames={S.rise.duration}>
        <ChapterScene
          years="1933 – 1938"
          title="The Rise of Nazi Germany"
          subtitle="How hatred became policy"
          bgColor="linear-gradient(135deg, #1a0808 0%, #0d0505 100%)"
          accentColor={COLORS.red}
          body={[
            "Hitler rose to power in Germany in January 1933.",
            "The Nuremberg Laws stripped Jews of citizenship rights.",
            "Jewish businesses were boycotted and destroyed.",
            "Kristallnacht — the Night of Broken Glass — November 1938:",
            "  over 7,500 Jewish businesses and 1,400 synagogues burned.",
          ]}
        />
      </Sequence>

      <Sequence from={S.persecution.start} durationInFrames={S.persecution.duration}>
        <ChapterScene
          years="1939 – 1945"
          title="The Holocaust"
          subtitle="The systematic murder of six million Jewish people"
          bgColor="linear-gradient(135deg, #0d0d0d 0%, #1a1008 100%)"
          accentColor={COLORS.ash}
          body={[
            "Jews across occupied Europe were forced into ghettos.",
            "The Wannsee Conference (1942) formalized the 'Final Solution'.",
            "Six extermination camps operated in occupied Poland.",
            "Auschwitz-Birkenau alone claimed over 1.1 million lives.",
            "Two thirds of European Jewry — one third of all Jews — perished.",
          ]}
        />
      </Sequence>

      <Sequence from={S.candle.start} durationInFrames={S.candle.duration}>
        <CandleScene />
      </Sequence>

      <Sequence from={S.liberation.start} durationInFrames={S.liberation.duration}>
        <ChapterScene
          years="1945"
          title="Liberation"
          subtitle="Allied forces expose the truth to the world"
          bgColor="linear-gradient(135deg, #0a1a0a 0%, #050d05 100%)"
          accentColor="#4a8c4a"
          body={[
            "Auschwitz liberated by Soviet forces — January 27, 1945.",
            "Allied soldiers documented the atrocities as evidence.",
            "Nuremberg Trials held Nazi leaders accountable.",
            "January 27 is now International Holocaust Remembrance Day.",
            "Survivors bore witness so the world could never deny.",
          ]}
        />
      </Sequence>

      <Sequence from={S.resilience.start} durationInFrames={S.resilience.duration}>
        <ResilienceScene />
      </Sequence>

      <Sequence from={S.closing.start} durationInFrames={S.closing.duration}>
        <ClosingScene />
      </Sequence>
    </AbsoluteFill>
  );
};
