// ─────────────────────────────────────────────
// Canvas Helpers
// ─────────────────────────────────────────────
window.MLViz = {
    /**
     * Clamp a value between min and max.
     */
    clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },

    /**
     * Linear interpolation.
     */
    lerp(a, b, t) { return a + (b - a) * t; },

    /**
     * Map a value from [inLo,inHi] to [outLo,outHi].
     */
    remap(v, inLo, inHi, outLo, outHi) {
        return outLo + (v - inLo) / (inHi - inLo) * (outHi - outLo);
    },

    /**
     * Scale a canvas for device pixel ratio so it renders crisp on hi-DPI screens.
     * Returns { ctx, W, H, dpr } where W/H are the logical (CSS) dimensions.
     * Call once per canvas at init instead of canvas.getContext('2d') directly.
     */
    setupCanvas(canvas) {
        const dpr = window.devicePixelRatio || 1;
        const W = canvas.width;
        const H = canvas.height;
        canvas.width  = Math.round(W * dpr);
        canvas.height = Math.round(H * dpr);
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        const ctx = canvas.getContext('2d');
        ctx.scale(dpr, dpr);
        return { ctx, W, H, dpr };
    },

    /**
     * Draw grid lines on a canvas context.
     */
    drawGrid(ctx, W, H, { divX = 10, divY = 8, color = 'rgba(255,255,255,0.05)' } = {}) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        for (let i = 0; i <= divX; i++) {
            const x = (W / divX) * i;
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let j = 0; j <= divY; j++) {
            const y = (H / divY) * j;
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
        ctx.restore();
    },

    /**
     * Draw axes with optional labels.
     */
    drawAxes(ctx, W, H, {
        marginL = 50, marginB = 40, marginR = 20, marginT = 20,
        xLabel = 'x', yLabel = 'y', color = 'rgba(255,255,255,0.4)'
    } = {}) {
        ctx.save();
        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        ctx.lineWidth = 1.5;
        ctx.font = '12px Inter, sans-serif';
        // x-axis
        ctx.beginPath();
        ctx.moveTo(marginL, H - marginB);
        ctx.lineTo(W - marginR, H - marginB);
        ctx.stroke();
        // y-axis
        ctx.beginPath();
        ctx.moveTo(marginL, marginT);
        ctx.lineTo(marginL, H - marginB);
        ctx.stroke();
        // Labels
        ctx.textAlign = 'center';
        ctx.fillText(xLabel, W / 2, H - 8);
        ctx.save();
        ctx.translate(14, H / 2);
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(yLabel, 0, 0);
        ctx.restore();
        ctx.restore();
    },

    /**
     * Render a 2D contour/heatmap from a scalar function f(x,y).
     * x,y range from [xMin,xMax] × [yMin,yMax].
     */
    drawContour(ctx, W, H, f, { xMin = -3, xMax = 3, yMin = -3, yMax = 3, alpha = 0.85 } = {}) {
        // Use physical buffer dimensions so heatmap is crisp on hi-DPI screens.
        const bW = ctx.canvas.width;
        const bH = ctx.canvas.height;
        const imageData = ctx.createImageData(bW, bH);
        const data = imageData.data;
        let fMin = Infinity, fMax = -Infinity;
        const vals = new Float32Array(bW * bH);
        for (let py = 0; py < bH; py++) {
            for (let px = 0; px < bW; px++) {
                const x = this.remap(px, 0, bW, xMin, xMax);
                const y = this.remap(py, 0, bH, yMax, yMin);
                const v = f(x, y);
                vals[py * bW + px] = v;
                if (v < fMin) fMin = v;
                if (v > fMax) fMax = v;
            }
        }
        for (let py = 0; py < bH; py++) {
            for (let px = 0; px < bW; px++) {
                const t = (vals[py * bW + px] - fMin) / (fMax - fMin);
                const i = (py * bW + px) * 4;
                data[i]     = Math.round(this.lerp(8, 108, 1 - t));
                data[i + 1] = Math.round(this.lerp(9, 99, 1 - t));
                data[i + 2] = Math.round(this.lerp(15, 255, 1 - t));
                data[i + 3] = Math.round(alpha * 255);
            }
        }
        // putImageData ignores the current transform; reset to identity then restore.
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.putImageData(imageData, 0, 0);
        ctx.restore();
    },

    /**
     * Animate a moving particle (point) on canvas.
     */
    drawParticle(ctx, x, y, color = '#6c63ff', size = 7) {
        // Outer glow
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2);
        g.addColorStop(0, color + 'cc');
        g.addColorStop(1, color + '00');
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        // Core
        ctx.beginPath();
        ctx.arc(x, y, size * 0.65, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
    },

    /**
     * Draw a path (trajectory) as a fading polyline.
     */
    drawTrail(ctx, points, color = '#6c63ff', maxAlpha = 0.9) {
        if (points.length < 2) return;
        for (let i = 1; i < points.length; i++) {
            const alpha = (i / points.length) * maxAlpha;
            ctx.beginPath();
            ctx.moveTo(points[i - 1].x, points[i - 1].y);
            ctx.lineTo(points[i].x, points[i].y);
            ctx.strokeStyle = color + Math.round(alpha * 255).toString(16).padStart(2, '0');
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }
};
