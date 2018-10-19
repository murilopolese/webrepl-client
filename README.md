## MicroPython's WebREPL Client

MicroPython's WebREPL allows a REPL (interactive prompt) over WebSocket. It makes possible to interact with MicroPython using only a browser without additional drivers and software installation or cables. It also offers file transfer capabilities.

To use `webrepl-client` you must have started WebREPL on your board and connect both computer and board to the same wifi network (even if it's the network created by the board).

This library extracts most logic to interact with MicroPython's WebREPL from [the official repository](https://github.com/micropython/webrepl).

### Available features

- Connects to board running MicroPython's WebREPL
- Inputs password without prompting user
- Offers callbacks on connection opening and incoming messages
- Send, retrieve and remove files from MicroPython's filesystem
- Offers a callback with file's blob when loading file
- Evaluate commands and string containing lines of code
- Enter and exit "raw repl" mode
- Send keyboard interrupt and software reset

### How to use it

1. Run `yarn add murilopolese/webrepl-client` (or `bower install murilopolese/webrepl-client`)
1. Include `webrepl.js` and optionally `FileSaver.js`
1. Check the examples and documentation to see what's possible to do.

### Roadmap

- Offer AMD, CommonJS and ES6 modules
- Nodejs support
- Callbacks for code and command execution
