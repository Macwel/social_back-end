module.exports = {
    apps: [{
        name: 'api',
        script: 'src/index.ts',
        watch: '.',
        exec_mode: "cluster"
    }],
    interpreter: "ts-node",
    interpreter_args: "",
};