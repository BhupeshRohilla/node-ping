# NODE-PING

a ping wrapper for nodejs

@last-modified: 2019-03-09

# LICENSE MIT

(C) Daniel Zelisko

http://github.com/danielzzz/node-ping

# DESCRIPTION

node-ping is a simple wrapper for the system ping utility

# INSTALLATION

npm install ping

# USAGE

Below are examples extracted from `examples`

## Tradition calls

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];
hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    });
});
```

## Tradition calls with configuration

```js
var cfg = {
    timeout: 10,
    // WARNING: -i 2 may not work in other platform like window
    extra: ['-i', '2'],
};

hosts.forEach(function(host){
    ping.sys.probe(host, function(isAlive){
        var msg = isAlive ? 'host ' + host + ' is alive' : 'host ' + host + ' is dead';
        console.log(msg);
    }, cfg);
});
```

## Promise wrapper

```js
var ping = require('ping');

var hosts = ['192.168.1.1', 'google.com', 'yahoo.com'];

hosts.forEach(function (host) {
    ping.promise.probe(host)
        .then(function (res) {
            console.log(res);
        });
});
```

## Promise Wrapper with configurable ping options

```js
hosts.forEach(function (host) {
    // WARNING: -i 2 argument may not work in other platform like window
    ping.promise.probe(host, {
        timeout: 10,
        extra: ['-i', '2'],
    }).then(function (res) {
        console.log(res);
    });
});
```

## Kills the last promise based ping process implementation in the middle

```js
/* Note: only the last ping process called by ping.process.probe will be killed.
*        In above example of list of hosts, since 'yahoo.com' is the last host,
*        this method can terminate only 'yahoo.com' process only.
*/
ping.promise.probeKill()
    .then((res) => {
        console.log(res);
    }).catch((err) => {
        console.log(err);
    });
```

### Support configuration

Below is the possible configuration

```js
/**
 * Cross platform config representation
 * @typedef {Object} PingConfig
 * @property {boolean} numeric - Map IP address to hostname or not
 * @property {number} timeout - Timeout in seconds for each ping request.
 * Behaviour varies between platforms. Check platform ping documentation for more information.
 * @property {number} deadline - Specify a timeout, in seconds, before ping exits regardless of
              how many packets have been sent or received. In this case ping
              does not stop after count packet are sent, it waits either for
              deadline expire or until count probes are answered or for some
              error notification from network. This option is only available on linux and mac.
 * @property {number} min_reply - Exit after sending number of ECHO_REQUEST
 * @property {boolean} v6 - Ping via ipv6 or not. Default is false
 * @property {string} sourceAddr - source address for sending the ping
 * @property {string[]} extra - Optional options does not provided
 */
```

### Output specification

* For callback based implementation:

```js
/**
 * Callback after probing given host
 * @callback probeCallback
 * @param {boolean} isAlive - Whether target is alive or not
 * @param {Object} error - Null if no error occurs
 */
```

* For promise based implementation

```js
/**
 * Parsed response
 * @typedef {object} PingResponse
 * @param {string} host - The input IP address or HOST
 * @param {string} numeric_host - Target IP address
 * @param {boolean} alive - True for existed host
 * @param {string} output - Raw stdout from system ping
 * @param {number} time - Time (float) in ms for first successful ping response
 * @param {Array} times - Array of Time (float) in ms for each ping response
 * @param {string} min - Minimum time for collection records
 * @param {string} max - Maximum time for collection records
 * @param {string} avg - Average time for collection records
 * @param {string} stddev - Standard deviation time for collected records
 */
```

#### Note

* Since `ping` in this module relies on the `ping` from underlying platform,
arguments in `PingConfig.extra` will definitely be varied across different
platforms.

* However, `numeric`, `timeout` and `min_reply` have been abstracted. Values for
them are expected to be cross platform.

* By setting `numeric`, `timeout` or `min_reply` to false, you can run `ping`
without corresponding arguments.

# FAQ

* It does not work with busybox's ping implemetation [#89](https://github.com/danielzzz/node-ping/issues/89)

Try to install package `iputils`. For example, running `apk add iputils`

* For questions regarding to the implementation of `timeout`, and `deadline`, please checkout discussions in #101

# Contributing

Before opening a pull request please make sure your changes follow the
[contribution guidelines][1].

[1]: https://github.com/danielzzz/node-ping/blob/master/CONTRIBUTING.md
