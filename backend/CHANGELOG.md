# Changelog

## [1.3.0](https://github.com/josueguido/TaskFlow-App/compare/backend-v1.2.0...backend-v1.3.0) (2026-04-16)


### Features

* integrate metrics for database connections and trivy ([#97](https://github.com/josueguido/TaskFlow-App/issues/97)) ([9ca7782](https://github.com/josueguido/TaskFlow-App/commit/9ca7782f243f690bb2f70462f57eb858b298f011))

## [1.2.0](https://github.com/josueguido/TaskFlow-App/compare/backend-v1.1.0...backend-v1.2.0) (2026-03-05)


### Features

* add dockerized logging/monitoring stack (prometheus + grafana) ([c06dba9](https://github.com/josueguido/TaskFlow-App/commit/c06dba9e95abbd213929d03525e35acfdc4f8656))
* add environment configuration, Makefile, and update logging guide ([6f33e8a](https://github.com/josueguido/TaskFlow-App/commit/6f33e8a3211426ba84f3fd0d766b71336973b635))
* add environment configuration, Makefile, and update logging guide; improve metrics handling and Docker setup ([552adb7](https://github.com/josueguido/TaskFlow-App/commit/552adb7e928530aa9e1d1fab788d218397578283))
* add logging middleware with request ID and duration logging, enhance logger configuration with daily rotation ([ca2d5e5](https://github.com/josueguido/TaskFlow-App/commit/ca2d5e53e3fba0bf8d7435823d7ced3a0e8eb6d7))
* Add production and development Docker Compose files for TaskFlow application ([0ad5c9a](https://github.com/josueguido/TaskFlow-App/commit/0ad5c9aa70da2334aad8da7cee0eda9de2a41c6c))
* Add production and development Docker Compose files for TaskFlow application ([74f88c9](https://github.com/josueguido/TaskFlow-App/commit/74f88c947d08c868ef60211dd592f6b652ce615e))
* Enhance monitoring and logging infrastructure ([e3a3e56](https://github.com/josueguido/TaskFlow-App/commit/e3a3e5681486e0a38a05159894ea2408a313de4b))
* Enhance monitoring and logging infrastructure ([8fbfba0](https://github.com/josueguido/TaskFlow-App/commit/8fbfba0f800f68d6261fa11ddb29754b22ac80fd))
* implement CI/CD workflows for frontend and backend with Docker support ([bd90ecf](https://github.com/josueguido/TaskFlow-App/commit/bd90ecfdf96291d6e1c99920901178cf2798a1bf))
* implement monitoring with Prometheus and Grafana, add metrics middleware, and update Docker configurations ([8a20e8a](https://github.com/josueguido/TaskFlow-App/commit/8a20e8ae3213f59659426a0701de11916009e003))
* implement monitoring with Prometheus and Grafana, add metrics middleware, and update Docker configurations ([2005cec](https://github.com/josueguido/TaskFlow-App/commit/2005cec7e53d1008ee4b6dc415b52e332f84ab78))
* implement version bumping in CI, enhance logging configuration and update Docker setup for monitoring ([c22be42](https://github.com/josueguido/TaskFlow-App/commit/c22be42fc9e20505ff5376108d115cc5ef1af8e0))
* implement version bumping in CI, enhance logging configuration, and update Docker setup for monitoring ([68a7e7b](https://github.com/josueguido/TaskFlow-App/commit/68a7e7b9d1a47db3845dd5ea2740d7a049d0bd45))
* **logging:** implement context-aware logging across services and controllers ([5e5152c](https://github.com/josueguido/TaskFlow-App/commit/5e5152c56400ed6b06e4dbfa1252e52a5f710603))
* **logging:** update logging guide and improve context logging in project and status controllers ([6b080c2](https://github.com/josueguido/TaskFlow-App/commit/6b080c20f2faa18f78449bc38b6213c4aa6c02bd))
* **logging:** update logging guide and improve context logging in project and status controllers ([9b74acc](https://github.com/josueguido/TaskFlow-App/commit/9b74acc0b18786dd578363462103427c6e35ef60))
* Translate UI text from Spanish to English across various components and hooks ([32e722a](https://github.com/josueguido/TaskFlow-App/commit/32e722aa9e77a17ab9ddedb448db1d4b4939124c))


### Bug Fixes

* convert frontend and backend from submodules to normal folders ([0bb7973](https://github.com/josueguido/TaskFlow-App/commit/0bb7973faf83320c064cd7c377e7b16531de42d6))
* ensure type safety in business, project, assignment, status, and task controllers by explicitly typing req.params ([26f99c5](https://github.com/josueguido/TaskFlow-App/commit/26f99c5e2d514829e634a5f2fc1a7dd6f8ac7ac5))
* errors in dockerfiles ([dbba3bf](https://github.com/josueguido/TaskFlow-App/commit/dbba3bf5c750ad1d8ea460b3d75f0b0e7982cfb1))
* update .editorconfig for line endings and whitespace handling; refine Dockerfile by removing unnecessary config copy ([f52c717](https://github.com/josueguido/TaskFlow-App/commit/f52c717d1241a82d1e08d81531fb683ec5817e5f))
* update .editorconfig for line endings and whitespace handling; refine Dockerfile by removing unnecessary config copy ([7b7deb3](https://github.com/josueguido/TaskFlow-App/commit/7b7deb3b0a58182fdc675cd0234fd5e512d61320))
* update Dockerfile to use npm install instead of npm ci for package management ([c4bc6a2](https://github.com/josueguido/TaskFlow-App/commit/c4bc6a27f1a1f1e4a4bbfdd9dd08ba8ddec00186))
* update Dockerfile to use npm install instead of npm ci for package management ([451bd21](https://github.com/josueguido/TaskFlow-App/commit/451bd21d8fcb658938cf0af142e6054bfc4d2c25))
* update jest configuration to handle no test cases gracefully and correct eslint ignore for jest config ([d1f5616](https://github.com/josueguido/TaskFlow-App/commit/d1f56163797d8ccde6e45ce08d32d5ab26a1227d))
* update jest configuration to handle no test cases gracefully and correct eslint ignore for jest config ([588ed21](https://github.com/josueguido/TaskFlow-App/commit/588ed2168dcf0d0a1176f492ecdc4da74b6a051c))
* update last updated date in README and remove tsconfig.json from .dockerignore ([52b8fa6](https://github.com/josueguido/TaskFlow-App/commit/52b8fa6873e7f58aab5a4b65f671ba8f356be86b))
* update last updated date in README and remove tsconfig.json from dockerignore ([c9e1dda](https://github.com/josueguido/TaskFlow-App/commit/c9e1ddae9a385845cb59e21bbdc4f736223b916c))
* update package.json to use latest @types/node version ([26f99c5](https://github.com/josueguido/TaskFlow-App/commit/26f99c5e2d514829e634a5f2fc1a7dd6f8ac7ac5))

## [1.1.0](https://github.com/josueguido/TaskFlow-App/compare/taskflow-backend-v1.0.0...taskflow-backend-v1.1.0) (2026-03-05)


### Features

* add dockerized logging/monitoring stack (prometheus + grafana) ([c06dba9](https://github.com/josueguido/TaskFlow-App/commit/c06dba9e95abbd213929d03525e35acfdc4f8656))
* add environment configuration, Makefile, and update logging guide ([6f33e8a](https://github.com/josueguido/TaskFlow-App/commit/6f33e8a3211426ba84f3fd0d766b71336973b635))
* add environment configuration, Makefile, and update logging guide; improve metrics handling and Docker setup ([552adb7](https://github.com/josueguido/TaskFlow-App/commit/552adb7e928530aa9e1d1fab788d218397578283))
* add logging middleware with request ID and duration logging, enhance logger configuration with daily rotation ([ca2d5e5](https://github.com/josueguido/TaskFlow-App/commit/ca2d5e53e3fba0bf8d7435823d7ced3a0e8eb6d7))
* Add production and development Docker Compose files for TaskFlow application ([0ad5c9a](https://github.com/josueguido/TaskFlow-App/commit/0ad5c9aa70da2334aad8da7cee0eda9de2a41c6c))
* Add production and development Docker Compose files for TaskFlow application ([74f88c9](https://github.com/josueguido/TaskFlow-App/commit/74f88c947d08c868ef60211dd592f6b652ce615e))
* Enhance monitoring and logging infrastructure ([e3a3e56](https://github.com/josueguido/TaskFlow-App/commit/e3a3e5681486e0a38a05159894ea2408a313de4b))
* Enhance monitoring and logging infrastructure ([8fbfba0](https://github.com/josueguido/TaskFlow-App/commit/8fbfba0f800f68d6261fa11ddb29754b22ac80fd))
* implement CI/CD workflows for frontend and backend with Docker support ([bd90ecf](https://github.com/josueguido/TaskFlow-App/commit/bd90ecfdf96291d6e1c99920901178cf2798a1bf))
* implement monitoring with Prometheus and Grafana, add metrics middleware, and update Docker configurations ([8a20e8a](https://github.com/josueguido/TaskFlow-App/commit/8a20e8ae3213f59659426a0701de11916009e003))
* implement monitoring with Prometheus and Grafana, add metrics middleware, and update Docker configurations ([2005cec](https://github.com/josueguido/TaskFlow-App/commit/2005cec7e53d1008ee4b6dc415b52e332f84ab78))
* implement version bumping in CI, enhance logging configuration and update Docker setup for monitoring ([c22be42](https://github.com/josueguido/TaskFlow-App/commit/c22be42fc9e20505ff5376108d115cc5ef1af8e0))
* implement version bumping in CI, enhance logging configuration, and update Docker setup for monitoring ([68a7e7b](https://github.com/josueguido/TaskFlow-App/commit/68a7e7b9d1a47db3845dd5ea2740d7a049d0bd45))
* **logging:** implement context-aware logging across services and controllers ([5e5152c](https://github.com/josueguido/TaskFlow-App/commit/5e5152c56400ed6b06e4dbfa1252e52a5f710603))
* **logging:** update logging guide and improve context logging in project and status controllers ([6b080c2](https://github.com/josueguido/TaskFlow-App/commit/6b080c20f2faa18f78449bc38b6213c4aa6c02bd))
* **logging:** update logging guide and improve context logging in project and status controllers ([9b74acc](https://github.com/josueguido/TaskFlow-App/commit/9b74acc0b18786dd578363462103427c6e35ef60))
* Translate UI text from Spanish to English across various components and hooks ([32e722a](https://github.com/josueguido/TaskFlow-App/commit/32e722aa9e77a17ab9ddedb448db1d4b4939124c))


### Bug Fixes

* convert frontend and backend from submodules to normal folders ([0bb7973](https://github.com/josueguido/TaskFlow-App/commit/0bb7973faf83320c064cd7c377e7b16531de42d6))
* ensure type safety in business, project, assignment, status, and task controllers by explicitly typing req.params ([26f99c5](https://github.com/josueguido/TaskFlow-App/commit/26f99c5e2d514829e634a5f2fc1a7dd6f8ac7ac5))
* errors in dockerfiles ([dbba3bf](https://github.com/josueguido/TaskFlow-App/commit/dbba3bf5c750ad1d8ea460b3d75f0b0e7982cfb1))
* update .editorconfig for line endings and whitespace handling; refine Dockerfile by removing unnecessary config copy ([f52c717](https://github.com/josueguido/TaskFlow-App/commit/f52c717d1241a82d1e08d81531fb683ec5817e5f))
* update .editorconfig for line endings and whitespace handling; refine Dockerfile by removing unnecessary config copy ([7b7deb3](https://github.com/josueguido/TaskFlow-App/commit/7b7deb3b0a58182fdc675cd0234fd5e512d61320))
* update Dockerfile to use npm install instead of npm ci for package management ([c4bc6a2](https://github.com/josueguido/TaskFlow-App/commit/c4bc6a27f1a1f1e4a4bbfdd9dd08ba8ddec00186))
* update Dockerfile to use npm install instead of npm ci for package management ([451bd21](https://github.com/josueguido/TaskFlow-App/commit/451bd21d8fcb658938cf0af142e6054bfc4d2c25))
* update jest configuration to handle no test cases gracefully and correct eslint ignore for jest config ([d1f5616](https://github.com/josueguido/TaskFlow-App/commit/d1f56163797d8ccde6e45ce08d32d5ab26a1227d))
* update jest configuration to handle no test cases gracefully and correct eslint ignore for jest config ([588ed21](https://github.com/josueguido/TaskFlow-App/commit/588ed2168dcf0d0a1176f492ecdc4da74b6a051c))
* update last updated date in README and remove tsconfig.json from .dockerignore ([52b8fa6](https://github.com/josueguido/TaskFlow-App/commit/52b8fa6873e7f58aab5a4b65f671ba8f356be86b))
* update last updated date in README and remove tsconfig.json from dockerignore ([c9e1dda](https://github.com/josueguido/TaskFlow-App/commit/c9e1ddae9a385845cb59e21bbdc4f736223b916c))
* update package.json to use latest @types/node version ([26f99c5](https://github.com/josueguido/TaskFlow-App/commit/26f99c5e2d514829e634a5f2fc1a7dd6f8ac7ac5))
