// Please, all the credit to the FABULOUS work of https://github.com/micropython/webrepl

class WebREPL {
    constructor(opts) {
        opts = opts || {}
        this.binaryState = 0
        this.ip = opts.ip || '192.168.1.4'
        this.password = opts.password || 'micropythoN'
        this.sendFileName = ''
        this.sendFileData = new ArrayBuffer()
        this.getFileName = ''
        this.getFileData = new ArrayBuffer()
        this.STOP = '\r\x03' // CTRL-C 2x
        this.RESET = '\r\x04' // CTRL-D
        this.ENTER_RAW_REPL = '\r\x01' // CTRL-A
        this.EXIT_RAW_REPL = '\r\x04\r\x02' // CTRL-D + CTRL-B
        if (opts.autoconnect) {
            this.connect()
        }
    }
    _decodeResp(data) {
        if (data[0] == 'W'.charCodeAt(0) && data[1] == 'B'.charCodeAt(0)) {
            var code = data[2] | (data[3] << 8)
            return code;
        } else {
            return -1;
        }
    }
    _handleMessage(event) {
        if (event.data instanceof ArrayBuffer) {
            let data = new Uint8Array(event.data)
            switch (this.binaryState) {
                case 11:
                    // first response for put
                    if (this._decodeResp(data) == 0) {
                        // send file data in chunks
                        for (let offset = 0; offset < this.sendFileData.length; offset += 1024) {
                            this.ws.send(this.sendFileData.slice(offset, offset + 1024))
                        }
                        this.binaryState = 12
                    }
                    break
                case 12:
                    // final response for put
                    if (this._decodeResp(data) == 0) {
                        console.log(`Sent ${this.sendFileName}, ${this.sendFileData.length} bytes`)
                    } else {
                        console.log(`Failed sending ${this.sendFileName}`)
                    }
                    this.binaryState = 0
                    break;
                case 21:
                    // first response for get
                    if (this._decodeResp(data) == 0) {
                        this.binaryState = 22
                        var rec = new Uint8Array(1)
                        rec[0] = 0
                        this.ws.send(rec)
                    }
                    break;
                case 22: {
                    // file data
                    var sz = data[0] | (data[1] << 8)
                    if (data.length == 2 + sz) {
                        // we assume that the data comes in single chunks
                        if (sz == 0) {
                            // end of file
                            this.binaryState = 23
                        } else {
                            // accumulate incoming data to this.getFileData
                            var new_buf = new Uint8Array(this.getFileData.length + sz)
                            new_buf.set(this.getFileData)
                            new_buf.set(data.slice(2), this.getFileData.length)
                            this.getFileData = new_buf
                            console.log('Getting ' + this.getFileName + ', ' + this.getFileData.length + ' bytes')

                            var rec = new Uint8Array(1)
                            rec[0] = 0
                            this.ws.send(rec)
                        }
                    } else {
                        this.binaryState = 0
                    }
                    break;
                }
                case 23:
                    // final response
                    if (this._decodeResp(data) == 0) {
                        console.log(`Got ${this.getFileName}, ${this.getFileData.length} bytes`)
                        this.saveAs(new Blob([this.getFileData], {type: "application/octet-stream"}), this.getFileName)
                    } else {
                        console.log(`Failed getting ${this.getFileName}`)
                    }
                    this.binaryState = 0
                    break
                case 31:
                    // first (and last) response for GET_VER
                    console.log('GET_VER', data)
                    this.binaryState = 0
                    break
            }
        }
        // If is asking for password, send password
        if( event.data == 'Password: ' ) {
            this.ws.send(`${this.password}\r`)
        }
        this.onMessage(event.data)
    }

    connect() {
        this.ws = new WebSocket(`ws://${this.ip}:8266`)
        this.ws.binaryType = 'arraybuffer'
        this.ws.onopen = () => {
            this.onConnected()
            this.ws.onmessage = this._handleMessage.bind(this)
        }
    }
    disconnect() {
        this.ws.close()
    }
    
    onConnected() {
        console.log('onConnected')
    }
    onMessage(msg) {
        console.log('onMessage', msg)
    }
    saveAs(blob) {
        console.log(`saving as: ${blob}`)
    }

    sendStop() {
        this.eval(this.STOP)
    }
    softReset() {
        this.sendStop()
        this.eval(this.RESET)
    }
    enterRawRepl() {
        this.eval(this.ENTER_RAW_REPL)
    }
    exitRawRepl() {
        this.eval(this.EXIT_RAW_REPL)
    }
    execRaw(raw) {
        this.eval(raw)
        if (raw.indexOf('\n') == -1) {
            this.eval('\r')
        }
    }
    exec(command) {
        this.eval(command)
    }
    execFromString(code) {
        this.sendStop()
        this.enterRawRepl()
        this.execRaw(code)
        this.exitRawRepl()
    }
    eval(command) {
        this.ws.send(`${command}`)
    }

    _sendFile() {
        let dest_fname = this.sendFileName
        let dest_fsize = this.sendFileData.length

        // WEBREPL_FILE = "<2sBBQLH64s"
        let rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64)
        rec[0] = 'W'.charCodeAt(0)
        rec[1] = 'A'.charCodeAt(0)
        rec[2] = 1 // put
        rec[3] = 0
        rec[4] = 0; rec[5] = 0; rec[6] = 0; rec[7] = 0; rec[8] = 0; rec[9] = 0; rec[10] = 0; rec[11] = 0;
        rec[12] = dest_fsize & 0xff; rec[13] = (dest_fsize >> 8) & 0xff; rec[14] = (dest_fsize >> 16) & 0xff; rec[15] = (dest_fsize >> 24) & 0xff;
        rec[16] = dest_fname.length & 0xff; rec[17] = (dest_fname.length >> 8) & 0xff;
        for (let i = 0; i < 64; ++i) {
            if (i < dest_fname.length) {
                rec[18 + i] = dest_fname.charCodeAt(i)
            } else {
                rec[18 + i] = 0
            }
        }

        // initiate put
        this.binaryState = 11
        console.log('Sending ' + this.sendFileName + '...')
        this.ws.send(rec)
    }
    sendFile(file) {
        this.sendFileName = file.name
        let reader = new FileReader()
        reader.onload = (e) => {
            this.sendFileData = new Uint8Array(e.target.result)
            this._sendFile()
        };
        reader.readAsArrayBuffer(file)
    }
    loadFile(path) {
        // WEBREPL_FILE = "<2sBBQLH64s"
        let rec = new Uint8Array(2 + 1 + 1 + 8 + 4 + 2 + 64);
        rec[0] = 'W'.charCodeAt(0);
        rec[1] = 'A'.charCodeAt(0);
        rec[2] = 2; // get
        rec[3] = 0;
        rec[4] = 0; rec[5] = 0; rec[6] = 0; rec[7] = 0; rec[8] = 0; rec[9] = 0; rec[10] = 0; rec[11] = 0;
        rec[12] = 0; rec[13] = 0; rec[14] = 0; rec[15] = 0;
        rec[16] = path.length & 0xff; rec[17] = (path.length >> 8) & 0xff;
        for (let i = 0; i < 64; ++i) {
            if (i < path.length) {
                rec[18 + i] = path.charCodeAt(i);
            } else {
                rec[18 + i] = 0;
            }
        }

        // initiate get
        this.binaryState = 21;
        this.getFileName = path;
        this.getFileData = new Uint8Array(0);
        console.log('Getting ' + this.getFileName + '...');
        this.ws.send(rec);
    }
    removeFile(filename) {
        const pCode = `from os import remove
remove('${filename}')`
        this.execFromString(pCode)
    }
}
