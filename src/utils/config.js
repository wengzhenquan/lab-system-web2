import Env from '../../build/env';

// ajax请求的baseURL
let serviceurl = '';

// 设置上下文，用于编辑器tinymce.baseURL设置，解决编辑器火狐加载失败问题
let context = '';

// 在开发环境模拟一个company为0012912的url,生产环境获取当前url
let loginUrl = '';

// if (Env === "development") {
//   serviceurl = "http://192.168.1.10:9091/api";
//   context = "";
//   loginUrl = "http://192.168.1.10:9091/finance/?company=0012912#/login";
// } else if (Env === "production") {
//   serviceurl = "http://fin.yunduiwang.com/api";
//   context = "/t";
//   loginUrl = window.location.href;
// }

// 域名
const domain = document.domain;
// http 或者 https
const urlHead = document.location.protocol;
// 端口
const port = window.location.port !== '80' ? `:${window.location.port}` : '';

console.log(typeof port);
console.log({ domain, urlHead, port });

if (domain === 'localhost' || domain === '127.0.0.1') {
    // serviceurl = 'http://192.168.1.9:7777/api';
    serviceurl = 'http://localhost:8081';
    // loginUrl = 'http://192.168.1.9:8888/finance/?company=xhjlb#/login';
    // } else if (domain.toLowerCase().indexOf("192.168") >= 0) {
    //   serviceurl = `${urlHead}//${domain}/api${port}`;
    //   context = "/t";
    //   loginUrl = window.location.href;
} else {
    // serviceurl = `${urlHead}//${domain}${port}/api`;
    serviceurl = `http://localhost:8081`;
    context = '/t';
    loginUrl = window.location.href;
}

export default {
    serviceurl,
    context,
    loginUrl
};
