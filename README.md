# FreeTV Viewer

<img src="public/assets/freetv.png" align="left" width="100" style="margin: 10px;"> FreeTV Viewer is a browser-based interface for exploring and watching FreeTV’s hand-picked collection of shows and movies hosted by the Internet Archive.

The Viewer consumes published static configuration, playlist JSON, and thumbnail artifacts. It does not connect directly to MariaDB or require the FreeTV Admin Dashboard for normal viewing.

Watch FreeTV online at: [https://freetv.today](https://freetv.today).

## Features

* Easy-to-use graphical interface for browsing and watching FreeTV content
* Browse multiple playlists and show categories
* Search the current playlist
* Save favorite shows in the browser
* View recently watched shows
* Resume previously started videos
* Responsive layouts for desktop and mobile browsers
* Installable Progressive Web App
* Report unavailable or problematic shows when connected to the FreeTV API
* Built-in help and troubleshooting information

## Requirements

### Using the Viewer

* A modern web browser
* JavaScript enabled
* Internet access for published FreeTV data and Internet Archive media

The Viewer stores preferences such as the selected playlist, favorites, recently watched shows, and playback state in the browser. No Viewer account is required.

### Viewer Development

* Node.js 22 or newer
* npm
* A modern web browser

Frontend dependencies, including Preact, Preact Signals, Preact ISO, Vite, and Bootstrap, are installed through npm.

PHP and MariaDB are not required for normal standalone Viewer development. Report a Problem requires a compatible API endpoint in production; the Vite development server provides a non-persistent mock response for local interface testing.

## Getting Started

The Viewer can run independently using the official Viewer data published at `freetv.today`. PHP, MariaDB, the Admin Dashboard, and the other FreeTV repositories are not required for this development mode.

1. Clone or download `freetv-viewer`.
2. In a terminal, navigate to the `freetv-viewer` directory and run:

   ```bash
   npm install
   ```

3. From the same directory, start the Vite development server:

   ```bash
   npm run dev
   ```

4. Open the local URL printed by Vite in your browser.

By default, the development server proxies requests for `/config.json`, `/playlists/`, and `/thumbs/` to `https://freetv.today`. The Viewer application itself runs locally while using the currently published official data.

The Vite development server also provides a non-persistent mock response for `/api/report-problem.php`. This allows the Report a Problem interface to be tested without running the FreeTV PHP backend. Mock submissions are not saved or sent to the official FreeTV site.

To develop with local disposable Viewer data instead, see [Local Data Development](#local-data-development).

## How do I ...  ?

`freetv-viewer` can be developed and run on its own; you do not need the Admin Dashboard, MariaDB, or a complete FreeTV production assembly to work on the Viewer. The table below covers tasks within this repository. For help choosing another FreeTV repository, see the [FreeTV organization overview](https://github.com/freetv-today).<br/>

| I want to... | What do I do? | What happens? |
| --- | --- | --- |
| **Run the Viewer with official remote data** | Navigate to `freetv-viewer`, run `npm install`, and then run `npm run dev`. See [Getting Started](#getting-started). | Starts the local Viewer frontend and proxies data requests to the currently published artifacts at `freetv.today`. |
| **Run the Viewer with local data** | Set `FREETV_DATA_MODE=local`, install disposable Viewer data, and run `npm run dev`. See [Local Data Development](#local-data-development). | Loads configuration, playlists, and thumbnails from the Viewer’s ignored `public/` data paths instead of `freetv.today`. |
| **Test the Report a Problem interface locally** | Run the Viewer with `npm run dev` and submit a problem report. | Vite returns a simulated success response. Nothing is persisted or sent to the official FreeTV site. |
| **Build only the Viewer frontend** | Navigate to `freetv-viewer` and run `npm run build`. See [Build the Viewer](#build-the-viewer). | Creates and validates a frontend-only production build in `dist/`. Viewer data, Admin files, and PHP APIs are not included. |
| **Run the Viewer contract tests** | Run `npm run test:viewer-dist` and `npm run test:pwa`. See [Testing](#testing). | Validates the production-build contract and Progressive Web App files without creating a complete FreeTV assembly. |

## License

This code is released under the [GPL v3](LICENSE) license.
