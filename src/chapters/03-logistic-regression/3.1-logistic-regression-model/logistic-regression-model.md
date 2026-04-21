# 3.1 Logistic回归模型

Logistic回归（Logistic Regression）虽然从名字上来看是回归算法，但其实际上是一个分类算法，也被称为Logit回归（Logit Regression）、最大熵分类器（Maximum-Entropy Classification, MaxEnt）。

同线性回归模型类似，Logistic回归首先对输入进行线性组合，得到 $z(\boldsymbol{x}, \boldsymbol{w}) = \boldsymbol{w}^{\mathrm{T}} \boldsymbol{x}$。由于模型输出为样本属于某个类别的概率，我们使用Sigmoid函数 $\sigma(\cdot)$ 将 $z(\boldsymbol{x}, \boldsymbol{w})$ 压缩到 $[0,1]$，用 $\sigma(z(\boldsymbol{x}, \boldsymbol{w}))$ 表示概率分布 $p(y|\boldsymbol{x})$ 的参数。

Sigmoid函数的形式为

$$
\sigma(z) = \frac{1}{1 + \mathrm{e}^{-z}},
$$

其导数为

$$
\frac{\mathrm{d}\sigma}{\mathrm{d}z} = \frac{\mathrm{e}^{-z}}{(1 + \mathrm{e}^{-z})^2} = \sigma(1 - \sigma).
$$

Sigmoid函数呈S型，故也被称为S型函数。

对于两类分类问题，Logistic回归模型为

$$
P(Y = 1|\boldsymbol{x}) = \sigma(z) = \frac{1}{1 + \mathrm{e}^{-z}},
$$

$$
P(Y = 0|\boldsymbol{x}) = 1 - P(Y = 1|\boldsymbol{x}) = \frac{\mathrm{e}^{-z}}{1 + \mathrm{e}^{-z}}.
$$

定义一个事件的概率比（odds）为该事件发生的概率与不发生的概率的比值，在Logistic回归模型中，事件的概率比为

$$
\frac{P(Y = 1|\boldsymbol{x})}{P(Y = 0|\boldsymbol{x})} = \mathrm{e}^{z}.
$$

两边取log运算，得到该事件发生的对数概率比（log odds）为

$$
z = \ln \frac{P(Y = 1|\boldsymbol{x})}{P(Y = 0|\boldsymbol{x})} = \boldsymbol{w}^{\mathrm{T}} \boldsymbol{x}.
$$

所以Logistic回归是对事件发生的对数概率比采用线性回归进行拟合。

当 $z > 0$ 时，$P(Y = 1|\boldsymbol{x}) > P(Y = 0|\boldsymbol{x})$，取最大后验概率，则 $\boldsymbol{x}$ 的类别 $Y = 1$；当 $z < 0$ 时，类别 $Y = 0$；当 $z = 0$ 时，两类概率相等，$\boldsymbol{x}$ 位于决策边界上。

Logistic回归是一个线性分类器，因为决策边界

$$
z(\boldsymbol{x}, \boldsymbol{w}) = \boldsymbol{w}^{\mathrm{T}} \boldsymbol{x} = 0
$$

是 $\boldsymbol{x}$ 的线性组合。

<div style="margin: 10px 0 10px 20px; text-align: center;">
  <iframe src="/ml-course/Logistic-Regression/Logistic-Regression.html" width="800" height="525" frameborder="0" style="border: 1px solid #ddd; border-radius: 4px;"></iframe>
</div>
