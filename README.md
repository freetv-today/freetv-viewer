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

The Viewer frontend uses Preact, Preact Signals, Preact ISO, and Vite. These dependencies are installed through npm.

Bootstrap is currently loaded from jsDelivr in `index.html`. An Internet connection is therefore required to load Bootstrap during standalone development unless those resources are already cached by the browser.

PHP and MariaDB are not required for normal standalone Viewer development. Report a Problem requires a compatible API endpoint in production; the Vite development server provides a non-persistent mock response for local interface testing.

## License

This code is released under the [GPL v3](LICENSE) license.
