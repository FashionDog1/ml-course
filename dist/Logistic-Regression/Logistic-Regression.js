// ─────────────────────────────────────────────
// Logistic Regression — interactive decision boundary
// ─────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('logreg-canvas');
    if (!canvas) return;
    const { ctx, W, H } = MLViz.setupCanvas(canvas);

    let pts = [];
    let addingClass = 0;
    let w = [0, 0], b = 0;

    function sigmoid(z) { return 1 / (1 + Math.exp(-z)); }

    function trainStep() {
        if (pts.length < 4) return;
        const lr = 0.1;
        const n = pts.length;
        let dw = [0, 0], db = 0;
        for (const p of pts) {
            const z = w[0] * p.x + w[1] * p.y + b;
            const pred = sigmoid(z);
            const err = pred - p.label;
            dw[0] += err * p.x;
            dw[1] += err * p.y;
            db += err;
        }
        w[0] -= lr * dw[0] / n;
        w[1] -= lr * dw[1] / n;
        b -= lr * db / n;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        // Decision boundary background
        if (pts.length >= 4) {
            for (let py = 0; py < H; py += 6) {
                for (let px = 0; px < W; px += 6) {
                    const nx = px / W, ny = py / H;
                    const z = w[0] * nx + w[1] * ny + b;
                    const prob = sigmoid(z);
                    ctx.fillStyle = prob > 0.5
                        ? `rgba(108,99,255,${(prob - 0.5) * 0.3})`
                        : `rgba(247,102,111,${(0.5 - prob) * 0.3})`;
                    ctx.fillRect(px, py, 6, 6);
                }
            }
            // Decision boundary line
            if (Math.abs(w[1]) > 0.001) {
                ctx.beginPath();
                // w[0]*x + w[1]*y + b = 0 => y = -(w[0]*x + b)/w[1]
                const y0 = -(w[0] * 0 + b) / w[1];
                const y1 = -(w[0] * 1 + b) / w[1];
                ctx.moveTo(0, y0 * H);
                ctx.lineTo(W, y1 * H);
                ctx.strokeStyle = 'rgba(255,255,255,0.6)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }
        // Points
        for (const p of pts) {
            const cx = p.x * W, cy = p.y * H;
            ctx.beginPath();
            if (p.label === 0) {
                ctx.arc(cx, cy, 6, 0, Math.PI * 2);
                ctx.fillStyle = '#f7666f88';
                ctx.fill();
                ctx.strokeStyle = '#f7666f';
            } else {
                ctx.moveTo(cx, cy - 8);
                ctx.lineTo(cx - 7, cy + 6);
                ctx.lineTo(cx + 7, cy + 6);
                ctx.closePath();
                ctx.fillStyle = '#6c63ff88';
                ctx.fill();
                ctx.strokeStyle = '#6c63ff';
            }
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }
        // Hint text if no points
        if (pts.length === 0) {
            ctx.fillStyle = 'rgba(255,255,255,0.3)';
            ctx.font = '14px Inter';
            ctx.textAlign = 'center';
            ctx.fillText('点击添加积分 · 选择类别按钮上方', W / 2, H / 2);
        }
        const acc = computeAccuracy();
        document.getElementById('logreg-info').textContent =
            `${pts.length}积分 | 准确率: ${pts.length > 0 ? (acc * 100).toFixed(0) + '%' : '—'}`;
    }

    function computeAccuracy() {
        if (pts.length === 0) return 0;
        let correct = 0;
        for (const p of pts) {
            const z = w[0] * p.x + w[1] * p.y + b;
            if ((sigmoid(z) > 0.5 ? 1 : 0) === p.label) correct++;
        }
        return correct / pts.length;
    }

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width;
        const ny = (e.clientY - rect.top) / rect.height;
        pts.push({ x: nx, y: ny, label: addingClass });
        for (let i = 0; i < 20; i++) trainStep();
        draw();
    });

    let trainInterval = setInterval(() => { trainStep(); draw(); }, 80);

    document.getElementById('log-class0')?.addEventListener('click', () => {
        addingClass = 0;
        document.getElementById('log-class0').classList.add('active');
        document.getElementById('log-class1').classList.remove('active');
    });
    document.getElementById('log-class1')?.addEventListener('click', () => {
        addingClass = 1;
        document.getElementById('log-class1').classList.add('active');
        document.getElementById('log-class0').classList.remove('active');
    });
    document.getElementById('log-reset')?.addEventListener('click', () => {
        pts = []; w = [0, 0]; b = 0; draw();
    });
    draw();
})();
