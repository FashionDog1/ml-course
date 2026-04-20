# 机器学习课程网站

一个基于 Vue 3 + Vite + Tailwind CSS + Supabase 构建的机器学习课程教学平台，提供课程内容展示、作业管理、可视化演示等功能。

## 功能特性

### 📚 课程内容
- 结构化的课程章节展示
- Markdown 格式的课程内容渲染
- 数学公式支持（KaTeX）
- 代码高亮显示

### 📝 作业管理
- **理论作业**：表单提交到 Supabase 数据库
- **编程作业**：集成 GitHub Classroom，提供 Git 操作指南
- **作业提交记录**：查看历史提交和批改状态

### 📊 可视化演示
- 机器学习算法可视化
- 交互式演示工具
- 直观理解算法原理

### 🔐 用户认证
- GitHub OAuth 登录
- 角色权限管理（教师/学生）
- Supabase 安全策略

### 💬 社区互动
- Giscus 评论系统
- GitHub Discussions 集成
- 学生交流讨论

## 技术栈

### 前端框架
- **Vue 3**：使用 Composition API 和 `<script setup>` 语法
- **Vite**：快速的开发服务器和构建工具
- **Vue Router**：单页面应用路由管理

### UI 样式
- **Tailwind CSS**：实用优先的 CSS 框架
- **@tailwindcss/line-clamp**：文本截断插件

### 后端服务
- **Supabase**：开源的 Firebase 替代方案
  - 数据库（PostgreSQL）
  - 认证服务
  - Edge Functions
  - 实时数据库

### 第三方库
- **marked**：Markdown 解析器
- **KaTeX**：数学公式渲染
- **Swiper**：轮播组件
- **@vueuse/core**：Vue 组合式工具函数

## 项目结构

```
ml-course/
├── .github/workflows/       # GitHub Actions 部署配置
├── dist/                     # 构建输出目录
├── public/                   # 静态资源
├── src/
│   ├── assets/              # 资源文件
│   ├── chapters/            # 课程章节内容
│   │   ├── 01-introduction/
│   │   ├── 02-linear-regression/
│   │   └── ...
│   ├── components/          # Vue 组件
│   │   ├── Giscus.vue
│   │   └── GitHubLogin.vue
│   ├── router/              # 路由配置
│   │   └── index.js
│   ├── views/               # 页面组件
│   │   ├── Home.vue
│   │   ├── Chapters.vue
│   │   ├── Chapter.vue
│   │   ├── Assignment.vue
│   │   ├── GitHubAssignments.vue
│   │   ├── GitHubAssignmentDetail.vue
│   │   ├── MySubmissions1.vue
│   │   ├── TeacherMaterials.vue
│   │   ├── Visualization.vue
│   │   └── About.vue
│   ├── App.vue              # 根组件
│   ├── main.js              # 入口文件
│   ├── style.css            # 全局样式
│   └── supabase.js          # Supabase 配置
├── index.html               # HTML 模板
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
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

### 数据库表结构

项目使用以下主要数据表：

- `students`：学生信息
- `assignments`：理论作业
- `assignment_submissions`：作业提交记录
- `github_assignments`：GitHub Classroom 作业配置
- `github_submissions`：编程作业提交记录

### Edge Functions

项目使用以下 Supabase Edge Functions：

- `get-teacher-materials`：获取教师教学材料

## 页面路由

| 路径 | 组件 | 说明 |
|------|------|------|
| `/` | Home.vue | 首页 |
| `/chapters` | Chapters.vue | 课程章节列表 |
| `/chapters/:id/:subId?` | Chapter.vue | 章节详情 |
| `/assignments` | Assignment.vue | 理论作业提交 |
| `/github-assignments` | GitHubAssignments.vue | 编程作业列表 |
| `/github-assignment/:id` | GitHubAssignmentDetail.vue | 编程作业详情 |
| `/my-submissions` | MySubmissions1.vue | 我的提交记录 |
| `/teacher-materials` | TeacherMaterials.vue | 教学材料 |
| `/visualization` | Visualization.vue | 可视化演示 |
| `/about` | About.vue | 关于页面 |

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
import { supabase } from '../supabase'

const { data, error } = await supabase
  .from('table_name')
  .select('*')
```

## 贡献指南

欢迎提交 Issue 和 Pull Request！

## 许可证

© 2026 机器学习课程. 保留所有权利.
