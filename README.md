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


## License

This code is released under the [GPL v3](LICENSE) license.
