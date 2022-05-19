const { spawn, exec, spawnSync } = require('child_process')
const ls = spawn('D:/安装工具/Git/git-bash.exe', ['./test.sh'])

ls.stdout.on('data', (data) => {
    console.log('正常输出')
    console.log(data.toString())
    console.log('~~~~~~~~~~~~~~')
})

ls.stderr.on('error', (data) => {
    console.log('错误输出')
    console.log(data.toString())
    console.log('-----------------')
})

ls.on('close', (code) => {
    console.log(`子进程退出：${code}`)
})

// exec('node a.js', (err, stdout, stderr) => {
//     if (err) {
//         console.error(`发生了错误：${err}`)
//         return
//     }

//     console.log(`stdout: ${stdout.toString()}`)
//     console.log(`stderr: ${stderr}`)
// })