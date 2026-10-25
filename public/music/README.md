This folder is currently unused.

The site's music toggle plays a generative ambient soundtrack synthesized
live in the browser via the Web Audio API (see src/lib/ambientSynth.ts) —
no audio file is needed. If you'd rather ship a real recorded track later,
drop it here and update src/components/MusicPlayer.tsx to use an <audio>
element pointing at it instead.
