export function SkeletonList(count = 3) {
  return Array(count).fill(`
    <div class="card" style="animation:pulse 1.5s infinite">
      <div style="height:20px;background:var(--border);border-radius:8px;margin-bottom:12px"></div>
      <div style="height:14px;background:var(--border);border-radius:6px;width:60%"></div>
    </div>
  `).join('');
}
