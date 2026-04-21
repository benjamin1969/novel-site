# GitHub令牌生成指南

## 步骤1：生成新令牌
1. 访问: https://github.com/settings/tokens
2. 点击 "Generate new token" → "Generate new token (classic)"
3. 填写:
   - Token name: novel-site-deploy-$(date +%Y%m%d)
   - Expiration: No expiration
4. 选择权限:
   - [x] repo (全部权限)
   - [x] workflow
5. 点击 "Generate token"
6. **立即复制令牌**（只显示一次！）

## 步骤2：使用新令牌
```bash
cd /mnt/d/novel-site

# 输入您的新令牌
read -p "请输入新GitHub令牌: " NEW_TOKEN

# 配置远程仓库
git remote remove origin
git remote add origin "https://benjamin1969:${NEW_TOKEN}@github.com/benjamin1969/novel-site.git"

# 推送代码
git push -u origin main

# 验证
echo "✅ 推送完成！"
echo "访问: https://github.com/benjamin1969/novel-site"
```

## 步骤3：验证成功
1. 刷新: https://github.com/benjamin1969/novel-site
2. 确认看到项目文件
3. 确认有提交历史

## 备用方案：SSH密钥
如果令牌不行，使用SSH:
```bash
# 生成SSH密钥
ssh-keygen -t ed25519 -C "snh@263.net"

# 查看公钥
cat ~/.ssh/id_ed25519.pub

# 添加到GitHub: https://github.com/settings/keys
# 然后使用SSH URL
git remote set-url origin git@github.com:benjamin1969/novel-site.git
git push -u origin main
```

## 紧急联系
如果所有方法都失败：
1. 截图错误信息
2. 检查网络连接
3. 尝试不同的浏览器/网络