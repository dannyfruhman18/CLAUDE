#!/usr/bin/env python3
"""Generate a dark cinematic-tension background music bed (no downloads).

Outputs a ~65s stereo WAV which is then encoded to mp3 by the caller.
Style: low minor-key drone, slow swelling pad, a building heartbeat pulse,
and a tension riser toward the climax — to sit UNDER the narration.
"""
import numpy as np
import wave
import struct
import sys

SR = 44100
DUR = 65.0
N = int(SR * DUR)
t = np.linspace(0, DUR, N, endpoint=False)

def note(freq):
    return 2 * np.pi * freq * t

# ---- 1. Sub-bass drone: A1 + E2, with a slow amplitude swell (LFO ~0.05Hz) ----
lfo = 0.5 + 0.5 * np.sin(2 * np.pi * 0.05 * t - np.pi / 2)  # 0..1 slow swell
drone = (
    0.55 * np.sin(note(55.0)) +      # A1
    0.35 * np.sin(note(82.41)) +     # E2
    0.18 * np.sin(note(110.0))       # A2
)
drone *= (0.45 + 0.55 * lfo)

# ---- 2. Minor-triad pad (A2/C3/E3) sawtooth-ish through soft lowpass ----
def saw(freq, amp):
    s = np.zeros(N)
    for k in range(1, 9):  # limited harmonics = mellow
        s += (1.0 / k) * np.sin(note(freq * k))
    return amp * s

pad = saw(110.0, 0.10) + saw(130.81, 0.085) + saw(164.81, 0.075)  # A2 C3 E3 (minor)
# simple one-pole lowpass to tame the saw
def lowpass(x, a=0.012):
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a * (x[i] - acc)
        y[i] = acc
    return y
pad = lowpass(pad)
pad_env = 0.3 + 0.7 * (0.5 + 0.5 * np.sin(2 * np.pi * 0.035 * t - np.pi / 2))
pad *= pad_env

# ---- 3. Heartbeat pulse: low thump, density builds toward the end ----
heart = np.zeros(N)
beat_period = 1.6  # seconds between double-thumps early on
tcur = 4.0
while tcur < DUR - 2:
    # tempo accelerates slightly across the track (tension)
    prog = tcur / DUR
    period = beat_period * (1.0 - 0.35 * prog)
    for off in (0.0, 0.22):  # lub-dub
        start = int((tcur + off) * SR)
        length = int(0.18 * SR)
        if start + length >= N:
            break
        idx = np.arange(length)
        env = np.exp(-idx / (0.05 * SR))
        thump = np.sin(2 * np.pi * 50 * (idx / SR)) * env
        amp = 0.25 + 0.35 * prog
        heart[start:start + length] += amp * thump
    tcur += period

# ---- 4. Tension riser: filtered noise sweep rising over 35s..58s ----
riser = np.zeros(N)
rs, re = int(35 * SR), int(58 * SR)
noise = np.random.normal(0, 1, re - rs)
# rising amplitude envelope
env = np.linspace(0, 1, re - rs) ** 2
noise = lowpass(noise, a=0.05) * env * 0.12
riser[rs:re] = noise
# a single low boom at the climax (~50s)
boom_start = int(50 * SR)
blen = int(2.5 * SR)
bidx = np.arange(blen)
boom = np.sin(2 * np.pi * 38 * (bidx / SR)) * np.exp(-bidx / (0.8 * SR)) * 0.4
riser[boom_start:boom_start + blen] += boom

# ---- Mix ----
mix = drone + pad + heart + riser

# Master fades
fade_in = int(1.5 * SR)
fade_out = int(3.0 * SR)
mix[:fade_in] *= np.linspace(0, 1, fade_in)
mix[-fade_out:] *= np.linspace(1, 0, fade_out)

# Soft limiter (tanh) + normalize
mix = np.tanh(mix * 0.8)
mix /= np.max(np.abs(mix)) + 1e-9
mix *= 0.85

# Slight stereo widening (haas-ish + phase)
left = mix
right = np.concatenate([np.zeros(int(0.008 * SR)), mix])[:N]
stereo = np.stack([left, right], axis=1)
stereo /= np.max(np.abs(stereo)) + 1e-9
stereo *= 0.9

# ---- Write WAV ----
out = sys.argv[1] if len(sys.argv) > 1 else "public/audio/bg-music.wav"
data = (stereo * 32767).astype(np.int16)
with wave.open(out, "w") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(data.tobytes())
print(f"wrote {out} ({DUR}s, {SR}Hz stereo)")
