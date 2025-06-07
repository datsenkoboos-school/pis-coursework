FROM node:20-slim AS base
RUN apt-get update -y && apt-get install -y openssl
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g corepack@latest
RUN corepack prepare pnpm@9.15.5 --activate
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
ENV PORT=80
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/.output /app/.output
EXPOSE 80
CMD ["pnpm", "start"] 
