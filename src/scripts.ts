const spawn = require('child_process').spawn;

const AU = require('ansi_up');
const ansiUp = new AU.default;

module.exports = {
    runE2eTest: (event: any, data: any) => {
        const script = spawn('npm', [
            'run',
            'test-e2e'
        ])

        console.log('PID ' + script.pid)

        script.stdout.on('data', (d: Buffer) => {
            console.log(d.toString())
            event.reply(data.eventName, ansiUp.ansi_to_html(d.toString('utf8')))
        });

        script.stderr.on('data', (err: any) => {
            console.log('stderr: ' + err);
        });

        script.on('exit', (code: any) => {
            console.log('Exit Code: ' + code);
        });
    }
}
