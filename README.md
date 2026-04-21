# 机器学习课程网站

一个基于 Vue 3 + Vite + Tailwind CSS + Supabase 构建的机器学习课程教学平台，提供课程内容展示、作业管理、可视化演示等功能。

## 功能特性

### 📚 课程内容

- 结构化的课程章节展示
- Markdown 格式的课程内容渲染
- 数学公式支持（KaTeX）
- 代码高亮显示

### 📝 作业管理

- **理论作业**：表单提交到 Supabase 数据库，支持附件上传
- **编程作业**：集成 GitHub Classroom，提供 Git 操作指南
- **作业提交记录**：查看历史提交和批改状态，支持分页查看
- **教师批改功能**：支持为理论作业和编程作业添加或修改成绩和评语，批改后可修改成绩和评语
- **理论作业覆盖提交**：支持直接提交新作业或覆盖未批改的已有记录

### 📊 可视化演示

- 机器学习算法可视化
- 交互式演示工具
- 直观理解算法原理

### 🔐 用户认证

- GitHub OAuth 登录
- 角色权限管理（教师/学生）
- Supabase 安全策略
- 用户资料完整性检查

### 📚 教学资料

- 教师可以发布、删除、置顶教学资料
- 学生可以查看所有教学资料
- 支持附件上传

### 💬 社区互动

- Giscus 评论系统
- GitHub Discussions 集成
- 学生交流讨论

### 🛡️ 安全特性

- XSS防护：用户输入内容自动清理
- 速率限制：前端和后端双重限制（学生30秒/次，教师5秒/次）
- 全局错误边界：优雅处理应用错误

### 📱 用户体验

- 移动端响应式设计
- 图片懒加载
- 路由懒加载
- 代码分块优化
- 生产环境构建优化

## 技术栈

### 前端框架

- **Vue 3 (^3.5.25)**：使用 Composition API 和 `<script setup>` 语法
- **Vite (^7.3.1)**：快速的开发服务器和构建工具
- **Vue Router (^5.0.3)**：单页面应用路由管理

### UI 样式

- **Tailwind CSS (^3.4.19)**：实用优先的 CSS 框架
- **Autoprefixer (^10.4.27)**：自动添加浏览器前缀
- **PostCSS (^8.5.6)**：CSS 转换工具

### 后端服务

- **Supabase (@supabase/supabase-js ^2.103.1)**：开源的 Firebase 替代方案
  - 数据库（PostgreSQL）
  - 认证服务
  - Edge Functions
  - 实时数据库
  - 对象存储

### 第三方库

- **marked (^17.0.3)**：Markdown 解析器
- **KaTeX (^0.16.45)**：数学公式渲染
- **Swiper (^12.1.3)**：轮播组件
- **Terser (^5.46.0)**：JavaScript 压缩工具

### 开发工具

- **ESLint (^8.57.0)**：代码质量检查
- **eslint-plugin-vue (^9.30.0)**：Vue 代码规则
- **Prettier (^3.3.3)**：代码格式化

## 项目结构

```
ml-course/
├── .github/workflows/       # GitHub Actions 部署配置
├── dist/                     # 构建输出目录
├── public/                   # 静态资源
├── src/                      # 源代码目录
│   ├── assets/              # 资源文件
│   ├── chapters/            # 课程章节内容
│   │   ├── 01-introduction/
│   │   ├── 02-linear-regression/
│   │   └── ...
│   ├── components/          # Vue 组件
│   │   ├── ErrorBoundary.vue  # 全局错误边界组件
│   │   ├── Giscus.vue         # Giscus 评论系统组件
│   │   ├── GitHubLogin.vue    # GitHub 登录组件
│   │   └── HelloWorld.vue     # 测试组件，用于显示 "Hello World!" 消息
│   ├── router/              # 路由配置
│   │   └── index.js         # 路由配置文件
│   ├── utils/               # 工具函数
│   │   ├── xss.js           # XSS 防护
│   │   └── rateLimit.js     # 速率限制
│   ├── views/               # 页面组件
│   │   ├── Home.vue         # 首页组件
│   │   ├── Chapters.vue     # 课程章节组件
│   │   ├── Chapter.vue      # 课程章节详情组件
│   │   ├── Assignment.vue   # 理论作业提交组件
│   │   ├── GitHubAssignments.vue # GitHub Classroom 编程作业列表组件
│   │   ├── GitHubAssignmentDetail.vue # GitHub Classroom 编程作业详情组件
│   │   ├── MySubmissions1.vue     # 我的提交记录组件
│   │   ├── TeacherMaterials.vue   # 教学资料组件
│   │   ├── Visualization.vue  # 可视化演示组件
│   │   └── About.vue          # 关于组件
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── style.css            # 全局样式
│   └── supabase.js          # Supabase 配置
├── .eslintrc.cjs            # ESLint 配置
├── .prettierrc              # Prettier 配置
├── index.html               # HTML 模板
├── package.json             # 依赖配置
├── vite.config.js           # Vite 配置
├── tailwind.config.js       # Tailwind CSS 配置
└── postcss.config.js        # PostCSS 配置
```

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

创建 `.env` 文件并配置以下变量：

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:5173/ml-course/

### 代码检查和格式化

```bash
# 运行 ESLint 检查并自动修复
npm run lint

# 运行 Prettier 格式化
npm run format
```

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 部署

### GitHub Pages 自动部署

项目已配置 GitHub Actions，当推送到 main 分支时会自动部署到 GitHub Pages。

### 手动部署

构建后，将 `dist` 目录的内容部署到任何静态托管服务。

## Supabase 设置

Supabase Edge Functions 需要在 Dashboard 的 **Secrets** 中配置以下变量：

- `SUPABASE_SERVICE_ROLE_KEY`：用于数据库管理操作
- `GITHUB_TOKEN`：GitHub API 访问令牌
- `CRON_SECRET`：定时任务验证密钥
- `WEBHOOK_SECRET`：GitHub Webhook 签名验证

### 数据库表结构

项目使用以下主要数据表：

- `user_profiles`：用户资料（包含学号、姓名、角色）
- `theory_assignments`：理论作业提交记录（包含成绩和评语）
- `github_assignments`：GitHub Classroom 作业配置
- `github_submissions`：编程作业提交记录（包含成绩和评语）
- `teacher_materials`：教师教学材料（支持置顶功能）

### Edge Functions

项目使用以下 Supabase Edge Functions：

- `get-github-classroom-data`：获取 GitHub Classroom 编程作业列表
- `get-my-submissions`：获取我的编程作业提交记录
- `get-theory-submissions`：获取理论作业提交记录
- `get-teacher-materials`：获取教师教学材料
- `submit-theory-assignment`：提交理论作业
- `github-webhook`：处理 GitHub Classroom 作业提交事件
- `update-submission-grade`：更新作业批改（成绩和评语）
- `toggle-pin-material`：切换教学材料置顶状态
- `delete-teacher-material`：删除教学材料
- 速率限制相关函数

## 页面路由

| 路径                     | 组件                       | 说明         |
| ------------------------ | -------------------------- | ------------ |
| `/`                      | Home.vue                   | 首页         |
| `/chapters`              | Chapters.vue               | 课程章节列表 |
| `/chapters/:id/:subId?`  | Chapter.vue                | 章节详情     |
| `/assignments`           | Assignment.vue             | 理论作业提交 |
| `/github-assignments`    | GitHubAssignments.vue      | 编程作业列表 |
| `/github-assignment/:id` | GitHubAssignmentDetail.vue | 编程作业详情 |
| `/my-submissions`        | MySubmissions1.vue         | 我的提交记录 |
| `/teacher-materials`     | TeacherMaterials.vue       | 教学材料     |
| `/visualization`         | Visualization.vue          | 可视化演示   |
| `/about`                 | About.vue                  | 关于页面     |

## 开发指南

### 添加新章节

1. 在 `src/chapters/` 目录下创建新章节文件夹
2. 在文件夹中创建 Markdown 文件
3. 在章节列表中添加导航链接

### 自定义样式

项目使用 Tailwind CSS，可以直接在组件中使用 Tailwind 类名，或在 `tailwind.config.js` 中自定义配置。

### Supabase 数据查询

使用 `src/supabase.js` 中导出的 `supabase` 客户端进行数据库操作：

```javascript
import { supabase } from '../supabase';

const { data, error } = await supabase.from('table_name').select('*');
```

### 安全编码

- 使用 `validateInput` 清理用户输入，防止 XSS
- 使用 `checkSubmitRateLimit` 限制操作频率
- 所有用户输入都应该经过验证和清理
- 这些工具函数位于 src/utils/xss.js 和 src/utils/rateLimit.js。

## 项目状态

- ✅ 核心功能开发完成
- ✅ 前端代码优化完成
- ✅ JSDoc 注释补充完成
- ✅ ESLint 和 Prettier 配置完成
- 🔄 文档完善中

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

© 2026 计算机专业毕设,仅供学习交流使用,联系邮箱:1290883283@qq.com
