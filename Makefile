start:
	npx vite --open

lint:
	npx @biomejs/biome check

build:
	npx tsc -b
	npx vite build

preview:
	npx vite preview --open

tunnel:
	cloudflared tunnel --url localhost:5173
