# RSS.Beauty 部署指南：Docker 与 Node.js 双剑合璧

> 作者：[墨凡君]
> 发布时间：2025-01-02

大家好！今天我要为大家介绍一个非常棒的开源项目 —— RSS.Beauty。这是一个能让 RSS 阅读体验焕然一新的工具，它可以将普通的 RSS/Atom 订阅源转换成精美的阅读界面。

## 项目简介

RSS.Beauty 是基于 XSLT 技术开发的 RSS 美化工具，主要特性包括：

- 🎨 精美的阅读界面设计
- 🔄 支持 RSS 2.0 和 Atom 1.0 格式
- 📱 响应式设计，完美支持移动端
- 🔌 一键订阅到主流 RSS 阅读器
- 🖥 支持多种部署方式

## 技术栈

项目采用现代化的前端技术栈：

- Astro 作为主框架
- React 构建用户界面
- TailwindCSS 实现样式设计
- XSLT 处理 RSS 转换

## 部署方案

今天我们主要介绍两种部署方式：Docker 部署和 Node.js 部署。这两种方式各有特色，大家可以根据自己的需求选择合适的方案。

### 方案一：Docker 部署（简单快捷）

Docker 部署是最简单的方式，只需要两条命令即可完成：

```bash
# 拉取镜像
docker pull ghcr.io/ccbikai/rss.beauty:main

# 运行容器
docker run -d --name rss-beauty -p 4321:4321 ghcr.io/ccbikai/rss.beauty:main
```

部署完成后，访问 `http://localhost:4321` 即可看到网站。

### 方案二：Node.js 部署（灵活可控）

相比 Docker 部署，Node.js 部署更加轻量级，而且便于定制和调试。下面是详细的步骤：

#### 1. 环境准备

首先确保你的系统已安装以下软件：

```bash
# 检查 Node.js 版本（需要 18.0.0 或更高）
node --version

# 检查 pnpm 版本（需要 9.15.2 或更高）
pnpm --version
```

如果没有安装，可以：
- Node.js：从 [Node.js 官网](https://nodejs.org/) 下载安装
- pnpm：运行 `npm install -g pnpm` 安装

#### 2. 获取代码

```bash
# 克隆项目
git clone https://github.com/ccbikai/RSS.Beauty.git

# 进入项目目录
cd RSS.Beauty
```

#### 3. 安装依赖

```bash
# 安装项目依赖
pnpm install
```

#### 4. 配置部署环境

项目的 `astro.config.mjs` 文件已经包含了 Node.js 适配器的配置，无需修改。如果你好奇的话，可以查看文件中的这些配置：

```javascript
// 这些是已有的配置，无需修改
const providers = {
  // ... 其他适配器
  node: node({
    mode: 'standalone',
  }),
}

export default defineConfig({
  adapter: providers[adapterProvider] || providers.node,  // 默认使用 node 适配器
  // ...
})
```

#### 5. 构建项目

```bash
# 构建项目
pnpm build
```

#### 6. 启动服务

```bash
# 使用 Node.js 运行构建后的项目
node ./dist/server/entry.mjs
```

现在你可以访问 `http://localhost:4321` 来查看你的网站了！

#### 7. 生产环境部署

对于生产环境，建议使用 PM2 来管理 Node.js 进程：

```bash
# 安装 PM2
npm install -g pm2

# 使用 PM2 启动服务
pm2 start ./dist/server/entry.mjs --name "rss-beauty"

# 设置开机自启
pm2 startup
pm2 save
```

## 部署建议

1. **选择建议**
   - 如果你不熟悉 Node.js 或追求快速部署，选择 Docker 方案
   - 如果你需要更多定制性或更轻量级的部署，选择 Node.js 方案

2. **性能优化**
   - 建议配置 Nginx 反向代理
   - 可以启用 HTTPS
   - 考虑使用 CDN 加速静态资源

3. **注意事项**
   - 确保服务器防火墙开放相应端口
   - 定期更新依赖包以修复安全问题
   - 做好日志管理和监控

## 使用指南

部署完成后，RSS.Beauty 提供了三种使用方式，让您轻松美化任何 RSS 订阅源：

### 1. 在线使用方式

直接访问您部署的服务（例如 `http://your-domain.com` 或 `http://localhost:4321`），在首页输入任意 RSS 订阅源的 URL，即可立即预览美化后的效果。

### 2. 为自己的 RSS 源添加样式

如果您是 RSS 源的发布者，可以通过以下步骤为您的 RSS 源添加 RSS.Beauty 的样式：

1. 下载样式文件
   - RSS 2.0 格式：访问 `http://your-domain.com/rss.xsl` 下载
   - Atom 格式：访问 `http://your-domain.com/atom.xsl` 下载

2. 将样式文件放在您的静态资源目录中（注意：必须与 RSS 源在同一域名下）

3. 在您的 RSS 文件头部添加以下代码（在 `<?xml ... ?>` 之后）：
   ```xml
   <!-- RSS 2.0 格式使用这个 -->
   <?xml-stylesheet type="text/xsl" href="/path/to/rss.xsl"?>
   
   <!-- Atom 格式使用这个 -->
   <?xml-stylesheet type="text/xsl" href="/path/to/atom.xsl"?>
   ```

### 3. Base64 编码方式

如果您无法将样式文件放在服务器上，可以使用 Base64 编码方式：

1. 在网页上选择 "Base64" 选项卡
2. 复制对应格式（RSS 或 Atom）的样式引用代码
3. 将复制的代码放在您的 RSS/Atom 文件的 `<?xml ...?>` 声明之后，例如：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="data:text/xsl;base64,PD94bWw..."?>
<rss version="2.0">
  ...
</rss>
```

这种方式的优点是不需要额外托管样式文件，样式代码直接嵌入在 RSS 文件中。

### 4. 在线转换方式

如果您想直接美化任何 RSS 源，可以使用在线转换方式：

1. 访问您的服务地址：`http://your-domain.com/rss?url=YOUR_RSS_URL`
   例如：`http://your-domain.com/rss?url=https://example.com/feed.xml`

2. 系统会自动获取并美化该 RSS 源的内容

这种方式特别适合：
- 无法修改原始 RSS 源的情况
- 想要快速预览美化效果
- 分享美化后的 RSS 源给他人

### 使用示例

1. 美化 GitHub 项目的 Release 订阅源：
   ```
   http://your-domain.com/rss?url=https://github.com/username/project/releases.atom
   ```

2. 美化个人博客的 RSS 源：
   ```
   http://your-domain.com/rss?url=https://your-blog.com/feed.xml
   ```

### 注意事项

1. 跨域限制
   - 如果使用样式文件方式，XSL 文件必须与 RSS 源在同一域名下
   - 使用 Base64 或在线方式则没有此限制

2. 性能考虑
   - Base64 方式会增加服务器负载，建议配置适当的缓存策略
   - 对于高流量网站，建议将样式文件放在 CDN 上

3. 兼容性
   - 支持所有主流的 RSS 阅读器
   - 支持移动端浏览器
   - 支持 RSS 2.0 和 Atom 1.0 格式

### 自定义样式

如果您想要自定义样式，可以：

1. 修改 `src/xsl/partials` 目录下的模板文件
2. 修改 `src/app.css` 文件中的样式
3. 重新构建项目：`pnpm build`

## Node.js 部署步骤

### 1. 最小化部署文件

将以下必要文件复制到服务器：
```bash
dist/                 # 构建后的主要文件
package.json         # 包含依赖信息
pnpm-lock.yaml      # 锁定依赖版本
```

### 2. 安装依赖

```bash
# 安装 pnpm（如果服务器上没有）
npm install -g pnpm

# 安装生产环境依赖（跳过安装脚本以避免 git hooks 相关错误）
pnpm install --prod --ignore-scripts
```

### 3. 配置网络访问

有两种方式配置服务监听地址：

#### 方式一：直接使用环境变量（推荐）

```bash
# 启动服务并监听所有网络接口
HOST=0.0.0.0 node ./dist/server/entry.mjs

# 如果需要同时指定端口
HOST=0.0.0.0 PORT=4321 node ./dist/server/entry.mjs
```

#### 方式二：使用 PM2 管理（生产环境推荐）

1. 安装 PM2：
```bash
npm install -g pm2
```

2. 创建 PM2 配置文件 `ecosystem.config.js`：
```javascript
module.exports = {
  apps: [{
    name: "rss-beauty",
    script: "./dist/server/entry.mjs",
    instances: "max",         // 使用所有 CPU 核心
    exec_mode: "cluster",     // 使用集群模式
    env: {
      NODE_ENV: "production",
      HOST: "0.0.0.0",       // 监听所有网络接口
      PORT: 4321             // 指定端口
    }
  }]
}
```

3. 启动服务：
```bash
pm2 start ecosystem.config.js
```

4. 设置开机自启（可选）：
```bash
pm2 startup
pm2 save
```

### 4. 访问服务

- 本地访问：`http://localhost:4321`
- 局域网访问：`http://你的局域网IP:4321`
  - 例如：`http://192.168.1.100:4321`

### 注意事项

1. **安全考虑**
   - 确保服务器防火墙已正确配置
   - 如果不需要局域网访问，建议保持默认的 localhost
   - 生产环境建议使用反向代理（如 Nginx）

2. **性能优化**
   - 使用 PM2 的集群模式可以充分利用多核 CPU
   - 建议配置适当的缓存策略

3. **故障排查**
   - 如果无法访问，检查防火墙设置
   - 确认服务器的 4321 端口是否开放
   - 检查环境变量是否正确设置

4. **Nginx 配置示例**

如果使用 Nginx 作为反向代理，配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:4321;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```


## 结语

RSS.Beauty 是一个非常实用的工具，无论你选择哪种部署方式，都能轻松搭建起自己的 RSS 美化服务。如果你在部署过程中遇到任何问题，欢迎在评论区留言，我们一起讨论解决。

## 相关链接

- 项目地址：[https://github.com/ccbikai/RSS.Beauty](https://github.com/ccbikai/RSS.Beauty)
- 在线演示：[https://rss.beauty](https://rss.beauty)
