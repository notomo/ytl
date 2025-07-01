# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

This project uses Make for task management:

- `make start` - Start development server with Vite (opens automatically)
- `make lint` - Run Biome linting and formatting checks
- `make build` - Build the project (TypeScript compilation + Vite build)
- `make preview` - Preview built application (opens automatically)
- `make tunnel` - Create cloudflare tunnel for local development

## Architecture

**YTL** is a React-based YouTube video player with range selection capabilities. The application allows users to:
- Load YouTube videos by URL or video ID
- Set start and end time ranges for playback loops
- Control playback rate with available rates from YouTube
- Seek frame-by-frame (1/30 second precision)

### Key Components

- **PlayerRoute** (`src/route/player.tsx`) - Main application layout with video player (85%) and controls (15%)
- **useYoutubePlayer** (`src/component/youtube.tsx`) - Core YouTube IFrame API integration hook
- **RangeSlider** (`src/component/range-slider.tsx`) - Dual-handle slider for setting start/end times
- **PlaybackRateSlider** (`src/component/playback-rate-slider.tsx`) - Controls for playback speed

### State Management

The application uses URL search parameters for persistent state:
- `v` - YouTube video ID
- `start` - Start time in seconds
- `end` - End time in seconds  
- `rate` - Playback rate

All state changes are reflected in the URL, making the application shareable and bookmarkable.

### YouTube Integration

The app directly integrates with YouTube's IFrame API through global window objects and custom TypeScript definitions. The player automatically loops between start and end times, and provides frame-level seeking precision.

## Development Notes

- Uses Vite with React SWC plugin for fast development
- Biome for linting and formatting (double quotes, space indentation)
- TailwindCSS v4 for styling with PostCSS
- TypeScript with strict configuration
- Path aliases configured via `vite-tsconfig-paths`