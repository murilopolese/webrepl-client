let connect = (ip, password) => {
    return new Promise((resolve, reject) => {
        let repl = new WebREPL({
            ip: ip,
            password: password,
            autoconnect: false
        })
        repl.onConnected = () => {
            resolve(repl)
        }
        repl.connect()
    })
}
