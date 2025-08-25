# Git 工作流程指南

## 📋 概述

本文档描述了IoT管理系统项目的Git工作流程和版本控制最佳实践。

## 🌿 分支策略

### 主要分支

- **master**: 主分支，包含生产就绪的代码
- **develop**: 开发分支，用于集成新功能
- **feature/***: 功能分支，用于开发新功能
- **hotfix/***: 热修复分支，用于紧急修复生产问题
- **release/***: 发布分支，用于准备新版本发布

### 分支命名规范

```
feature/功能名称          # 新功能开发
hotfix/修复描述          # 紧急修复
release/版本号           # 版本发布
bugfix/问题描述          # 问题修复
chore/任务描述           # 维护任务
```

## 📝 提交信息规范

### 提交信息格式

```
<类型>(<范围>): <描述>

[可选的正文]

[可选的脚注]
```

### 提交类型

- **feat**: 新功能
- **fix**: 修复问题
- **docs**: 文档更新
- **style**: 代码格式调整（不影响功能）
- **refactor**: 代码重构
- **test**: 测试相关
- **chore**: 构建过程或辅助工具的变动
- **perf**: 性能优化
- **ci**: CI/CD相关

### 提交信息示例

```bash
# 新功能
git commit -m "feat(auth): 添加JWT认证功能"

# 修复问题
git commit -m "fix(device): 修复设备状态更新问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 重构代码
git commit -m "refactor(user): 重构用户管理模块"
```

## 🏷️ 版本标签规范

### 语义化版本控制

采用 `MAJOR.MINOR.PATCH` 格式：

- **MAJOR**: 不兼容的API修改
- **MINOR**: 向后兼容的功能性新增
- **PATCH**: 向后兼容的问题修正

### 标签示例

```bash
# 正式版本
v1.0.0, v1.1.0, v2.0.0

# 预发布版本
v1.0.0-alpha.1, v1.0.0-beta.1, v1.0.0-rc.1

# 里程碑版本
v1.0-milestone, v2.0-milestone
```

### 创建标签

```bash
# 创建带注释的标签
git tag -a v1.0.0 -m "IoT管理系统 v1.0.0 正式版本"

# 推送标签到远程仓库
git push origin v1.0.0

# 推送所有标签
git push origin --tags
```

## 🔄 工作流程

### 1. 功能开发流程

```bash
# 1. 从develop分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/新功能名称

# 2. 开发功能并提交
git add .
git commit -m "feat: 添加新功能描述"

# 3. 推送到远程仓库
git push origin feature/新功能名称

# 4. 创建Pull Request合并到develop
# 5. 代码审查通过后合并
# 6. 删除功能分支
git branch -d feature/新功能名称
```

### 2. 版本发布流程

```bash
# 1. 从develop创建发布分支
git checkout develop
git pull origin develop
git checkout -b release/v1.1.0

# 2. 更新版本号和发布说明
# 编辑package.json, RELEASE_NOTES.md等文件

# 3. 提交版本更新
git add .
git commit -m "chore: 准备v1.1.0版本发布"

# 4. 合并到master并创建标签
git checkout master
git merge release/v1.1.0
git tag -a v1.1.0 -m "版本v1.1.0发布"

# 5. 合并回develop
git checkout develop
git merge release/v1.1.0

# 6. 推送所有更改
git push origin master
git push origin develop
git push origin v1.1.0

# 7. 删除发布分支
git branch -d release/v1.1.0
```

### 3. 热修复流程

```bash
# 1. 从master创建热修复分支
git checkout master
git pull origin master
git checkout -b hotfix/修复描述

# 2. 修复问题并提交
git add .
git commit -m "fix: 修复紧急问题描述"

# 3. 合并到master并创建补丁版本标签
git checkout master
git merge hotfix/修复描述
git tag -a v1.0.1 -m "热修复v1.0.1"

# 4. 合并到develop
git checkout develop
git merge hotfix/修复描述

# 5. 推送更改
git push origin master
git push origin develop
git push origin v1.0.1

# 6. 删除热修复分支
git branch -d hotfix/修复描述
```

## 📚 常用Git命令

### 基础操作

```bash
# 查看状态
git status

# 查看提交历史
git log --oneline -10

# 查看分支
git branch -a

# 查看标签
git tag -l

# 查看远程仓库
git remote -v
```

### 分支操作

```bash
# 创建并切换分支
git checkout -b 分支名

# 切换分支
git checkout 分支名

# 合并分支
git merge 分支名

# 删除本地分支
git branch -d 分支名

# 删除远程分支
git push origin --delete 分支名
```

### 标签操作

```bash
# 查看标签详情
git show v1.0.0

# 检出标签
git checkout v1.0.0

# 删除本地标签
git tag -d v1.0.0

# 删除远程标签
git push origin --delete v1.0.0
```

## 🔍 代码审查清单

### 提交前检查

- [ ] 代码符合项目编码规范
- [ ] 添加了必要的注释
- [ ] 更新了相关文档
- [ ] 通过了所有测试
- [ ] 没有调试代码和临时文件
- [ ] 提交信息清晰明确

### 合并前检查

- [ ] 功能完整且正常工作
- [ ] 没有破坏现有功能
- [ ] 代码质量符合标准
- [ ] 性能没有明显下降
- [ ] 安全性考虑充分

## 📖 最佳实践

### 提交频率
- 小而频繁的提交优于大而稀少的提交
- 每个提交应该是一个逻辑完整的变更
- 避免混合不相关的修改

### 分支管理
- 保持分支简洁，及时删除已合并的分支
- 定期同步远程分支的更新
- 避免长期存在的功能分支

### 协作规范
- 推送前先拉取最新代码
- 解决冲突时仔细检查
- 重要变更前与团队沟通

## 🚨 注意事项

1. **永远不要**直接在master分支上开发
2. **永远不要**强制推送到共享分支
3. **永远不要**修改已推送的提交历史
4. **始终**在合并前进行代码审查
5. **始终**保持提交信息的清晰和一致性

---

**文档版本**: v1.0  
**最后更新**: 2025年1月15日  
**维护者**: IoT管理系统开发团队