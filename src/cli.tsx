#!/usr/bin/env node
import React from 'react';
import {render} from 'ink';
import meow from 'meow';
import App from './app.js';

const cli = meow(
	`
	Usage
	  $ ze

	Description
	  Fast and intuitive Zellij session manager with real-time search

	Navigation
	  ↑/↓ or Ctrl+j/k   Navigate through items
	  Enter             Select item or confirm
	  Esc or Ctrl+C     Cancel or exit
	  Type              Filter sessions by name
	  Backspace/Del     Clear search
	  Ctrl+D            Delete session

	Features
	  • Real-time incremental search
	  • Create new sessions directly from search
	  • Always shows "Create New Session" option
	  • Layout selection for new sessions

	Examples
	  $ ze           Start interactive session manager
	`,
	{
		importMeta: import.meta,
		flags: {
			version: {
				type: 'boolean',
				shortFlag: 'v',
			},
			help: {
				type: 'boolean',
				shortFlag: 'h',
			},
		},
	},
);

if (cli.flags.version) {
	console.log(cli.pkg.version);
	process.exit(0);
}

if (cli.flags.help) {
	console.log(cli.help);
	process.exit(0);
}

render(<App />);