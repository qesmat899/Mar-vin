#!/usr/bin/env bash
# Pipeline: TikTok video download -> audio extract -> Whisper transcription -> summary
set -e

URL="${1:-https://vm.tiktok.com/ZNRcthjYj/}"
WORKDIR="tiktok_work"
mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "=== Downloading TikTok video ==="
yt-dlp "$URL" -f "h264_540p_238935-0" -o "video_with_audio.%(ext)s" --no-check-certificates

echo "=== Extracting audio ==="
ffmpeg -y -i video_with_audio.mp4 -vn -acodec pcm_s16le -ar 16000 -ac 1 audio.wav

echo "=== Transcribing with Whisper ==="
python3 - <<'PYEOF'
import whisper, sys, os
model = whisper.load_model("base")
result = model.transcribe("audio.wav", verbose=False)
with open("transcript.txt", "w") as f:
    f.write(result["text"])
print(f"Transcript saved ({len(result['text'])} chars, lang={result.get('language','?')})")
PYEOF

echo "=== Transcript preview ==="
head -c 500 transcript.txt
