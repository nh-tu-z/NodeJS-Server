module.exports = {
    reconnectPeriod: 1000,
    keepalive: 60,
    clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
    will: {
        topic: 'DEAD-THREAD',
        payload: 'serverdead',
        qos: 1,
        retain: true
    }
}