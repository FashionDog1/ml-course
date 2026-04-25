# 11.3 K均值聚类

&emsp;&emsp; $ K $ 均值（$ K $-means）聚类是最常用的聚类算法。虽然其性能不一定好，但是速度快，这是因为其只须计算样本点和簇中心之间的距离，具有线性复杂度 $ O(N) $。

&emsp;&emsp; $ K $均值聚类的基本思想是将样本划分到离其最近的簇中，以迭代方式实现，如算法 11-1 所示。

## &emsp;&emsp;**算法 11-1：$ K $均值聚类**

&emsp;&emsp;**输入**：
&emsp;&emsp;训练样本: $ D = {x_1, x_2, \cdots, x_N} $；\
&emsp;&emsp;簇的数目：$ K $。

&emsp;&emsp;**输出**：\
&emsp;&emsp;每个簇中心 $ \mu_1, \cdots, \mu_K $；\
&emsp;&emsp;每个样本所属的簇标记矩阵 $ R $；\
&emsp;&emsp;每个簇的样本集合 $ c_1, \cdots, c_K $。

&emsp;&emsp;**步骤**：
&emsp;&emsp;**（1）选择 $ K $ 个点作为初始质心：$ \mu_1, \cdots, \mu_K $**
&emsp;&emsp;**（2）重复以下过程：**

- &emsp;&emsp;&emsp;&emsp;**①指派步骤**：将每个点指派到离其最近的质心，形成 $ K $ 个簇；
  $$
  \lambda_i = \arg\min_k \text{dist}(x_i, \mu_k)
  $$
  $$
  \left\{\begin{matrix}
  r_{i,k} = 1,\quad k = \lambda_i  \\
  r_{i,k} = 0,\quad k \neq \lambda_i
  \end{matrix}\right.
  $$
- &emsp;&emsp;&emsp;&emsp;**②更新步骤**：重新计算每个簇的质心:
  $$
  \mu\_k = \frac{\sum\_{i=1}^N r\_{i,k} x\_i}{\sum\_{i=1}^N r\_{i,k}}；
  $$
  &emsp;&emsp;直到簇不发生变化或达到最大迭代次数。<p style="text-align:center;color:green;">**[k-means算法可视化（naftaliharris网站）](https://www.naftaliharris.com/blog/visualizing-k-means-clustering/)**</p>

<div style="margin: 10px 0 10px 20px; text-align: center;">
  <iframe src="/ml-course/k-means/k-means.html" width="100%" height="535" frameborder="0" style="border: 1px solid #ddd; border-radius: 4px;"></iframe>
</div>
