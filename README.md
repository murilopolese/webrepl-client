# MicroPython's WebREPL Client

Extracting all the logic to interact with MicroPython's WebREPL from [the official repository](https://github.com/micropython/webrepl).

## How to use it

1. Import the file `FileSaver.js`
1. Import the file `webrepl.js`
1. Make good use of the class `WebREPL` (check example of use on `index.html`)

## API

### `WebRepl(option)`

- `option`: Dictionary that can specify `ip`, the WebREPL `passord` and if it should `autoconnect`.

Constructor for `WebREPL` class.

Returns an instance of `WebREPL`.

#### Example

```javascript
repl = new WebREPL({
    ip: '192.168.1.4',
    password: 'micropythoN',
    autoconnect: true
})
```

### `connect()`

Connects to MicroPython WebREPL.

#### Example

```javascript
repl = new WebREPL()
repl.connect()
```
### `disconnect()`

Disconnects from MicroPython's WebREPL.

#### Example

```javascript
repl = new WebREPL()
repl.disconnect()
```

### `onMessage(msg)`

- `msg`: Data from the event coming from the `WebSocket` connection. The parameter `msg` can be a `string`, `object`, `blob` (maybe more? I don't know exactly).

This method is called everytime MicroPython's WebREPL emits events through the `WebSocket` connection. Override it with your own function to have access to the messages.

#### Example

```javascript
repl = new WebREPL({
    autoconnect: false
})
repl.onMessage = (msg) => {
    if (typeof msg === 'string') {
        console.log('got message', msg)
    }
}
repl.connect()
```


### `eval(command)`

- `command`: Python instruction to be evaluated by MicroPython's WebREPL.

Send instruction to be evaluated by MicroPython's WebREPL.

#### Example

```javascript
repl = new WebREPL({
    autoconnect: false
})
repl.onMessage = (msg) => {
    if (typeof msg === 'string') {
        console.log('got message', msg)
    }
}
repl.connect()
repl.eval('print("Hello World!")')
```

### `sendFile(file)`

- `file`: File to be sent to MicroPython's filesystem. `file` must be an instance of `File`.

Send a file to MicroPython's filesystem. The file will be uploaded to the root of MicroPython's filesystem with the same name.

#### Example

```html
<input type="file" id="filePicker">
<script>
    repl = new WebREPL()
    document.querySelector('#filePicker').addEventListener('change', (e) => {
        let files = e.target.files
        repl.sendFile(files[0])
    })
</script>
```

### `loadFile(filename)`

- `filename`: Name of the file to download from MicroPython's filesystem.

Downloads file from MicroPython's filesystem.

Note that `loadFile()` calls internally the method `saveAs()` that must be replaced by your own handler or the function `saveAs` provided if importing `FilePicker.js`.

#### Example

```javascript
repl = new WebREPL()
repl.saveAs = (blob) => {
    // `blob` is an instance of `Blob` with the requested file contents
}
repl.loadFile('boot.py')
```

### `saveAs(blob)`

- `blob`: Instance of `Blob` with file contents.

This method is fired when calling `loadFile()` in order to do something with it's content. Replace it by your own handler or the function `saveAs` provided if importing `FilePicker.js` if you want to "download" the file.

```html
<script type="text/javascript" src="FileSaver.js"></script>
<script>
    repl = new WebREPL()
    repl.saveAs = saveAs
    repl.loadFile('boot.py')
</script>
```
