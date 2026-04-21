     1|     1|#!/bin/bash
     2|     2|
     3|     3|# GitHub Secrets 配置脚本
     4|     4|# 此脚本指导如何配置GitHub Secrets以启用自动部署
     5|     5|
     6|     6|set -e
     7|     7|
     8|     8|echo "🚀 GitHub Secrets 配置指南"
     9|     9|echo "=========================="
    10|    10|echo ""
    11|    11|
    12|    12|echo "📋 需要配置的Secrets:"
    13|    13|echo "1. CLOUDFLARE_API_TOKEN"
    14|    14|echo "2. CLOUDFLARE_ACCOUNT_ID"
    15|    15|echo ""
    16|    16|
    17|    17|echo "🔑 Secret 值:"
    18|    18|echo "----------------------------------------"
    19|    19|echo "CLOUDFLARE_API_TOKEN: [CLOUDFLARE_API_TOKEN]"
    20|    20|echo "CLOUDFLARE_ACCOUNT_ID: [CLOUDFLARE_ACCOUNT_ID]"
    21|    21|echo "----------------------------------------"
    22|    22|echo ""
    23|    23|
    24|    24|echo "📝 配置步骤:"
    25|    25|echo "1. 访问 https://github.com/benjamin1969/novel-site"
    26|    26|echo "2. 点击 'Settings' (右上角齿轮图标)"
    27|    27|echo "3. 左侧菜单选择 'Secrets and variables' → 'Actions'"
    28|    28|echo "4. 点击 'New repository secret'"
    29|    29|echo "5. 输入Name和Value，点击 'Add secret'"
    30|    30|echo ""
    31|    31|
    32|    32|echo "✅ 配置完成后，工作流将自动:"
    33|    33|echo "   - 监听main分支的推送"
    34|    34|echo "   - 自动构建Next.js应用"
    35|    35|echo "   - 部署到Cloudflare Pages"
    36|    36|echo "   - 测试API和网站连接"
    37|    37|echo ""
    38|    38|
    39|    39|echo "🔍 验证配置:"
    40|    40|echo "1. 推送代码到main分支:"
    41|    41|echo "   git add ."
    42|    42|echo "   git commit -m '测试自动部署'"
    43|    43|echo "   git push origin main"
    44|    44|echo ""
    45|    45|echo "2. 查看GitHub Actions状态:"
    46|    46|echo "   https://github.com/benjamin1969/novel-site/actions"
    47|    47|echo ""
    48|    48|
    49|    49|echo "🌐 部署成功后访问:"
    50|    50|echo "   - 网站: https://novel-platform-f3a.pages.dev"
    51|    51|echo "   - API: https://novel-platform-api.sunlongyun1030.workers.dev"
    52|    52|echo ""
    53|    53|
    54|    54|echo "📞 故障排除:"
    55|    55|echo "1. 检查GitHub Actions日志"
    56|    56|echo "2. 验证Secrets是否正确配置"
    57|    57|echo "3. 确认Cloudflare账户权限"
    58|    58|echo ""
    59|    59|
    60|    60|echo "🎉 配置完成！您的网站现在支持自动部署了。"