# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses Make for task management:

- `make lint` - Run Biome linting and formatting checks
- `make format` - Format code with Biome (fixes issues automatically)
- `make build` - Build the project (TypeScript compilation + Vite build)
- `make test` - Run Vitest tests
- `make start` - Start development server
- `make check_all` - Format, lint, build, and test (use to ensure before finishing tasks)

## Architecture

**YTL** is a React-based YouTube video player with range selection capabilities. The application allows users to:
- Load YouTube videos by URL or video ID
- Set start and end time ranges for playback loops
- Control playback rate with available rates from YouTube
- Seek frame-by-frame (1/30 second precision)
- Add/delete marks for precise navigation
- Loop between marks or within selected ranges

### Key Components

- **PlayerRoute** (`src/route/player.tsx`) - Main application layout with video player (85%) and controls (15%)
- **useYoutubePlayer** (`src/component/youtube.tsx`) - Core YouTube IFrame API integration hook
- **RangeSlider** (`src/component/range-slider.tsx`) - Dual-handle slider for setting start/end times with mark visualization
- **PlaybackRateSlider** (`src/component/playback-rate-slider.tsx`) - Controls for playback speed
- **Mark system** (`src/component/mark.ts`, `src/component/mark-button.tsx`) - Functions for managing playback marks and mark-based looping

### State Management

The application uses URL search parameters for persistent state:
- `v` - YouTube video ID
- `start` - Start time in seconds
- `end` - End time in seconds  
- `rate` - Playback rate
- `marks` - Comma-separated list of mark positions
- `markLoopIndex` - Index of currently active mark loop
- `cutStart`/`cutEnd` - Boolean flags for range cutting

All state changes are reflected in the URL, making the application shareable and bookmarkable.

### YouTube Integration

The app directly integrates with YouTube's IFrame API through global window objects and custom TypeScript definitions in `src/component/youtube.tsx`. The player automatically loops between start and end times or between marks, and provides frame-level seeking precision (1/30 second).

### Testing

- Uses Vitest for testing
- Test files use `.test.ts` extension
- Example: `src/component/mark.test.ts` contains comprehensive tests for mark functionality

## Development Notes

- Uses Vite with React SWC plugin for fast development
- Biome for linting and formatting (double quotes, space indentation)
- TailwindCSS v4 for styling with PostCSS
- TypeScript with strict configuration including `noUncheckedIndexedAccess`
- Path aliases configured via `vite-tsconfig-paths` (`~/*` maps to `./src/*`)
- React 19 with React Router v7 for navigation
- Frame precision is 1/30 second (stored in `frame` constant)