<template>
  <div class="container mx-auto px-4 py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Breadcrumb -->
      <div class="text-sm text-gray-500 mb-6">
        <router-link to="/" class="hover:text-blue-600">首页</router-link> / 
        <router-link to="/chapters" class="hover:text-blue-600">课程章节</router-link> / 
        <span class="font-medium">{{ chapterTitle }}</span>
      </div>

      <!-- Chapter Content -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6 mb-8">
        <h1 class="text-3xl font-bold mb-6">{{ chapterTitle }}</h1>
        <div v-if="content" v-html="renderedContent" class="prose max-w-none"></div>
        <div v-else class="text-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p class="text-gray-600">加载中...</p>
        </div>
      </div>

      <!-- Navigation Buttons -->
      <div class="flex justify-between items-center mb-8">
        <router-link 
          :to="prevLink" 
          :disabled="!prevLink"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ prevText }}
        </router-link>
        <router-link 
          to="/chapters" 
          class="px-4 py-2 bg-blue-100 hover:bg-blue-200 rounded-md text-blue-800"
        >
          返回目录
        </router-link>
        <router-link 
          :to="nextLink" 
          :disabled="!nextLink"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ nextText }}
        </router-link>
      </div>

      <!-- Giscus Comments -->
      <div class="bg-white rounded-lg shadow-md border border-gray-100 p-6">
        <h2 class="text-2xl font-bold mb-4">讨论</h2>
        <Giscus />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { marked } from 'marked';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Giscus from '../components/Giscus.vue';

// 配置marked，启用GFM并使用katex渲染数学公式
marked.setOptions({
  gfm: true,
  breaks: true,       // 支持换行符转<br>
  headerIds: true,    // 标题自动生成id
  mangle: false,      // 避免邮箱地址被爬虫
});

// 添加数学公式扩展
marked.use({
  extensions: [
    {
      name: 'math',
      level: 'inline',
      start(src) {
        return src.indexOf('$');
      },
      tokenizer(src, tokens) {
        // 改进正则表达式，确保能够匹配包含LaTeX命令的公式
        const match = src.match(/^\$([^$]+?)\$/);
        if (match) {
          return {
            type: 'math',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        try {
          return katex.renderToString(token.text, {
            throwOnError: false,
            fleqn: false,
            trust: true
          });
        } catch (error) {
          console.error('KaTeX error:', error);
          return token.raw;
        }
      }
    },
    {
      name: 'math-block',
      level: 'block',
      start(src) {
        return src.indexOf('\\[');
      },
      tokenizer(src, tokens) {
        // 改进正则表达式，确保能够匹配包含LaTeX命令的块级公式
        const match = src.match(/^\\\[([\s\S]+?)\\\]/);
        if (match) {
          return {
            type: 'math-block',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        try {
          return `<div class="math-block">${katex.renderToString(token.text, {
            throwOnError: false,
            displayMode: true,
            fleqn: false,
            trust: true
          })}</div>`;
        } catch (error) {
          console.error('KaTeX error:', error);
          return token.raw;
        }
      }
    },
    {
      name: 'latex-math',
      level: 'inline',
      start(src) {
        // 匹配以\begin{math}或\begin{equation}开始的公式
        return Math.min(
          src.indexOf('\\begin{math}') === -1 ? Infinity : src.indexOf('\\begin{math}'),
          src.indexOf('\\begin{equation}') === -1 ? Infinity : src.indexOf('\\begin{equation}')
        );
      },
      tokenizer(src, tokens) {
        const mathMatch = src.match(/^\\begin\{math\}([\s\S]+?)\\end\{math\}/);
        const equationMatch = src.match(/^\\begin\{equation\}([\s\S]+?)\\end\{equation\}/);
        
        if (mathMatch) {
          return {
            type: 'latex-math',
            raw: mathMatch[0],
            text: mathMatch[1]
          };
        } else if (equationMatch) {
          return {
            type: 'latex-math',
            raw: equationMatch[0],
            text: equationMatch[1]
          };
        }
      },
      renderer(token) {
        try {
          return katex.renderToString(token.text, {
            throwOnError: false,
            fleqn: false,
            trust: true
          });
        } catch (error) {
          console.error('KaTeX error:', error);
          return token.raw;
        }
      }
    },
    {
      // 支持 \( ... \) 格式的行内公式
      name: 'latex-inline-paren',
      level: 'inline',
      start(src) {
        return src.indexOf('\\(');
      },
      tokenizer(src, tokens) {
        const match = src.match(/^\\\(([\s\S]+?)\\\)/);
        if (match) {
          return {
            type: 'latex-inline-paren',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        try {
          return katex.renderToString(token.text, {
            throwOnError: false,
            fleqn: false,
            trust: true
          });
        } catch (error) {
          console.error('KaTeX error:', error);
          return token.raw;
        }
      }
    },
    {
      // 支持 $$ ... $$ 格式的块级公式
      name: 'latex-block-dollar',
      level: 'block',
      start(src) {
        return src.indexOf('$$');
      },
      tokenizer(src, tokens) {
        const match = src.match(/^\$\$([\s\S]+?)\$\$/);
        if (match) {
          return {
            type: 'latex-block-dollar',
            raw: match[0],
            text: match[1]
          };
        }
      },
      renderer(token) {
        try {
          return `<div class="math-block">${katex.renderToString(token.text, {
            throwOnError: false,
            displayMode: true,
            fleqn: false,
            trust: true
          })}</div>`;
        } catch (error) {
          console.error('KaTeX error:', error);
          return token.raw;
        }
      }
    }
  ]
});

const route = useRoute();
const router = useRouter();
const content = ref('');
const chapterId = computed(() => route.params.id);
const subchapterId = computed(() => route.params.subId);

// 章节数据结构
const chaptersData = [
  {
    id: 'introduction',
    title: '第1章 机器学习简介',
    subchapters: [
      { id: 'what-is-ml', title: '1.1 什么是机器学习' },
      { id: 'ml-history', title: '1.2 机器学习简史' },
      { 
        id: 'ml-task-types', 
        title: '1.3 机器学习任务的类型',
        subchapters: [
          { id: 'supervised-learning', title: '1.3.1 监督学习' },
          { id: 'unsupervised-learning', title: '1.3.2 无监督学习' }
        ]
      },
      { id: 'ml-steps', title: '1.4 机器学习项目的一般步骤' },
      { 
        id: 'model-evaluation', 
        title: '1.5 模型评估',
        subchapters: [
          { id: 'cross-validation', title: '1.5.1 交叉验证' },
          { id: 'hyperparameter-tuning', title: '1.5.2 超参数调优' }
        ]
      },
      { id: 'chapter-summary-1', title: '1.6 本章小结' },
      { id: 'exercises-1', title: '1.7 习题' }
    ]
  },
  {
    id: 'linear-regression',
    title: '第2章 线性回归',
    subchapters: [
      { id: 'linear-regression-intro', title: '2.1 线性回归简介' },
      { 
        id: 'linear-regression-objective', 
        title: '2.2 线性回归模型的目标函数',
        subchapters: [
          { id: 'regression-loss', title: '2.2.1 回归模型的损失函数' },
          { id: 'linear-regression-regularization', title: '2.2.2 线性回归模型的正则函数' }
        ]
      },
      { 
        id: 'linear-regression-optimization', 
        title: '2.3 线性回归模型的优化求解',
        subchapters: [
          { id: 'analytical-solution', title: '2.3.1 解析求解法' },
          { id: 'gradient-descent', title: '2.3.2 梯度下降法' },
          { id: 'coordinate-descent', title: '2.3.3 坐标轴下降法' }
        ]
      },
      { id: 'regression-metrics', title: '2.4 回归任务的性能指标' },
      { id: 'linear-regression-tuning', title: '2.5 线性回归模型的超参数调优' },
      { id: 'case-study-1', title: '2.6 案例分析1：广告费用与销量预测' },
      { id: 'case-study-2', title: '2.7 案例分析2：共享单车骑行量预测' },
      { id: 'chapter-summary-2', title: '2.8 本章小结' },
      { id: 'exercises-2', title: '2.9 习题' }
    ]
  },
  {
    id: 'logistic-regression',
    title: '第3章 Logistic回归',
    subchapters: [
      { id: 'logistic-regression-model', title: '3.1 Logistic回归模型' },
      { id: 'logistic-regression-objective', title: '3.2 Logistic回归模型的目标函数' },
      { 
        id: 'logistic-regression-optimization', 
        title: '3.3 Logistic回归目标函数优化求解',
        subchapters: [
          { id: 'logistic-gradient-descent', title: '3.3.1 梯度下降法' },
          { id: 'newton-method', title: '3.3.2 牛顿法' },
          { id: 'quasi-newton', title: '3.3.3 拟牛顿法' }
        ]
      },
      { id: 'multi-class-classification', title: '3.4 多类分类任务' },
      { id: 'classification-metrics', title: '3.5 分类任务的性能指标' },
      { 
        id: 'imbalanced-classification', 
        title: '3.6 数据不均衡分类问题',
        subchapters: [
          { id: 'resampling', title: '3.6.1 重采样' },
          { id: 'cost-sensitive-learning', title: '3.6.2 代价敏感学习' }
        ]
      },
      { id: 'case-study-3', title: '3.7 案例分析：奥拓商品分类' },
      { id: 'chapter-summary-3', title: '3.8 本章小结' },
      { id: 'exercises-3', title: '3.9 习题' }
    ]
  },
  {
    id: 'svm',
    title: '第4章 SVM',
    subchapters: [
      { 
        id: 'svm-basic', 
        title: '4.1 SVM的基本型',
        subchapters: [
          { id: 'maximum-margin', title: '4.1.1 最大间隔' },
          { id: 'svm-dual', title: '4.1.2 SVM的对偶问题' }
        ]
      },
      { id: 'svm-slack', title: '4.2 带松弛因子的SVM' },
      { id: 'hinge-loss', title: '4.3 合页损失函数' },
      { 
        id: 'kernel-methods', 
        title: '4.4 核方法',
        subchapters: [
          { id: 'kernel-trick', title: '4.4.1 核技巧' },
          { id: 'kernel-construction', title: '4.4.2 核函数构造' }
        ]
      },
      { 
        id: 'smo', 
        title: '4.5 SVM优化求解：SMO',
        subchapters: [
          { id: 'smo-principle', title: '4.5.1 SMO算法原理' },
          { id: 'smo-pruning', title: '4.5.2 对原始解进行修剪' },
          { id: 'smo-alpha-selection', title: '4.5.3 α选择' },
          { id: 'smo-intercept', title: '4.5.4 更新截距项b' },
          { id: 'smo-summary', title: '4.5.5 SMO小结' }
        ]
      },
      { 
        id: 'support-vector-regression', 
        title: '4.6 支持向量回归',
        subchapters: [
          { id: 'epsilon-insensitive-loss', title: '4.6.1 ε不敏感损失函数' },
          { id: 'svr', title: '4.6.2 支持向量回归' }
        ]
      },
      { id: 'case-study-4', title: '4.7 案例分析1：奥拓商品分类' },
      { id: 'case-study-5', title: '4.8 案例分析2：共享单车骑行量预测' },
      { id: 'chapter-summary-4', title: '4.9 本章小结' },
      { id: 'exercises-4', title: '4.10 习题' }
    ]
  },
  {
    id: 'generative-classifiers',
    title: '第5章 生成式分类器',
    subchapters: [
      { id: 'generative-classifiers-intro', title: '5.1 生成式分类器' },
      { 
        id: 'bayes-rule', 
        title: '5.2 贝叶斯规则',
        subchapters: [
          { id: 'bayes-formula', title: '5.2.1 贝叶斯公式' },
          { id: 'naive-bayes', title: '5.2.2 朴素贝叶斯分类器' },
          { id: 'naive-bayes-training', title: '5.2.3 朴素贝叶斯分类器的训练' },
          { id: 'case-study-6', title: '5.2.4 案例分析1：奥拓商品分类' },
          { id: 'case-study-7', title: '5.2.5 案例分析2：新闻分类' }
        ]
      },
      { 
        id: 'gaussian-discriminant-analysis', 
        title: '5.3 高斯判别分析',
        subchapters: [
          { id: 'gda-principle', title: '5.3.1 高斯判别分析的基本原理' },
          { id: 'gda-training', title: '5.3.2 高斯判别分析的模型训练' },
          { id: 'case-study-8', title: '5.3.3 案例分析3：MNIST手写数字识别' }
        ]
      },
      { id: 'chapter-summary-5', title: '5.4 本章小结' },
      { id: 'exercises-5', title: '5.5 习题' }
    ]
  },
  {
    id: 'decision-trees',
    title: '第6章 决策树',
    subchapters: [
      { id: 'decision-trees-principle', title: '6.1 决策树基本原理' },
      { 
        id: 'tree-construction', 
        title: '6.2 建树',
        subchapters: [
          { id: 'id3-c45', title: '6.2.1 ID3和C4.5' },
          { id: 'cart', title: '6.2.2 CART' }
        ]
      },
      { id: 'pruning', title: '6.3 剪枝' },
      { id: 'early-stopping', title: '6.4 提前终止' },
      { id: 'case-study-9', title: '6.5 案例分析1：蘑菇分类' },
      { id: 'case-study-10', title: '6.6 案例分析2：共享单车骑行量预测' },
      { id: 'chapter-summary-6', title: '6.7 本章小结' },
      { id: 'exercises-6', title: '6.8 习题' }
    ]
  },
  {
    id: 'ensemble-learning',
    title: '第7章 集成学习',
    subchapters: [
      { 
        id: 'bias-variance-decomposition', 
        title: '7.1 误差的偏差-方差分解',
        subchapters: [
          { id: 'point-estimation-bias-variance', title: '7.1.1 点估计的偏差-方差分解' },
          { id: 'prediction-error-bias-variance', title: '7.1.2 预测误差的偏差-方差分解' }
        ]
      },
      { id: 'bagging', title: '7.2 Bagging' },
      { 
        id: 'random-forest', 
        title: '7.3 随机森林',
        subchapters: [
          { id: 'random-forest-principle', title: '7.3.1 随机森林的基本原理' },
          { id: 'case-study-11', title: '7.3.2 案例分析：奥拓商品分类' }
        ]
      },
      { id: 'gradient-boosting', title: '7.4 梯度提升' },
      { 
        id: 'xgboost', 
        title: '7.5 XGBoost',
        subchapters: [
          { id: 'xgboost-principle', title: '7.5.1 XGBoost基本原理' },
          { id: 'xgboost-optimization', title: '7.5.2 XGBoost优化' },
          { id: 'xgboost-guide', title: '7.5.3 XGBoost使用指南' },
          { id: 'case-study-12', title: '7.5.4 案例分析：奥拓商品分类' }
        ]
      },
      { 
        id: 'lightgbm', 
        title: '7.6 LightGBM',
        subchapters: [
          { id: 'histogram-based-tree', title: '7.6.1 基于直方图的决策树构造算法' },
          { id: 'histogram-acceleration-goss', title: '7.6.2 直方图加速：基于梯度的单边采样算法' },
          { id: 'histogram-acceleration-efb', title: '7.6.3 直方图加速：互斥特征捆绑算法' },
          { id: 'discrete-features', title: '7.6.4 支持离散型特征' },
          { id: 'leaf-wise-growth', title: '7.6.5 带深度限制的按叶子生长策略' },
          { id: 'case-study-13', title: '7.6.6 案例分析：奥拓商品分类' }
        ]
      },
      { id: 'model-fusion', title: '7.7 融合' },
      { id: 'chapter-summary-7', title: '7.8 本章小结' },
      { id: 'exercises-7', title: '7.9 习题' }
    ]
  },
  {
    id: 'neural-network-structures',
    title: '第8章 神经网络结构',
    subchapters: [
      { id: 'neuron-structure', title: '8.1 神经元的基本结构' },
      { id: 'feedforward-nn', title: '8.2 前馈全连接神经网络' },
      { 
        id: 'cnn', 
        title: '8.3 卷积神经网络',
        subchapters: [
          { id: 'convolutional-layer', title: '8.3.1 卷积层' },
          { id: 'pooling-layer', title: '8.3.2 池化层' },
          { id: 'alexnet', title: '8.3.3 CNN示例：AlexNet' }
        ]
      },
      { 
        id: 'rnn', 
        title: '8.4 循环神经网络',
        subchapters: [
          { id: 'simple-rnn', title: '8.4.1 简单循环神经网络' },
          { id: 'lstm', title: '8.4.2 长短时记忆网络' }
        ]
      },
      { id: 'residual-network', title: '8.5 残差神经网络' },
      { id: 'dropout', title: '8.6 丢弃法' },
      { id: 'chapter-summary-8', title: '8.7 本章小结' },
      { id: 'exercises-8', title: '8.8 习题' }
    ]
  },
  {
    id: 'deep-learning-training',
    title: '第9章 深度神经模型训练',
    subchapters: [
      { 
        id: 'backpropagation', 
        title: '9.1 梯度计算：反向传播',
        subchapters: [
          { id: 'chain-rule', title: '9.1.1 微积分中的链式法则' },
          { id: 'computation-graph-backprop', title: '9.1.2 计算图和反向传播' },
          { id: 'dnn-backprop', title: '9.1.3 DNN的反向传播算法' },
          { id: 'dnn-computation-graph', title: '9.1.4 DNN的计算图' },
          { id: 'cnn-backprop', title: '9.1.5 CNN的反向传播算法' },
          { id: 'rnn-backprop', title: '9.1.6 循环神经网络的反向传播算法' }
        ]
      },
      { id: 'activation-functions', title: '9.2 激活函数' },
      { 
        id: 'optimization-algorithms', 
        title: '9.3 深度学习中的优化算法',
        subchapters: [
          { id: 'momentum', title: '9.3.1 动量法' },
          { id: 'adaptive-learning-rate', title: '9.3.2 自适应学习率' }
        ]
      },
      { id: 'weight-initialization', title: '9.4 权重初始化' },
      { id: 'overfitting-reduction', title: '9.5 减弱过拟合策略' },
      { id: 'case-study-14', title: '9.6 案例分析：MNIST手写数字识别' },
      { id: 'chapter-summary-9', title: '9.7 本章小结' },
      { id: 'exercises-9', title: '9.8 习题' }
    ]
  },
  {
    id: 'dimensionality-reduction',
    title: '第10章 降维',
    subchapters: [
      { id: 'pca', title: '10.1 主成分分析' },
      { id: 'autoencoder', title: '10.2 自编码器' },
      { id: 'mds', title: '10.3 多维缩放' },
      { id: 'isomap', title: '10.4 等度量映射' },
      { id: 'lle', title: '10.5 局部线性嵌入' },
      { id: 'laplacian-eigenmaps', title: '10.6 拉普拉斯特征映射' },
      { id: 't-sne', title: '10.7 基于T分布的随机邻域嵌入' },
      { id: 'case-study-15', title: '10.8 案例分析：MNIST数据集' },
      { id: 'chapter-summary-10', title: '10.9 本章小结' },
      { id: 'exercises-10', title: '10.10 习题' }
    ]
  },
  {
    id: 'clustering',
    title: '第11章 聚类',
    subchapters: [
      { 
        id: 'clustering-metrics', 
        title: '11.1 聚类算法的性能指标',
        subchapters: [
          { id: 'external-metrics', title: '11.1.1 外部指标' },
          { id: 'internal-metrics', title: '11.1.2 内部指标' }
        ]
      },
      { id: 'similarity-measures', title: '11.2 相似性度量' },
      { id: 'k-means', title: '11.3 K均值聚类' },
      { id: 'gmm', title: '11.4 高斯混合模型' },
      { 
        id: 'hierarchical-clustering', 
        title: '11.5 层次聚类',
        subchapters: [
          { id: 'agglomerative-clustering', title: '11.5.1 凝聚式层次聚类' },
          { id: 'divisive-clustering', title: '11.5.2 分裂式层次聚类' }
        ]
      },
      { id: 'mean-shift', title: '11.6 均值漂移聚类' },
      { id: 'dbscan', title: '11.7 DBSCAN' },
      { id: 'density-peak-clustering', title: '11.8 基于密度峰值的聚类' },
      { id: 'deep-learning-clustering', title: '11.9 基于深度学习的聚类' },
      { id: 'case-study-16', title: '11.10 案例分析：MNIST数据集聚类' },
      { id: 'chapter-summary-11', title: '11.11 本章小结' },
      { id: 'exercises-11', title: '11.12 习题' }
    ]
  }
];

// 计算当前章节和子章节的索引
const currentChapterIndex = computed(() => {
  return chaptersData.findIndex(chapter => chapter.id === chapterId.value);
});

// 扁平化子章节列表，排除拥有三级标题的二级标题
const flattenedSubchapters = computed(() => {
  const chapter = chaptersData[currentChapterIndex.value];
  if (!chapter) return [];
  
  const flattened = [];
  chapter.subchapters.forEach(subchapter => {
    if (subchapter.subchapters && subchapter.subchapters.length > 0) {
      // 如果是拥有三级标题的二级标题，将其三级标题添加到扁平化列表
      subchapter.subchapters.forEach(subsubchapter => {
        flattened.push({
          ...subsubchapter,
          parentId: subchapter.id
        });
      });
    } else {
      // 否则直接添加二级标题
      flattened.push(subchapter);
    }
  });
  return flattened;
});

const currentSubchapterIndex = computed(() => {
  if (!subchapterId.value) return -1;
  return flattenedSubchapters.value.findIndex(subchapter => subchapter.id === subchapterId.value);
});

// 计算前一个链接和文本
const prevLink = computed(() => {
  const chapterIdx = currentChapterIndex.value;
  const subchapterIdx = currentSubchapterIndex.value;
  const flattened = flattenedSubchapters.value;
  
  if (chapterIdx === 0 && subchapterIdx === 0) {
    // 第一章第一节，没有上一章
    return null;
  }
  
  const currentChapter = chaptersData[chapterIdx];
  
  if (subchapterIdx > 0) {
    // 当前章节的非第一节，返回上一节
    const prevSubchapter = flattened[subchapterIdx - 1];
    return `/chapters/${currentChapter.id}/${prevSubchapter.id}`;
  } else {
    // 当前章节的第一节，返回上一章的最后一节
    if (chapterIdx > 0) {
      const prevChapter = chaptersData[chapterIdx - 1];
      // 计算上一章的扁平化子章节列表
      const prevFlattened = [];
      prevChapter.subchapters.forEach(subchapter => {
        if (subchapter.subchapters && subchapter.subchapters.length > 0) {
          subchapter.subchapters.forEach(subsubchapter => {
            prevFlattened.push(subsubchapter);
          });
        } else {
          prevFlattened.push(subchapter);
        }
      });
      const lastSubchapter = prevFlattened[prevFlattened.length - 1];
      return `/chapters/${prevChapter.id}/${lastSubchapter.id}`;
    }
  }
  
  return null;
});

const prevText = computed(() => {
  const chapterIdx = currentChapterIndex.value;
  const subchapterIdx = currentSubchapterIndex.value;
  
  if (chapterIdx === 0 && subchapterIdx === 0) {
    return '上一章';
  }
  
  if (subchapterIdx === 0) {
    return '上一章';
  } else {
    return '上一节';
  }
});

// 计算后一个链接和文本
const nextLink = computed(() => {
  const chapterIdx = currentChapterIndex.value;
  const subchapterIdx = currentSubchapterIndex.value;
  const currentChapter = chaptersData[chapterIdx];
  const flattened = flattenedSubchapters.value;
  
  if (!currentChapter) return null;
  
  if (subchapterIdx < flattened.length - 1) {
    // 当前章节的非最后一节，返回下一节
    const nextSubchapter = flattened[subchapterIdx + 1];
    return `/chapters/${currentChapter.id}/${nextSubchapter.id}`;
  } else {
    // 当前章节的最后一节，返回下一章的第一节
    if (chapterIdx < chaptersData.length - 1) {
      const nextChapter = chaptersData[chapterIdx + 1];
      // 计算下一章的扁平化子章节列表
      const nextFlattened = [];
      nextChapter.subchapters.forEach(subchapter => {
        if (subchapter.subchapters && subchapter.subchapters.length > 0) {
          subchapter.subchapters.forEach(subsubchapter => {
            nextFlattened.push(subsubchapter);
          });
        } else {
          nextFlattened.push(subchapter);
        }
      });
      const firstSubchapter = nextFlattened[0];
      return `/chapters/${nextChapter.id}/${firstSubchapter.id}`;
    }
  }
  
  return null;
});

const nextText = computed(() => {
  const chapterIdx = currentChapterIndex.value;
  const subchapterIdx = currentSubchapterIndex.value;
  const flattened = flattenedSubchapters.value;
  
  if (!flattened.length) return '下一章';
  
  if (subchapterIdx === flattened.length - 1) {
    return '下一章';
  } else {
    return '下一节';
  }
});

const chapterTitle = computed(() => {
  // 章节标题映射
  const chapterTitles = {
    introduction: '第1章 机器学习简介',
    'linear-regression': '第2章 线性回归',
    'logistic-regression': '第3章 Logistic回归',
    svm: '第4章 SVM',
    'generative-classifiers': '第5章 生成式分类器',
    'decision-trees': '第6章 决策树',
    'ensemble-learning': '第7章 集成学习',
    'neural-network-structures': '第8章 神经网络结构',
    'deep-learning-training': '第9章 深度神经模型训练',
    'dimensionality-reduction': '第10章 降维',
    clustering: '第11章 聚类'
  };
  
  // 子章节标题映射
  const subchapterTitles = {
    overview: '导学',
    basics: '机器学习基本概念',
    applications: '机器学习应用场景',
    workflow: '机器学习工作流程',
    'simple-linear': '简单线性回归',
    'multiple-linear': '多元线性回归',
    evaluation: '模型评估',
    implementation: '线性回归实现',
    'logistic-regression': '逻辑回归',
    'decision-trees': '决策树',
    'k-nearest': 'K近邻算法',
    'model-selection': '模型选择与评估',
    perceptron: '感知机',
    backpropagation: '反向传播算法',
    cnn: '卷积神经网络',
    rnn: '循环神经网络',
    transformer: 'Transformer',
    applications: '深度学习应用'
  };
  
  if (subchapterId.value) {
    const subchapterTitle = subchapterTitles[subchapterId.value];
    if (subchapterTitle) {
      return `${chapterTitles[chapterId.value]} - ${subchapterTitle}`;
    }
  }
  return chapterTitles[chapterId.value] || '章节内容';
});

const renderedContent = computed(() => {
  return marked(content.value);
});

async function loadChapter() {
  try {
    // 检查subchapterId是否对应拥有三级标题的二级标题
    const chapter = chaptersData[currentChapterIndex.value];
    if (chapter && subchapterId.value) {
      const subchapter = chapter.subchapters.find(sub => sub.id === subchapterId.value);
      if (subchapter && subchapter.subchapters && subchapter.subchapters.length > 0) {
        // 如果是拥有三级标题的二级标题，显示错误信息
        content.value = '# 章节不存在\n\n该章节是一个包含子章节的容器，不能直接访问。请从章节列表中选择具体的子章节。';
        return;
      }
    }
    
    // 使用import.meta.glob加载Markdown文件
    const markdownFiles = import.meta.glob('../chapters/**/*.md', { query: '?raw', import: 'default' });
    let filePath;
    
    if (subchapterId.value) {
      // 新的文件结构：章节文件夹/二级标题文件夹/文件名.md
      // 需要找到正确的二级标题文件夹
      const chapter = chaptersData[currentChapterIndex.value];
      let subchapterFolder = '';
      
      if (chapter) {
        // 查找二级标题对应的新文件夹名称
        for (const subchapter of chapter.subchapters) {
          if (subchapter.id === subchapterId.value) {
            // 构建二级标题文件夹名称：章节号.序号-标题ID
            const chapterNum = chapter.id.match(/^\\d+/) || [''];
            const subchapterMatch = subchapter.title.match(/^(\\d+\\.\\d+)/);
            if (subchapterMatch) {
              subchapterFolder = `${subchapterMatch[1]}-${subchapter.id}`;
            } else {
              subchapterFolder = subchapter.id;
            }
            break;
          }
          // 检查是否是三级标题
          if (subchapter.subchapters) {
            for (const subsubchapter of subchapter.subchapters) {
              if (subsubchapter.id === subchapterId.value) {
                const subchapterMatch = subsubchapter.title.match(/^(\\d+\\.\\d+\\.\\d+)/);
                if (subchapterMatch) {
                  subchapterFolder = `${subchapterMatch[1]}-${subsubchapter.id}`;
                } else {
                  subchapterFolder = subsubchapter.id;
                }
                break;
              }
            }
          }
        }
      }
      
      if (subchapterFolder) {
        filePath = `../chapters/${chapterId.value}/${subchapterFolder}/${subchapterId.value}.md`;
      } else {
        // 尝试直接在章节文件夹下查找（向后兼容）
        filePath = `../chapters/${chapterId.value}/${subchapterId.value}.md`;
      }
    } else {
      filePath = `../chapters/${chapterId.value}.md`;
    }
    
    if (markdownFiles[filePath]) {
      content.value = await markdownFiles[filePath]();
    } else {
      // 如果找不到，尝试其他可能的路径
      let found = false;
      for (const [path, loader] of Object.entries(markdownFiles)) {
        if (path.includes(`/${subchapterId.value}.md`)) {
          content.value = await loader();
          found = true;
          break;
        }
      }
      if (!found) {
        content.value = '# 章节不存在\n\n该章节内容尚未添加。';
      }
    }
  } catch (error) {
    console.error('加载章节失败:', error);
    content.value = '# 加载失败\n\n章节内容加载失败，请稍后重试。';
  }
}

// 监听路由参数变化，重新加载章节内容
watch([chapterId, subchapterId], () => {
  loadChapter();
});

onMounted(() => {
  loadChapter();
});
</script>

<style scoped>
.prose {
  line-height: 1.6;
}

.prose h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
}

.prose p {
  margin-bottom: 1rem;
}

.prose ul,
.prose ol {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}

.prose code {
  background-color: #f3f4f6;
  padding: 0.2rem 0.4rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.prose pre {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.375rem;
  overflow-x: auto;
  margin-bottom: 1rem;
}

.prose pre code {
  background-color: transparent;
  padding: 0;
}

.prose table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.prose th,
.prose td {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  text-align: left;
}

.prose th {
  background-color: #f3f4f6;
  font-weight: 600;
}

.prose tr:nth-child(even) {
  background-color: #f9fafb;
}

.prose blockquote {
  border-left: 4px solid #e5e7eb;
  padding-left: 1rem;
  margin-left: 0;
  margin-bottom: 1rem;
  color: #6b7280;
  font-style: italic;
}

.math-block {
  margin: 1.5rem 0;
  text-align: center;
}
</style>