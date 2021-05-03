const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const exec = require('child_process').exec;
const platform = process.argv[2] || process.platform;
const arch = process.argv[3] || process.arch;
const type = process.argv[4] || 'major';
const uploadType =  process.argv[5] || process.argv[4] || false;
const Client = require('scp2').Client;
const cliProgress = require('cli-progress');
const bar1 = new cliProgress.SingleBar({noTTYOutput:true}, cliProgress.Presets.shades_classic);

let sourceDirectory = path.join(__dirname, '../dist');

if (!fs.existsSync(sourceDirectory)) return;

const version = require('../package.json').version;

const destinationDirectory = path.join(__dirname, `../${platform}-${arch}-prod-${version}`);
if (!fs.existsSync(destinationDirectory)) fs.mkdirSync(destinationDirectory);

let result = fs.readFileSync(__dirname+'/server.sh', 'utf8')

result = result.replace(`${replaceVar(result,'BUILD_OS')}`, 'BUILD_OS="' + platform +'"');
result = result.replace(`${replaceVar(result,'ARTCH')}`, 'ARTCH="' + arch +'"');
result = result.replace(`${replaceVar(result,'VERSION')}`, 'VERSION="' + version +'"');
result = result.replace(`${replaceVar(result,'TYPE')}`, 'TYPE="' + type +'"');

fs.writeFileSync(__dirname+'/server.sh', result, 'utf8');

let error;

if(type==='minor'){
  switch (platform) {
    case 'darwin':
      sourceDirectory = path.join(__dirname,'../dist/mac/naxCloud.app/Contents/Resources')
      break;
    case 'win32':
      sourceDirectory = path.join(__dirname,'../dist/win-unpacked/Resources')
      break;
    default:
      break;
  }

  fs.rmdirSync(`${sourceDirectory}/app/node_modules`, { recursive: true });
  fs.rmdirSync(`${sourceDirectory}/app/dist/mac`, { recursive: true });
  fs.rmdirSync(`${sourceDirectory}/app/dist/win-unpacked`, { recursive: true });
  fs.readdirSync(sourceDirectory)
    .filter(fn =>
      fn.startsWith('app') ||
      fn.startsWith('app-update.yml')
    ).forEach(file => {
    const sourcePath = path.join(sourceDirectory, file);
    const destinationPath = path.join(destinationDirectory, file);

    fs.rename(sourcePath, destinationPath, (err) => {
      if (err) error = err;
    });
  });

}
else{
  fs.readdirSync(sourceDirectory)
    .filter(fn =>
      fn.startsWith('naxCloud') ||
      fn.startsWith('latest') ||
      fn.startsWith('builder')
      // fn.endsWith('unpacked')
    ).forEach(file => {
    const sourcePath = path.join(sourceDirectory, file);
    const destinationPath = path.join(destinationDirectory, file);

    fs.rename(sourcePath, destinationPath, (err) => {
      if (err) error = err;
    });
  });
}

if (error) {
  console.log('Files Error:', error);
} else {
  console.log('Successfully moved the files!');
}

console.log('==================== Zipping files ==================');

const output = fs.createWriteStream(`${destinationDirectory}.zip`);
const archive = archiver('zip', { zlib: { level: 9 } /* Sets the compression level */ });
archive
  .directory(`${platform}-${arch}-prod-${version}`, false)
  .on('error', err =>{
    throw err;
  }).pipe(output);
archive.finalize();

output.on('close', () => {
  console.log('==================== Zipping Completed ==================',uploadType);
  if(uploadType==='local'){
    console.log(`==================== Build success please find file  ${path.resolve(`${destinationDirectory}.zip`)} and upload from web ====================`)
    console.log(`==================== Please mention correct version number as file name is presenting ${version} ====================`)
    process.exit(0)
  } else{
    console.log(`==================== Build success for ${platform}-${arch} ====================`)
    console.log(`==================== Uploading to server ${platform}-${arch}-prod-${version}.zip ====================`)
    const upload = new Client({
      host: '202.182.116.72',
      username: 'root',
      password: 'dN#4qHMT6J7qoSho',

    });
    bar1.start(100, 0);
    upload.upload(`./${platform}-${arch}-prod-${version}.zip`, '/var/www/nax_API/_server/uploads/versions/',()=>{
      bar1.update(100);
      bar1.stop();
      console.log("==================== Successfully Uploaded ====================")
      console.log("==================== Logging into server  ====================")
      exec(`rm ./${platform}-${arch}-prod-${version}.zip"`).stdout.pipe(process.stdout);
      if(process.platform === 'win32'){
        return exec(`putty -pw dN#4qHMT6J7qoSho -ssh root@202.182.116.72 -m ./scripts/server.sh`).on('close', () => {
          console.log(`==================== deployment done for ${platform}-${arch}-prod-${version}.zip  ====================`)
          process.exit(0)
        });
      } else{
        return exec(`sshpass -p dN#4qHMT6J7qoSho ssh root@202.182.116.72 bash -s < ./scripts/server.sh`).on('close', () => {
          console.log(`==================== deployment done for ${platform}-${arch}-prod-${version}.zip  ====================`)
          process.exit(0)
        });;
      }
    })
    upload.on('transfer',function(buffer, uploaded, total){
      bar1.update((Math.round((uploaded/total)*100 * 100) / 100));
    })
    upload.on('error', function(err) {
      throw  err;
    });
  }
});

function replaceVar(result , data){
  const found = result.split('\n').filter((e) => {
    return e && e.includes(`${data}=`);
  });
  return found[0];

}
