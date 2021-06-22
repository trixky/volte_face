import { respond } from '@sveltejs/kit/ssr';
import root from './generated/root.svelte';
import { set_paths } from './runtime/paths.js';
import { set_prerendering } from './runtime/env.js';
import * as user_hooks from "./hooks.js";

const template = ({ head, body }) => "<!DOCTYPE html>\n<html lang=\"en\">\n\n<head>\n\t<meta charset=\"utf-8\" />\n\t<link rel=\"icon\" href=\"/favicon.png\" />\n\t<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\" />\n\t" + head + "\n</head>\n\n<body style=\"margin: 0; padding: 30px;\">\n\t<div id=\"svelte\">" + body + "</div>\n</body>\n<style>\n\t@import url('https://fonts.googleapis.com/css2?family=Bungee&display=swap');\n\th1, h2, p, a {\n        font-family: 'Bungee', cursive;\n\t}\n\t.center {\n        text-align: center;\n    }\n</style>\n\n</html>";

let options = null;

// allow paths to be overridden in svelte-kit preview
// and in prerendering
export function init(settings) {
	set_paths(settings.paths);
	set_prerendering(settings.prerendering || false);

	options = {
		amp: false,
		dev: false,
		entry: {
			file: "/./_app/start-78666dcb.js",
			css: ["/./_app/assets/start-a8cd1609.css"],
			js: ["/./_app/start-78666dcb.js","/./_app/chunks/vendor-ac44e151.js"]
		},
		fetched: undefined,
		floc: false,
		get_component_path: id => "/./_app/" + entry_lookup[id],
		get_stack: error => String(error), // for security
		handle_error: error => {
			console.error(error.stack);
			error.stack = options.get_stack(error);
		},
		hooks: get_hooks(user_hooks),
		hydrate: true,
		initiator: undefined,
		load_component,
		manifest,
		paths: settings.paths,
		read: settings.read,
		root,
		router: true,
		ssr: true,
		target: "#svelte",
		template,
		trailing_slash: "never"
	};
}

const d = decodeURIComponent;
const empty = () => ({});

const manifest = {
	assets: [{"file":"cpu.png","size":5059,"type":"image/png"},{"file":"favicon.png","size":1571,"type":"image/png"},{"file":"github.png","size":3162,"type":"image/png"},{"file":"menu_selection.mp3","size":17412,"type":"audio/mpeg"},{"file":"move.mp3","size":3433,"type":"audio/mpeg"},{"file":"restart.svg","size":414,"type":"image/svg+xml"},{"file":"svelte.png","size":4222,"type":"image/png"},{"file":"two_players.png","size":2434,"type":"image/png"},{"file":"vercel.png","size":4336,"type":"image/png"}],
	layout: ".svelte-kit/build/components/layout.svelte",
	error: ".svelte-kit/build/components/error.svelte",
	routes: [
		{
						type: 'page',
						pattern: /^\/$/,
						params: empty,
						a: [".svelte-kit/build/components/layout.svelte", "src/routes/index.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/settings\/?$/,
						params: empty,
						a: [".svelte-kit/build/components/layout.svelte", "src/routes/settings.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					},
		{
						type: 'page',
						pattern: /^\/about\/?$/,
						params: empty,
						a: [".svelte-kit/build/components/layout.svelte", "src/routes/about.svelte"],
						b: [".svelte-kit/build/components/error.svelte"]
					}
	]
};

// this looks redundant, but the indirection allows us to access
// named imports without triggering Rollup's missing import detection
const get_hooks = hooks => ({
	getSession: hooks.getSession || (() => ({})),
	handle: hooks.handle || (({ request, resolve }) => resolve(request))
});

const module_lookup = {
	".svelte-kit/build/components/layout.svelte": () => import("./components/layout.svelte"),".svelte-kit/build/components/error.svelte": () => import("./components/error.svelte"),"src/routes/index.svelte": () => import("../../src/routes/index.svelte"),"src/routes/settings.svelte": () => import("../../src/routes/settings.svelte"),"src/routes/about.svelte": () => import("../../src/routes/about.svelte")
};

const metadata_lookup = {".svelte-kit/build/components/layout.svelte":{"entry":"/./_app/layout.svelte-1f4844fd.js","css":[],"js":["/./_app/layout.svelte-1f4844fd.js","/./_app/chunks/vendor-ac44e151.js"],"styles":null},".svelte-kit/build/components/error.svelte":{"entry":"/./_app/error.svelte-5c716df4.js","css":[],"js":["/./_app/error.svelte-5c716df4.js","/./_app/chunks/vendor-ac44e151.js"],"styles":null},"src/routes/index.svelte":{"entry":"/./_app/pages/index.svelte-79e40a0b.js","css":["/./_app/assets/pages/index.svelte-bcb26473.css","/./_app/assets/Header-8c038b0c.css"],"js":["/./_app/pages/index.svelte-79e40a0b.js","/./_app/chunks/vendor-ac44e151.js","/./_app/chunks/Header-b182b7f8.js","/./_app/chunks/cookies-473cfc31.js"],"styles":null},"src/routes/settings.svelte":{"entry":"/./_app/pages/settings.svelte-17ed52c4.js","css":["/./_app/assets/pages/settings.svelte-1b04485a.css","/./_app/assets/Header-8c038b0c.css"],"js":["/./_app/pages/settings.svelte-17ed52c4.js","/./_app/chunks/vendor-ac44e151.js","/./_app/chunks/Header-b182b7f8.js","/./_app/chunks/cookies-473cfc31.js"],"styles":null},"src/routes/about.svelte":{"entry":"/./_app/pages/about.svelte-e8accbab.js","css":["/./_app/assets/pages/about.svelte-b9811563.css","/./_app/assets/Header-8c038b0c.css"],"js":["/./_app/pages/about.svelte-e8accbab.js","/./_app/chunks/vendor-ac44e151.js","/./_app/chunks/Header-b182b7f8.js"],"styles":null}};

async function load_component(file) {
	return {
		module: await module_lookup[file](),
		...metadata_lookup[file]
	};
}

init({ paths: {"base":"","assets":"/."} });

export function render(request, {
	prerender
} = {}) {
	const host = request.headers["host"];
	return respond({ ...request, host }, options, { prerender });
}