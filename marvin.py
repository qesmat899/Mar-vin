#!/usr/bin/env python3
"""
Mar-vin: Video transcription + AI summarization pipeline.
Usage: python3 marvin.py <URL> [--model base|small|medium|large] [--lang de|en|auto]
"""

import argparse
import os
import re
import subprocess
import sys
import tempfile
from pathlib import Path


def slugify(text: str) -> str:
    text = re.sub(r"[^\w\s-]", "", text.lower())
    return re.sub(r"[\s_-]+", "-", text).strip("-")[:60]


def download_video(url: str, outdir: Path) -> Path:
    print(f"[1/3] Downloading: {url}")
    result = subprocess.run(
        [
            "yt-dlp", url,
            "-f", "bestvideo[vcodec=h264]+bestaudio/best[acodec!=none]/best",
            "-o", str(outdir / "video.%(ext)s"),
            "--no-check-certificates",
            "--no-playlist",
            "--merge-output-format", "mp4",
            "--print", "after_move:filepath",
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        # fallback: any format with audio
        result = subprocess.run(
            [
                "yt-dlp", url,
                "-f", "best[acodec!=none]",
                "-o", str(outdir / "video.%(ext)s"),
                "--no-check-certificates",
                "--no-playlist",
                "--print", "after_move:filepath",
            ],
            capture_output=True, text=True,
        )
    if result.returncode != 0:
        print("yt-dlp error:", result.stderr[-500:])
        sys.exit(1)
    video_path = Path(result.stdout.strip().splitlines()[-1])
    print(f"    Saved: {video_path.name} ({video_path.stat().st_size // 1024 // 1024} MB)")
    return video_path


def extract_audio(video_path: Path, outdir: Path) -> Path:
    print("[2/3] Extracting audio …")
    audio_path = outdir / "audio.wav"
    result = subprocess.run(
        [
            "ffmpeg", "-y", "-i", str(video_path),
            "-vn", "-acodec", "pcm_s16le",
            "-ar", "16000", "-ac", "1",
            str(audio_path),
        ],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        print("ffmpeg error:", result.stderr[-300:])
        sys.exit(1)
    print(f"    Audio: {audio_path.stat().st_size // 1024} KB")
    return audio_path


def transcribe(audio_path: Path, model_size: str, language: str) -> dict:
    print(f"[3/3] Transcribing with Whisper ({model_size}) …")
    import whisper  # type: ignore
    model = whisper.load_model(model_size)
    kwargs = {"verbose": False}
    if language and language != "auto":
        kwargs["language"] = language
    result = model.transcribe(str(audio_path), **kwargs)
    detected = result.get("language", "?")
    print(f"    Done. Detected language: {detected}, chars: {len(result['text'])}")
    return result


def summarize_with_claude(transcript: str, url: str) -> str:
    import anthropic  # type: ignore
    client = anthropic.Anthropic()
    print("    Summarizing with Claude …")
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2048,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Das folgende ist ein automatisches Transkript eines Videos ({url}).\n"
                    "Erstelle eine strukturierte Zusammenfassung auf Deutsch mit:\n"
                    "- Hauptthema (1-2 Sätze)\n"
                    "- Kernpunkte als Stichpunkte\n"
                    "- Praktische Erkenntnisse / Takeaways\n\n"
                    f"Transkript:\n{transcript[:12000]}"
                ),
            }
        ],
    )
    return message.content[0].text


def summarize_local(result: dict, url: str) -> str:
    text = result["text"]
    lang = result.get("language", "?")
    segments = result.get("segments", [])
    lines = [
        f"# Automatisches Transkript-Extrakt",
        f"**Quelle:** {url}",
        f"**Erkannte Sprache:** {lang}",
        f"**Länge:** {len(text)} Zeichen",
        "",
        "## Transkript-Anfang (erste 3 Minuten)",
        "",
    ]
    # First ~3 min of segments
    cutoff = 180
    early = [s for s in segments if s["start"] < cutoff]
    if early:
        for s in early:
            lines.append(f"> [{s['start']:.0f}s] {s['text'].strip()}")
    else:
        lines.append(text[:1500])
    lines += [
        "",
        "## Hinweis",
        "Für eine KI-generierte Zusammenfassung: `ANTHROPIC_API_KEY=<key> python3 marvin.py <url>`",
    ]
    return "\n".join(lines)


def run(url: str, model_size: str, language: str, outdir: Path | None) -> None:
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")

    # Create output directory
    if outdir is None:
        slug = slugify(url.split("/")[-1] or url.split("/")[-2])
        outdir = Path("output") / slug
    outdir.mkdir(parents=True, exist_ok=True)

    video_path = download_video(url, outdir)
    audio_path = extract_audio(video_path, outdir)
    whisper_result = transcribe(audio_path, model_size, language)

    # Save raw transcript
    transcript_path = outdir / "transcript.txt"
    transcript_path.write_text(whisper_result["text"], encoding="utf-8")
    print(f"    Transcript: {transcript_path}")

    # Save timestamped transcript
    segments = whisper_result.get("segments", [])
    if segments:
        stamped = "\n".join(
            f"[{int(s['start'])//60:02d}:{int(s['start'])%60:02d}] {s['text'].strip()}"
            for s in segments
        )
        (outdir / "transcript_timestamped.txt").write_text(stamped, encoding="utf-8")

    # Summarize
    if api_key:
        summary = summarize_with_claude(whisper_result["text"], url)
    else:
        summary = summarize_local(whisper_result, url)

    summary_path = outdir / "summary.md"
    summary_path.write_text(summary, encoding="utf-8")
    print(f"    Summary:    {summary_path}")
    print()
    print("=" * 60)
    print(summary[:1200])
    print("=" * 60)


def main() -> None:
    parser = argparse.ArgumentParser(description="Mar-vin: Video → Transkript + Zusammenfassung")
    parser.add_argument("url", help="TikTok / YouTube / beliebige URL")
    parser.add_argument("--model", default="base", choices=["tiny", "base", "small", "medium", "large"],
                        help="Whisper-Modell (default: base)")
    parser.add_argument("--lang", default="auto", help="Sprache (de, en, auto)")
    parser.add_argument("--out", type=Path, default=None, help="Ausgabeverzeichnis")
    args = parser.parse_args()

    run(
        url=args.url,
        model_size=args.model,
        language=args.lang if args.lang != "auto" else "",
        outdir=args.out,
    )


if __name__ == "__main__":
    main()
