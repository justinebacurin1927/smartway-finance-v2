#!/usr/bin/env bash
set -euo pipefail
ffmpeg -y -v error -filter_complex_threads 2 -i "$1" \
  -filter_complex '[0:v]setpts=1.25*(PTS-STARTPTS),framerate=fps=30:interp_start=0:interp_end=255:scene=100,split[body][head];[body]trim=start=0.5:end=10,setpts=PTS-STARTPTS[main];[head]trim=start=0:end=0.5,setpts=PTS-STARTPTS[start];[main][start]xfade=transition=fade:duration=0.5:offset=9,format=yuv420p[out]' \
  -map '[out]' -an -c:v libx264 -preset fast -crf 24 -movflags +faststart "$2"
