     1|     1|# GitHub Actions 自动部署指南
     2|     2|
     3|     3|## 🚀 概述
     4|     4|此工作流会自动将您的Next.js小说平台部署到Cloudflare Pages。每次推送到main分支或手动触发时，都会自动构建和部署。
     5|     5|
     6|     6|## 🔧 配置要求
     7|     7|
     8|     8|### 1. GitHub Secrets 配置
     9|     9|在GitHub仓库设置中，添加以下Secrets：
    10|    10|
    11|    11|| Secret名称 | 值 | 说明 |
    12|    12||------------|-----|------|
    13|    13|| `CLOUDFLARE_API_TOKEN` | `[CLOUDFLARE_API_TOKEN]` | Cloudflare API令牌 |
    14|    14|| `CLOUDFLARE_ACCOUNT_ID` | `[CLOUDFLARE_ACCOUNT_ID]` | Cloudflare账户ID |
    15|    15|| `GITHUB_TOKEN` | (自动提供) | GitHub Actions令牌 |
    16|    16|
    17|    17|### 2. 配置步骤
    18|    18|1. 访问您的GitHub仓库：https://github.com/benjamin1969/novel-site
    19|    19|2. 点击 **Settings** → **Secrets and variables** → **Actions**
    20|    20|3. 点击 **New repository secret**
    21|    21|4. 添加上述两个Secrets
    22|    22|
    23|    23|## 📋 工作流步骤
    24|    24|
    25|    25|### 阶段1: 构建
    26|    26|1. **检出代码** - 从GitHub获取最新代码
    27|    27|2. **设置Node.js环境** - 使用Node.js 18
    28|    28|3. **安装依赖** - 使用`npm ci`安装所有依赖
    29|    29|4. **构建Next.js应用** - 运行`npm run build`
    30|    30|
    31|    31|### 阶段2: 部署
    32|    32|1. **配置Pages** - 准备Pages部署环境
    33|    33|2. **上传构建产物** - 上传构建后的文件
    34|    34|3. **部署到Cloudflare Pages** - 使用Cloudflare Pages Action部署
    35|    35|4. **输出部署信息** - 显示部署URL和状态
    36|    36|
    37|    37|### 阶段3: 测试（可选）
    38|    38|1. **测试API连接** - 验证Cloudflare Worker API是否正常
    39|    39|2. **测试网站访问** - 验证网站是否可访问
    40|    40|
    41|    41|## 🎯 触发条件
    42|    42|
    43|    43|### 自动触发
    44|    44|- **推送代码**到main或master分支
    45|    45|- **创建Pull Request**到main或master分支
    46|    46|
    47|    47|### 手动触发
    48|    48|1. 访问GitHub仓库的 **Actions** 标签页
    49|    49|2. 选择 **Deploy to Cloudflare Pages** 工作流
    50|    50|3. 点击 **Run workflow** 按钮
    51|    51|4. 选择分支并点击 **Run workflow**
    52|    52|
    53|    53|## 🌐 部署URL
    54|    54|
    55|    55|### 生产环境
    56|    56|- **主网站**: https://novel-platform-f3a.pages.dev
    57|    57|- **API服务**: https://novel-platform-api.sunlongyun1030.workers.dev
    58|    58|
    59|    59|### 预览环境
    60|    60|每次Pull Request都会创建独立的预览环境：
    61|    61|- **预览URL**: https://<deployment-id>.novel-platform-f3a.pages.dev
    62|    62|
    63|    63|## 🔍 故障排除
    64|    64|
    65|    65|### 常见问题
    66|    66|
    67|    67|#### 1. 构建失败
    68|    68|**症状**: `npm run build` 失败
    69|    69|**解决方案**:
    70|    70|- 检查Node.js版本兼容性
    71|    71|- 验证依赖包版本
    72|    72|- 查看构建日志中的具体错误
    73|    73|
    74|    74|#### 2. 部署失败
    75|    75|**症状**: Cloudflare Pages部署失败
    76|    76|**解决方案**:
    77|    77|- 验证Cloudflare API令牌权限
    78|    78|- 检查账户ID是否正确
    79|    79|- 确认项目名称`novel-platform`存在
    80|    80|
    81|    81|#### 3. API连接失败
    82|    82|**症状**: 网站无法连接到Cloudflare Worker API
    83|    83|**解决方案**:
    84|    84|- 验证Cloudflare Worker是否正常运行
    85|    85|- 检查环境变量`NEXT_PUBLIC_API_URL`配置
    86|    86|- 测试API端点直接访问
    87|    87|
    88|    88|### 查看日志
    89|    89|1. 访问GitHub仓库的 **Actions** 标签页
    90|    90|2. 点击具体的运行记录
    91|    91|3. 查看各步骤的详细日志
    92|    92|
    93|    93|## ⚙️ 环境变量
    94|    94|
    95|    95|### 构建时环境变量
    96|    96|| 变量名 | 值 | 说明 |
    97|    97||--------|-----|------|
    98|    98|| `NEXT_PUBLIC_API_URL` | `https://novel-platform-api.sunlongyun1030.workers.dev` | Cloudflare Worker API地址 |
    99|    99|| `NODE_ENV` | `production` | 生产环境标识 |
   100|   100|
   101|   101|### Cloudflare Pages环境变量
   102|   102|在Cloudflare Pages控制台中配置：
   103|   103|1. 登录Cloudflare Dashboard
   104|   104|2. 进入 **Workers & Pages** → **Pages** → **novel-platform**
   105|   105|3. 点击 **Settings** → **Environment variables**
   106|   106|4. 添加以下变量：
   107|   107|   - `NEXT_PUBLIC_API_URL`: `https://novel-platform-api.sunlongyun1030.workers.dev`
   108|   108|   - `NODE_ENV`: `production`
   109|   109|
   110|   110|## 📊 监控和通知
   111|   111|
   112|   112|### 部署状态通知
   113|   113|工作流完成后会显示：
   114|   114|- ✅ 成功：绿色勾号
   115|   115|- ❌ 失败：红色叉号
   116|   116|- ⚠️ 取消：黄色警告
   117|   117|
   118|   118|### 部署信息
   119|   119|每次部署都会输出：
   120|   120|- **部署ID**: 唯一标识符
   121|   121|- **部署URL**: 生产环境URL
   122|   122|- **预览URL**: 预览环境URL（如适用）
   123|   123|- **环境**: 部署环境类型
   124|   124|
   125|   125|## 🔄 回滚操作
   126|   126|
   127|   127|如果需要回滚到之前的版本：
   128|   128|1. 在Cloudflare Pages控制台中查看部署历史
   129|   129|2. 选择要恢复的版本
   130|   130|3. 点击 **Promote to production**
   131|   131|
   132|   132|## 📞 支持
   133|   133|
   134|   134|如有问题，请检查：
   135|   135|1. GitHub Actions日志
   136|   136|2. Cloudflare Pages部署日志
   137|   137|3. Cloudflare Worker日志
   138|   138|
   139|   139|或联系技术支持。