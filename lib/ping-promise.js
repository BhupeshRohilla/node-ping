'use strict';

/**
* LICENSE MIT
* (C) Daniel Zelisko
* http://github.com/danielzzz/node-ping
*
* a simple wrapper for ping
* Now with support of not only english Windows.
*
*/

// System library
var util = require('util');
var cp = require('child_process');
var os = require('os');

// 3rd-party library
var Q = require('q');
var __ = require('underscore');

// Our library
var builderFactory = require('./builder/factory');
var parserFactory = require('./parser/factory');

// Ping instance.
var ping = null;

/**
 * Class::PromisePing
 *
 * @param {string} addr - Hostname or ip addres
 * @param {PingConfig} config - Configuration for command ping
 * @return {Promise}
 */
function probe(addr, config) {
    // Do not reassign function argument
    var _config = config || {};

    // Convert callback base system command to promise base
    var deferred = Q.defer();

    // Spawn a ping process
    var platform = os.platform();
    try {
        var argumentBuilder = builderFactory.createBuilder(platform);
        ping = cp.spawn(
            builderFactory.getExecutablePath(platform, _config.v6),
            argumentBuilder.getResult(addr, _config)
        );
    } catch (err) {
        deferred.reject(err);
        // ping = null;
        return deferred.promise;
    }

    // Initial parser
    var parser = parserFactory.createParser(platform, _config);

    // Register events from system ping
    ping.once('error', function () {
        var err = new Error(
            util.format(
                'ping.probe: %s. %s',
                'there was an error while executing the ping program. ',
                'Check the path or permissions...'
            )
        );
        deferred.reject(err);
        // ping = null;
    });

    // Cache all lines from the system ping
    var outstring = [];
    ping.stdout.on('data', function (data) {
        outstring.push(String(data));
    });

    // Parse lines we have on closing system ping
    ping.once('close', function () {
        // Merge lines we have and split it by \n
        var lines = outstring.join('').split('\n');

        // Parse line one by one
        __.each(lines, parser.eat, parser);

        // Get result
        var ret = parser.getResult();

        deferred.resolve(ret);
        // ping = null;
    });

    return deferred.promise;
}

/**
 * Kills ping.process.probe in the middle.
 *
 * @description Only the last ping process called by ping.process.probe will be killed.
 * @return {Promise}
 */
function probeKill(){

    // Convert callback base system command to promise base
    var deferred = Q.defer();

    // Check if there is a process running
    if(ping == null){
        var err = new Error(
            util.format(
                'Ping process not running!!'
            )
        );
        deferred.reject(err);
    }else{
        // Try to kill ping process
        try{
            ping.kill();
            var res = 'Ping process killed!';
            // ping.disconnect();
            // var res = 'Ping process killed!';
            deferred.resolve(res);
        }catch(err){
            deferred.reject(err);
            return deferred.promise;
        }
    }
    return deferred.promise;
}

exports.probe = probe;
exports.probeKill = probeKill;
