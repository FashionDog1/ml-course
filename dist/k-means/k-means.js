// ─────────────────────────────────────────────
// K-MEANS Interactive Visualization
// ─────────────────────────────────────────────
(function () {
    const canvas = document.getElementById('km-canvas');
    if (!canvas) return;
    const { ctx, W, H } = MLViz.setupCanvas(canvas);
    const COLORS = ['#6c63ff', '#3ecfda', '#f7666f', '#5af7a0', '#ffc87a', '#ff87ab'];

    let k = 3;
    let points = [];
    let centroids = [];
    let labels = [];
    let iteration = 0;
    let autoTimer = null;

    // Seed some default points
    function seedPoints() {
        points = [];
        for (let i = 0; i < 3; i++) {
            const cx = 0.2 + i * 0.3, cy = 0.3 + (i % 2) * 0.4;
            for (let j = 0; j < 20; j++) {
                points.push({
                    x: (cx + (Math.random() - 0.5) * 0.18) * W,
                    y: (cy + (Math.random() - 0.5) * 0.18) * H
                });
            }
        }
    }
    seedPoints();

    function initCentroids() {
        centroids = [];
        const shuffled = [...points].sort(() => Math.random() - 0.5);
        for (let i = 0; i < k; i++) {
            centroids.push({ x: shuffled[i % shuffled.length].x, y: shuffled[i % shuffled.length].y });
        }
        labels = new Array(points.length).fill(0);
        iteration = 0;
    }
    initCentroids();

    function assignLabels() {
        let changed = false;
        for (let i = 0; i < points.length; i++) {
            let minDist = Infinity, minJ = 0;
            for (let j = 0; j < k; j++) {
                const dx = points[i].x - centroids[j].x;
                const dy = points[i].y - centroids[j].y;
                const d = dx * dx + dy * dy;
                if (d < minDist) { minDist = d; minJ = j; }
            }
            if (labels[i] !== minJ) changed = true;
            labels[i] = minJ;
        }
        return changed;
    }

    function updateCentroids() {
        for (let j = 0; j < k; j++) {
            const clusterPts = points.filter((_, i) => labels[i] === j);
            if (clusterPts.length === 0) continue;
            centroids[j].x = clusterPts.reduce((s, p) => s + p.x, 0) / clusterPts.length;
            centroids[j].y = clusterPts.reduce((s, p) => s + p.y, 0) / clusterPts.length;
        }
    }

    function step() {
        if (points.length === 0) return;
        assignLabels();
        updateCentroids();
        iteration++;
        draw();
        document.getElementById('km-info').textContent = `数据点: ${points.length} | 迭代次数: ${iteration}`;
    }

    function draw() {
        ctx.clearRect(0, 0, W, H);
        // Voronoi background (approximate)
        for (let py = 0; py < H; py += 6) {
            for (let px = 0; px < W; px += 6) {
                let minDist = Infinity, minJ = 0;
                for (let j = 0; j < centroids.length; j++) {
                    const dx = px - centroids[j].x, dy = py - centroids[j].y;
                    const d = dx * dx + dy * dy;
                    if (d < minDist) { minDist = d; minJ = j; }
                }
                ctx.fillStyle = COLORS[minJ] + '18';
                ctx.fillRect(px, py, 6, 6);
            }
        }

        // Points
        for (let i = 0; i < points.length; i++) {
            ctx.beginPath();
            ctx.arc(points[i].x, points[i].y, 5, 0, Math.PI * 2);
            ctx.fillStyle = COLORS[labels[i]] + 'cc';
            ctx.fill();
            ctx.strokeStyle = COLORS[labels[i]];
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        // Centroids
        for (let j = 0; j < centroids.length; j++) {
            // Cross marker
            const cx = centroids[j].x, cy = centroids[j].y;
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 3;
            ctx.beginPath(); ctx.moveTo(cx - 12, cy); ctx.lineTo(cx + 12, cy); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(cx, cy - 12); ctx.lineTo(cx, cy + 12); ctx.stroke();
            ctx.strokeStyle = COLORS[j];
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(cx, cy, 12, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = COLORS[j] + '33';
            ctx.fill();
        }
    }
    draw();

    // Click to add point
    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width, scaleY = H / rect.height;
        points.push({ x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY });
        labels.push(0);
        if (points.length > 0 && centroids.length === 0) initCentroids();
        draw();
        document.getElementById('km-info').textContent = `数据点: ${points.length} | 点击“下一步”迭代`;
    });

    document.getElementById('km-step')?.addEventListener('click', step);
    document.getElementById('km-run')?.addEventListener('click', () => {
        const btn = document.getElementById('km-run');
        if (autoTimer) {
            clearInterval(autoTimer); autoTimer = null;
            btn.textContent = '▶ 自动运行'; btn.classList.remove('active');
        } else {
            autoTimer = setInterval(step, 600);
            btn.textContent = '⏸ 停止'; btn.classList.add('active');
        }
    });
    document.getElementById('km-reset')?.addEventListener('click', () => {
        if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
        document.getElementById('km-run').textContent = '▶ 自动运行';
        document.getElementById('km-run').classList.remove('active');
        seedPoints(); initCentroids(); draw();
        document.getElementById('km-info').textContent = `数据点: ${points.length} | 迭代次数: 0`;
    });
    document.getElementById('km-k')?.addEventListener('input', () => {
        k = parseInt(document.getElementById('km-k').value);
        document.getElementById('km-k-val').textContent = k;
        initCentroids(); draw();
    });
})();
