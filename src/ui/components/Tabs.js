export function Tabs(activeTab) {
  const tabs = [
    { id: 'list', label: 'Список' },
    { id: 'charts', label: 'Графики' },
    { id: 'stats', label: 'Статистика' }
  ];
  
  return `
    <div class="tabs">
      ${tabs.map(t => `
        <button class="tab ${t.id === activeTab ? 'active' : ''}" 
                data-tab="${t.id}">${t.label}</button>
      `).join('')}
    </div>
  `;
}

export function attachTabsEvents(container, onTabChange) {
  container.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      container.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      onTabChange(tab.dataset.tab);
    });
  });
}
