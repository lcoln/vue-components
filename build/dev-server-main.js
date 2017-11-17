/**
 *
 * @authors linteng (875482941@qq.com)
 * @date    2017-10-10 14:25:40
 */

var cp = require('child_process');
function start(){
  const p = cp.fork(__dirname + '/dev-server.js');
  p.on('message', function(data){
    if(data === 'restart'){
      p.kill('SIGINT');
      start();
    }
  })
}
if(!process.send){
  start();
}