export const htmlTemplate = `

<!DOCTYPE html>
<html lang="zh-Hans">
<head>
 <meta charset="UTF-8">
 <title>{{ title }}</title>
 <style>
  /* 设置页面样式 */
  body {
   background-color: #f7f7f7;
   font-family: Arial, sans-serif;
   margin: 0;
   padding: 0;
  }
  .container {
   max-width: 600px;
   margin: 0 auto;
   padding: 20px;
  }
  h1 {
   font-size: 36px;
   margin-bottom: 30px;
   text-align: center;
  }
  input[type="text"] {
   padding: 10px;
   font-size: 16px;
   border-radius: 4px;
   border: none;
   width: 80%;
   margin-right: 10px;
  }
  .btn {
   padding: 10px 20px;
   font-size: 16px;
   border-radius: 4px;
   border: none;
   background-color: #007bff;
   color: #fff;
   cursor: pointer;
  }
  .btn:hover {
   background-color: #0062cc;
  }
  .footer {
   background-color: #444;
   color: #fff;
   padding: 10px;
   text-align: center;
   position: fixed;
   bottom: 0;
   left: 0;
   width: 100%;
  }
  .note {
   margin-top: 30px;
   font-size: 14px;
   line-height: 1.5;
   color: #8c8b8b;
  }
  .note pre {
   background-color: #f7f7f7;
   margin: 10px 0;
  }
 </style>
</head>
<body>
<div class="container">
 <h1>文件下载</h1>
 <form>
  <input type="text" autofocus placeholder="输入 Github 链接">
  <button class="btn" type="submit">下载</button>
 </form>

 <div class="note">
  <h2>PS:</h2>
  <p>GitHub 文件链接带不带协议头都可以，支持 release、archive 以及文件，右键复制出来的链接都是符合标准的。</p>
  <p>注意，不支持项目文件夹</p>
  <p>支持非 GitHub 的文件下载、图片加速（不支持表单提交方式）</p>
  <h3>输入合法示例：</h3>
  <pre>分支源码：https://github.com/repo/project/archive/master.zip</pre>
  <pre>tag 源码：https://github.com/repo/project/archive/v0.1.0.tar.gz</pre>
  <pre>分支文件：https://github.com/repo/project/blob/master/filename</pre>
  <pre>tag 文件：https://github.com/repo/project/releases/download/v0.1.0/example.zip</pre>
  <pre>非 GitHub 图片加速显示：https://gh.zhaojun.im/https://xxx.com/logo.png</pre>
  <pre>非 GitHub 文件加速下载：https://gh.zhaojun.im/https://xxx.com/example.zip</pre>
 </div>
</div>



<div class="footer">
 由 Cloudflare Workers 支持
</div>

<script>
 const form = document.querySelector('form');
 form.addEventListener('submit', function(event) {
  event.preventDefault();
  const input = document.querySelector('input[type="text"]');
  const url = input.value.trim();
  const origin = window.location.origin;
  window.location.href = origin + '/' + url;
 });
</script>
</body>
</html>
`
