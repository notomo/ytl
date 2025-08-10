start:
	npx vite --open

lint:
	npx @biomejs/biome check

format:
	npx biome check --write --formatter-enabled=true --assist-enabled=true --unsafe

build:
	npx tsc -b
	npx vite build

test:
	npx vitest --run

preview:
	npx vite preview --open

tunnel:
	cloudflared tunnel --url localhost:5173

check_all: format lint build test
