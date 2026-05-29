#!/usr/bin/env python3
"""Generate per-scene narration with Piper, auto-fit to each scene's length,
then post-process for a deep, ominous tone.

Processing:
  - Piper neural TTS (deep male voice 'ryan'), length_scale auto-fit per scene.
  - numpy: high-pass rumble cut, subtle reverb (early reflections), soft compress.
  - ffmpeg (stripped build: only asetrate/atempo/aresample/adelay/loudnorm/volume):
    pitch down ~6% keeping duration, lead-in silence, loudness normalize, mp3.

No network at runtime beyond the already-downloaded voice in .voices/.
Outputs public/voiceover/scene-1..5.mp3
"""
import subprocess
import wave
import os
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PIPER = os.path.join(ROOT, ".venv", "bin", "piper")
MODEL = os.path.join(ROOT, ".voices", "en-us-ryan-high.onnx")
FFMPEG = os.path.join(ROOT, "node_modules", ".bin", "remotion")
OUTDIR = os.path.join(ROOT, "public", "voiceover")
os.makedirs(OUTDIR, exist_ok=True)

FPS = 30
SR = 22050  # piper output rate

# (name, frames available, narration text, lead-in seconds)
SCENES = [
    ("scene-1", 300, "Right now, an algorithm is deciding whether you get a job. "
                     "A loan. Or a prison sentence. And it doesn't have to explain why.", 0.4),
    ("scene-2", 390, "Artificial intelligence is no longer science fiction. "
                     "It's already in our courtrooms, hospitals, banks, and militaries. "
                     "Making decisions, at scale, without oversight.", 0.4),
    ("scene-3", 480, "In twenty twenty-three, an A.I. hiring tool rejected two hundred thousand "
                     "qualified candidates. Not for their skills, but for patterns it could never "
                     "explain. No human reviewed the decision. No human was accountable.", 0.4),
    ("scene-4", 360, "Autonomous weapons are being built that can select and eliminate targets "
                     "without human approval. They call it efficiency. "
                     "Others call it murder by algorithm.", 0.4),
    ("scene-5", 360, "The most dangerous thing about A.I. isn't that it will turn on us. "
                     "It's that it already has. And we gave it permission.", 0.4),
]


def synth(text, length_scale, out):
    subprocess.run(
        [PIPER, "-m", MODEL, "-f", out,
         "--length-scale", f"{length_scale:.3f}",
         "--noise-scale", "0.55", "--noise-w-scale", "0.7",
         "--sentence-silence", "0.35"],
        input=text.encode(), check=True,
        stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
    )


def read_wav(path):
    with wave.open(path, "r") as w:
        sr = w.getframerate()
        n = w.getnframes()
        raw = w.readframes(n)
    x = np.frombuffer(raw, dtype=np.int16).astype(np.float32) / 32768.0
    return x, sr


def write_wav(path, x, sr):
    x = np.clip(x, -1, 1)
    with wave.open(path, "w") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(sr)
        w.writeframes((x * 32767).astype(np.int16).tobytes())


def highpass(x, sr, fc=90.0):
    # one-pole high-pass
    rc = 1.0 / (2 * np.pi * fc)
    a = rc / (rc + 1.0 / sr)
    y = np.empty_like(x)
    prev_x = 0.0
    prev_y = 0.0
    for i in range(len(x)):
        y[i] = a * (prev_y + x[i] - prev_x)
        prev_x = x[i]
        prev_y = y[i]
    return y


def reverb(x, sr):
    # subtle early-reflection reverb via sparse impulse response
    ir = np.zeros(int(0.12 * sr))
    ir[0] = 1.0
    for delay_ms, gain in [(23, 0.28), (41, 0.20), (67, 0.14), (97, 0.09)]:
        idx = int(delay_ms / 1000 * sr)
        if idx < len(ir):
            ir[idx] += gain
    wet = np.convolve(x, ir)[: len(x)]
    return 0.82 * x + 0.18 * wet


def soft_compress(x, k=1.6):
    return np.tanh(x * k) / np.tanh(k)


def dur_of(path):
    r = subprocess.run([FFMPEG, "ffprobe", path], capture_output=True, text=True)
    for line in (r.stderr + r.stdout).splitlines():
        if "Duration" in line:
            ts = line.split("Duration:")[1].split(",")[0].strip()
            h, m, s = ts.split(":")
            return int(h) * 3600 + int(m) * 60 + float(s)
    return -1.0


def main():
    summary = []
    for name, frames, text, lead in SCENES:
        budget = frames / FPS
        target = budget - 0.7 - lead  # tail room + lead-in
        raw = f"/tmp/{name}-raw.wav"
        proc = f"/tmp/{name}-proc.wav"
        out_mp3 = os.path.join(OUTDIR, f"{name}.mp3")

        # Fit speaking rate to the scene budget.
        synth(text, 1.0, raw)
        x, sr = read_wav(raw)
        d0 = len(x) / sr
        ls = max(0.80, min(1.30, target / d0))
        synth(text, ls, raw)
        x, sr = read_wav(raw)
        d1 = len(x) / sr
        if d1 > target and ls > 0.80:
            ls = max(0.80, ls * (target / d1))
            synth(text, ls, raw)
            x, sr = read_wav(raw)
            d1 = len(x) / sr

        # numpy post-processing: rumble cut -> reverb -> soft compress.
        y = highpass(x, sr)
        y = reverb(y, sr)
        y = soft_compress(y, 1.5)
        y /= (np.max(np.abs(y)) + 1e-9)
        y *= 0.9
        write_wav(proc, y, sr)

        # ffmpeg: pitch down ~6% (asetrate then atempo restores duration),
        # lead-in silence, loudness normalize, encode mp3.
        af = (
            "asetrate=20727,aresample=44100,atempo=1.0638,"
            f"adelay={int(lead*1000)},"
            "loudnorm=I=-18:TP=-2:LRA=11"
        )
        subprocess.run(
            [FFMPEG, "ffmpeg", "-y", "-i", proc, "-af", af,
             "-ac", "1", "-ar", "44100", "-codec:a", "libmp3lame", "-b:a", "160k", out_mp3],
            check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
        )
        final = dur_of(out_mp3)
        summary.append((name, budget, final, ls))
        print(f"{name}: budget={budget:.1f}s vo={d1:.1f}s final={final:.1f}s ls={ls:.3f}")

    print("\nSummary:")
    for name, b, f, ls in summary:
        print(f"  {name}: {f:.1f}s / {b:.1f}s  [{'OK' if f <= b else 'OVER'}]")


if __name__ == "__main__":
    main()
