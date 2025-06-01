const { execSync, spawnSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

function detectCommand(cmds) {
  for (const cmd of cmds) {
    try {
      spawnSync(cmd, ['--version'], { stdio: 'ignore' });
      return cmd;
    } catch (e) {}
  }
  return null;
}

const runtimes = {
  node: detectCommand(['bun', 'node']),
  rust: detectCommand(['rustc']),
  c: detectCommand(['gcc']),
  dart: detectCommand(['dart'])
};

function run(code, lang) {
  const tmpDir = fs.mkdtempSync(path.join(process.cwd(), 'tmp-'));
  let file;
  let command;
  switch (lang) {
    case 'typescript':
    case 'javascript':
      file = path.join(tmpDir, 'script.js');
      fs.writeFileSync(file, code);
      command = `${runtimes.node} ${file}`;
      break;
    case 'rust':
      file = path.join(tmpDir, 'main.rs');
      fs.writeFileSync(file, code);
      execSync(`${runtimes.rust} ${file} -o ${tmpDir}/main`, { stdio: 'inherit' });
      command = `${tmpDir}/main`;
      break;
    case 'c':
      file = path.join(tmpDir, 'main.c');
      fs.writeFileSync(file, code);
      execSync(`${runtimes.c} ${file} -o ${tmpDir}/main`, { stdio: 'inherit' });
      command = `${tmpDir}/main`;
      break;
    case 'dart':
      file = path.join(tmpDir, 'main.dart');
      fs.writeFileSync(file, code);
      command = `${runtimes.dart} ${file}`;
      break;
    case 'html':
      file = path.join(tmpDir, 'index.html');
      fs.writeFileSync(file, code);
      command = `xdg-open ${file}`;
      break;
    default:
      throw new Error('Unsupported language');
  }
  const output = execSync(command, { encoding: 'utf8' });
  fs.rmSync(tmpDir, { recursive: true, force: true });
  return output;
}

window.services = {
  runCode: run,
  getRuntimes: () => runtimes
};
