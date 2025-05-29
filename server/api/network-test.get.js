import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execPromise = promisify(exec);

export default defineEventHandler(async (event) => {
  try {
    const results = {};
    
    // Проверка доступности порта 8080
    try {
      const { stdout: netstatOutput } = await execPromise('netstat -an | grep 8080');
      results.netstat = netstatOutput.trim().split('\n');
    } catch (error) {
      results.netstat = { error: error.message };
    }
    
    // Проверка Docker контейнеров
    try {
      const { stdout: dockerOutput } = await execPromise('docker ps');
      results.dockerContainers = dockerOutput.trim().split('\n');
    } catch (error) {
      results.dockerContainers = { error: error.message };
    }
    
    // Проверка Docker сетей
    try {
      const { stdout: dockerNetworkOutput } = await execPromise('docker network ls');
      results.dockerNetworks = dockerNetworkOutput.trim().split('\n');
    } catch (error) {
      results.dockerNetworks = { error: error.message };
    }
    
    // Пинг до различных хостов
    const hosts = ['localhost', 'host.docker.internal', 'docker.for.mac.localhost'];
    results.ping = {};
    
    for (const host of hosts) {
      try {
        const { stdout: pingOutput } = await execPromise(`ping -c 1 ${host}`);
        results.ping[host] = pingOutput.trim().split('\n');
      } catch (error) {
        results.ping[host] = { error: error.message };
      }
    }
    
    // Проверка curl к различным URL
    const urls = [
      'http://localhost:8080/posts',
      'http://host.docker.internal:8080/posts',
      'http://docker.for.mac.localhost:8080/posts'
    ];
    results.curl = {};
    
    for (const url of urls) {
      try {
        const { stdout: curlOutput } = await execPromise(`curl -s -I ${url}`);
        results.curl[url] = curlOutput.trim().split('\n');
      } catch (error) {
        results.curl[url] = { error: error.message };
      }
    }
    
    return {
      message: 'Результаты проверки сетевых соединений',
      timestamp: new Date().toISOString(),
      results
    };
  } catch (error) {
    console.error('Ошибка при проверке сетевых соединений:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Ошибка при проверке сетевых соединений',
      data: { error: error.message }
    });
  }
}); 