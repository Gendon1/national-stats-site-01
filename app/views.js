// Chart rendering utilities and page renderers for the National Statistics site

import { INDICATORS, CATEGORIES, YEARS, YEAR_RANGES, ASEAN_PEERS_2024, GLOSSARY, formatValue, getSeriesForYears, normalizeSeries } from './data.js';

// ============================================================
// SVG Chart Helpers
// ============================================================

function createSVG(width, height) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', width);
  svg.setAttribute('height', height);
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Chart');
  return svg;
}

function createLine(x1, y1, x2, y2, stroke, strokeWidth = 1, strokeDasharray = '') {
  const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
  line.setAttribute('x1', x1);
  line.setAttribute('y1', y1);
  line.setAttribute('x2', x2);
  line.setAttribute('y2', y2);
  line.setAttribute('stroke', stroke);
  line.setAttribute('stroke-width', strokeWidth);
  if (strokeDasharray) line.setAttribute('stroke-dasharray', strokeDasharray);
  return line;
}

function createCircle(cx, cy, r, fill, stroke = '', strokeWidth = 0) {
  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', cx);
  circle.setAttribute('cy', cy);
  circle.setAttribute('r', r);
  circle.setAttribute('fill', fill);
  if (stroke) {
    circle.setAttribute('stroke', stroke);
    circle.setAttribute('stroke-width', strokeWidth);
  }
  return circle;
}

function createRect(x, y, width, height, fill, rx = 0) {
  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  rect.setAttribute('x', x);
  rect.setAttribute('y', y);
  rect.setAttribute('width', width);
  rect.setAttribute('height', height);
  rect.setAttribute('fill', fill);
  if (rx) rect.setAttribute('rx', rx);
  return rect;
}

function createText(x, y, text, fontSize = 12, fill = '#475569', textAnchor = 'start', dominantBaseline = 'auto', fontWeight = 'normal') {
  const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  textEl.setAttribute('x', x);
  textEl.setAttribute('y', y);
  textEl.setAttribute('font-size', fontSize);
  textEl.setAttribute('fill', fill);
  textEl.setAttribute('text-anchor', textAnchor);
  textEl.setAttribute('dominant-baseline', dominantBaseline);
  textEl.setAttribute('font-weight', fontWeight);
  textEl.setAttribute('font-family', 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif');
  textEl.textContent = text;
  return textEl;
}

function createPath(d, stroke, strokeWidth = 2, fill = 'none') {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', d);
  path.setAttribute('stroke', stroke);
  path.setAttribute('stroke-width', strokeWidth);
  path.setAttribute('fill', fill);
  path.setAttribute('stroke-linecap', 'round');
  path.setAttribute('stroke-linejoin', 'round');
  return path;
}

function createTitle(text) {
  const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
  title.textContent = text;
  return title;
}

// ============================================================
// Line Chart
// ============================================================

export function lineChart(container, indicator, yearRange = 'all', options = {}) {
  const { showNormalized = false, compareIndicators = null } = options;
  
  const width = container.clientWidth || 600;
  const height = 300;
  const margin = { top: 30, right: 80, bottom: 50, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const svg = createSVG(width, height);
  svg.classList.add('chart-svg');
  svg.setAttribute('tabindex', '0');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${indicator.name} chart`);
  
  const series = getSeriesForYears(indicator, 
    yearRange === '2015-2019' ? 2015 : yearRange === '2020-2024' ? 2020 : 2015,
    yearRange === '2015-2019' ? 2019 : 2024
  );
  
  const years = Object.keys(series).map(Number).sort((a, b) => a - b);
  const values = years.map(y => series[y]);
  
  if (values.length === 0) {
    container.innerHTML = '<p class="visually-hidden">No data available</p>';
    return;
  }
  
  let displayValues = values;
  let yLabel = indicator.unit;
  
  if (showNormalized) {
    const normalized = normalizeSeries(series, 2015);
    displayValues = years.map(y => normalized[y]);
    yLabel = 'Index (2015=100)';
  }
  
  const minVal = Math.min(...displayValues);
  const maxVal = Math.max(...displayValues);
  const padding = (maxVal - minVal) * 0.1 || 1;
  const yMin = minVal - padding;
  const yMax = maxVal + padding;
  
  const xScale = (year) => margin.left + ((year - years[0]) / (years[years.length - 1] - years[0])) * innerWidth;
  const yScale = (val) => margin.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;
  
  // Background
  svg.appendChild(createRect(0, 0, width, height, 'transparent'));
  
  // Gridlines horizontal
  const yTicks = 5;
  for (let i = 0; i <= yTicks; i++) {
    const y = margin.top + (i / yTicks) * innerHeight;
    const val = yMax - (i / yTicks) * (yMax - yMin);
    svg.appendChild(createLine(margin.left, y, width - margin.right, y, 'var(--color-border)', 1, '4,4'));
    svg.appendChild(createText(margin.left - 10, y, formatYAxis(val, indicator.format, indicator.unit), 11, 'var(--color-text-muted)', 'end', 'middle'));
  }
  
  // Gridlines vertical
  years.forEach((year, i) => {
    const x = xScale(year);
    svg.appendChild(createLine(x, margin.top, x, margin.top + innerHeight, 'var(--color-border)', 1, '4,4'));
    svg.appendChild(createText(x, margin.top + innerHeight + 20, year.toString(), 11, 'var(--color-text-muted)', 'middle', 'hanging'));
  });
  
  // Y axis label
  svg.appendChild(createText(15, margin.top + innerHeight / 2, yLabel, 11, 'var(--color-text-muted)', 'middle', 'middle', '500'));
  
  // Draw lines for each indicator (if comparing)
  const indicatorsToDraw = compareIndicators ? [indicator, ...compareIndicators] : [indicator];
  const colors = ['var(--color-primary)', 'var(--color-success)', 'var(--color-warning)', 'var(--color-danger)'];
  
  indicatorsToDraw.forEach((ind, idx) => {
    const indSeries = getSeriesForYears(ind, years[0], years[years.length - 1]);
    const indValues = years.map(y => indSeries[y]);
    let indDisplayValues = indValues;
    
    if (showNormalized) {
      const normalized = normalizeSeries(indSeries, 2015);
      indDisplayValues = years.map(y => normalized[y]);
    }
    
    const color = colors[idx % colors.length];
    const points = years.map((y, i) => [xScale(y), yScale(indDisplayValues[i])]);
    
    // Line path
    let pathD = '';
    points.forEach(([x, y], i) => {
      if (i === 0) pathD += `M ${x} ${y}`;
      else pathD += ` L ${x} ${y}`;
    });
    
    const path = createPath(pathD, color, 2.5);
    path.classList.add('chart-line');
    svg.appendChild(path);
    
    // Points with tooltips
    points.forEach(([x, y], i) => {
      const year = years[i];
      const val = indValues[i];
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const circle = createCircle(x, y, 4, color, 'white', 2);
      circle.setAttribute('class', 'chart-point');
      circle.setAttribute('tabindex', '0');
      circle.setAttribute('role', 'button');
      circle.setAttribute('aria-label', `${ind.shortName} ${year}: ${formatValue(ind, val)}`);
      circle.appendChild(createTitle(`${ind.name} (${year}): ${formatValue(ind, val)}`));
      
      // Hover effects via JS
      circle.addEventListener('mouseenter', () => {
        circle.setAttribute('r', 6);
        showTooltip(svg, x, y, `${ind.shortName} ${year}: ${formatValue(ind, val)}`);
      });
      circle.addEventListener('mouseleave', () => {
        circle.setAttribute('r', 4);
        hideTooltip(svg);
      });
      circle.addEventListener('focus', () => {
        circle.setAttribute('r', 6);
        showTooltip(svg, x, y, `${ind.shortName} ${year}: ${formatValue(ind, val)}`);
      });
      circle.addEventListener('blur', () => hideTooltip(svg));
      
      g.appendChild(circle);
      svg.appendChild(g);
    });
    
    // Legend
    const legendY = margin.top + idx * 24;
    svg.appendChild(createLine(width - margin.right + 10, legendY + 6, width - margin.right + 30, legendY + 6, color, 3));
    svg.appendChild(createText(width - margin.right + 35, legendY + 10, ind.shortName, 11, 'var(--color-text)', 'start', 'middle', '500'));
  });
  
  // Tooltip element
  const tooltip = createRect(0, 0, 1, 1, 'transparent');
  tooltip.setAttribute('id', 'chart-tooltip');
  tooltip.setAttribute('pointer-events', 'none');
  tooltip.style.display = 'none';
  svg.appendChild(tooltip);
  
  container.innerHTML = '';
  container.appendChild(svg);
}

function formatYAxis(val, format, unit) {
  if (format === 'currency') {
    if (unit === 'US$ billions') return '$' + val.toFixed(0) + 'B';
    if (val >= 1e9) return '$' + (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
    return '$' + val.toLocaleString(undefined, { maximumFractionDigits: 0 });
  }
  if (format === 'percent') return val.toFixed(1) + '%';
  if (format === 'number') {
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return val.toFixed(1);
  }
  return val.toFixed(1);
}

let tooltipTimeout = null;
function showTooltip(svg, x, y, text) {
  clearTimeout(tooltipTimeout);
  let tooltip = svg.querySelector('.chart-tooltip');
  if (!tooltip) {
    tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tooltip.classList.add('chart-tooltip');
    const rect = createRect(0, 0, 160, 40, 'var(--color-surface)', 6);
    rect.setAttribute('stroke', 'var(--color-border)');
    rect.setAttribute('filter', 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))');
    const txt = createText(10, 24, '', 12, 'var(--color-text)', 'start', 'middle');
    txt.setAttribute('id', 'tooltip-text');
    tooltip.appendChild(rect);
    tooltip.appendChild(txt);
    svg.appendChild(tooltip);
  }
  const rect = tooltip.querySelector('rect');
  const txt = tooltip.querySelector('#tooltip-text');
  txt.textContent = text;
  const bbox = txt.getBBox();
  rect.setAttribute('width', bbox.width + 20);
  rect.setAttribute('height', bbox.height + 16);
  const tx = Math.min(x + 15, svg.clientWidth - bbox.width - 30);
  const ty = Math.max(y - 30, 20);
  tooltip.setAttribute('transform', `translate(${tx}, ${ty})`);
  tooltip.style.display = 'block';
}

function hideTooltip(svg) {
  const tooltip = svg.querySelector('.chart-tooltip');
  if (tooltip) tooltip.style.display = 'none';
}

// ============================================================
// Bar Chart
// ============================================================

export function barChart(container, data, options = {}) {
  const { horizontal = false, color = 'var(--color-primary)', valueFormat = 'number', labelFormat = 'text', maxBars = 10 } = options;
  
  const width = container.clientWidth || 600;
  const height = 300;
  const margin = horizontal ? { top: 30, right: 30, bottom: 50, left: 140 } : { top: 30, right: 30, bottom: 70, left: 70 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const svg = createSVG(width, height);
  svg.classList.add('chart-svg');
  svg.setAttribute('tabindex', '0');
  
  const sortedData = [...data].sort((a, b) => b.value - a.value).slice(0, maxBars);
  const maxVal = Math.max(...sortedData.map(d => d.value));
  const labels = sortedData.map(d => d.label);
  const values = sortedData.map(d => d.value);
  
  if (horizontal) {
    const barHeight = innerHeight / labels.length * 0.7;
    const gap = innerHeight / labels.length * 0.3;
    
    // Y axis (labels)
    labels.forEach((label, i) => {
      const y = margin.top + i * (barHeight + gap) + barHeight / 2;
      svg.appendChild(createText(margin.left - 15, y, label, 12, 'var(--color-text)', 'end', 'middle', '500'));
    });
    
    // X axis gridlines
    const xTicks = 5;
    for (let i = 0; i <= xTicks; i++) {
      const x = margin.left + (i / xTicks) * innerWidth;
      const val = (i / xTicks) * maxVal;
      svg.appendChild(createLine(x, margin.top, x, margin.top + innerHeight, 'var(--color-border)', 1, '4,4'));
      svg.appendChild(createText(x, margin.top + innerHeight + 20, formatBarValue(val, valueFormat), 10, 'var(--color-text-muted)', 'middle', 'hanging'));
    }
    
    // Bars
    sortedData.forEach((d, i) => {
      const barWidth = (d.value / maxVal) * innerWidth;
      const y = margin.top + i * (barHeight + gap);
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const rect = createRect(margin.left, y, barWidth, barHeight, color, 4);
      rect.setAttribute('class', 'chart-bar');
      rect.setAttribute('tabindex', '0');
      rect.setAttribute('role', 'button');
      rect.setAttribute('aria-label', `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      rect.appendChild(createTitle(`${d.label}: ${formatBarValue(d.value, valueFormat)}`));
      
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill', 'var(--color-primary-hover)');
        showBarTooltip(svg, margin.left + barWidth + 10, y + barHeight / 2, `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill', color);
        hideTooltip(svg);
      });
      rect.addEventListener('focus', () => {
        rect.setAttribute('fill', 'var(--color-primary-hover)');
        showBarTooltip(svg, margin.left + barWidth + 10, y + barHeight / 2, `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      });
      rect.addEventListener('blur', () => hideTooltip(svg));
      
      g.appendChild(rect);
      
      // Value label at end of bar
      if (barWidth > 50) {
        g.appendChild(createText(margin.left + barWidth - 5, y + barHeight / 2 + 4, formatBarValue(d.value, valueFormat), 11, 'white', 'end', 'middle', '600'));
      } else {
        g.appendChild(createText(margin.left + barWidth + 5, y + barHeight / 2 + 4, formatBarValue(d.value, valueFormat), 11, 'var(--color-text)', 'start', 'middle', '600'));
      }
      
      svg.appendChild(g);
    });
  } else {
    // Vertical bars
    const barWidth = innerWidth / labels.length * 0.7;
    const gap = innerWidth / labels.length * 0.3;
    
    // X axis (labels)
    labels.forEach((label, i) => {
      const x = margin.left + i * (barWidth + gap) + barWidth / 2;
      svg.appendChild(createText(x, margin.top + innerHeight + 15, label, 11, 'var(--color-text)', 'middle', 'hanging', '500'));
    });
    
    // Y axis gridlines
    const yTicks = 5;
    for (let i = 0; i <= yTicks; i++) {
      const y = margin.top + (i / yTicks) * innerHeight;
      const val = maxVal - (i / yTicks) * maxVal;
      svg.appendChild(createLine(margin.left, y, margin.left + innerWidth, y, 'var(--color-border)', 1, '4,4'));
      svg.appendChild(createText(margin.left - 10, y, formatBarValue(val, valueFormat), 10, 'var(--color-text-muted)', 'end', 'middle'));
    }
    
    // Bars
    sortedData.forEach((d, i) => {
      const barHeight = (d.value / maxVal) * innerHeight;
      const x = margin.left + i * (barWidth + gap);
      const y = margin.top + innerHeight - barHeight;
      
      const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
      
      const rect = createRect(x, y, barWidth, barHeight, color, 4);
      rect.setAttribute('class', 'chart-bar');
      rect.setAttribute('tabindex', '0');
      rect.setAttribute('role', 'button');
      rect.setAttribute('aria-label', `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      rect.appendChild(createTitle(`${d.label}: ${formatBarValue(d.value, valueFormat)}`));
      
      rect.addEventListener('mouseenter', () => {
        rect.setAttribute('fill', 'var(--color-primary-hover)');
        showBarTooltip(svg, x + barWidth / 2, y - 10, `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      });
      rect.addEventListener('mouseleave', () => {
        rect.setAttribute('fill', color);
        hideTooltip(svg);
      });
      rect.addEventListener('focus', () => {
        rect.setAttribute('fill', 'var(--color-primary-hover)');
        showBarTooltip(svg, x + barWidth / 2, y - 10, `${d.label}: ${formatBarValue(d.value, valueFormat)}`);
      });
      rect.addEventListener('blur', () => hideTooltip(svg));
      
      g.appendChild(rect);
      
      // Value label on top of bar
      if (barHeight > 25) {
        g.appendChild(createText(x + barWidth / 2, y + 14, formatBarValue(d.value, valueFormat), 11, 'var(--color-text)', 'middle', 'hanging', '600'));
      } else {
        g.appendChild(createText(x + barWidth / 2, y - 5, formatBarValue(d.value, valueFormat), 11, 'var(--color-text)', 'middle', 'auto', '600'));
      }
      
      svg.appendChild(g);
    });
  }
  
  container.innerHTML = '';
  container.appendChild(svg);
}

function formatBarValue(val, format) {
  if (format === 'currency') {
    if (val >= 1e9) return '$' + (val / 1e9).toFixed(1) + 'B';
    if (val >= 1e6) return '$' + (val / 1e6).toFixed(1) + 'M';
    return '$' + val.toLocaleString();
  }
  if (format === 'percent') return val.toFixed(1) + '%';
  if (format === 'number') {
    if (val >= 1e6) return (val / 1e6).toFixed(1) + 'M';
    if (val >= 1e3) return (val / 1e3).toFixed(1) + 'K';
    return val.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  }
  return val.toString();
}

function showBarTooltip(svg, x, y, text) {
  clearTimeout(tooltipTimeout);
  let tooltip = svg.querySelector('.chart-tooltip');
  if (!tooltip) {
    tooltip = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    tooltip.classList.add('chart-tooltip');
    const rect = createRect(0, 0, 160, 30, 'var(--color-surface)', 6);
    rect.setAttribute('stroke', 'var(--color-border)');
    rect.setAttribute('filter', 'drop-shadow(0 4px 6px rgb(0 0 0 / 0.1))');
    const txt = createText(10, 20, '', 12, 'var(--color-text)', 'start', 'middle');
    txt.setAttribute('id', 'tooltip-text');
    tooltip.appendChild(rect);
    tooltip.appendChild(txt);
    svg.appendChild(tooltip);
  }
  const rect = tooltip.querySelector('rect');
  const txt = tooltip.querySelector('#tooltip-text');
  txt.textContent = text;
  const bbox = txt.getBBox();
  rect.setAttribute('width', bbox.width + 20);
  rect.setAttribute('height', bbox.height + 10);
  tooltip.setAttribute('transform', `translate(${x - bbox.width / 2 - 10}, ${y - bbox.height - 15})`);
  tooltip.style.display = 'block';
}

// ============================================================
// Page Renderers
// ============================================================

function createKPICard(label, value, source, year) {
  const card = document.createElement('div');
  card.className = 'kpi-card';
  card.innerHTML = `
    <div class="kpi-label">${label}</div>
    <div class="kpi-value">${value}</div>
    <div class="kpi-source">${source} • ${year}</div>
  `;
  return card;
}

function createChartContainer(title, chartFn, indicator, yearRange, options = {}) {
  const section = document.createElement('section');
  section.className = 'chart-container';
  section.innerHTML = `<h3 class="chart-title">${title}</h3><div class="chart-wrapper" id="chart-${indicator.id}"></div>`;
  
  setTimeout(() => {
    const wrapper = section.querySelector(`#chart-${indicator.id}`);
    if (wrapper) chartFn(wrapper, indicator, yearRange, options);
  }, 0);
  
  return section;
}

function createDataTable(indicator, yearRange) {
  const startYear = yearRange === '2015-2019' ? 2015 : yearRange === '2020-2024' ? 2020 : 2015;
  const endYear = yearRange === '2015-2019' ? 2019 : 2024;
  
  const wrapper = document.createElement('div');
  wrapper.className = 'table-wrapper';
  
  let html = `<table class="data-table"><thead><tr><th>Year</th><th>${indicator.name} (${indicator.unit})</th></tr></thead><tbody>`;
  
  for (let y = endYear; y >= startYear; y--) {
    const val = indicator.series[y];
    if (val !== undefined) {
      html += `<tr><td>${y}</td><td>${formatValue(indicator, val)}</td></tr>`;
    } else {
      html += `<tr><td>${y}</td><td class="missing">—</td></tr>`;
    }
  }
  
  html += '</tbody></table>';
  wrapper.innerHTML = html;
  return wrapper;
}

function createYearRangeFilter(currentRange, onChange) {
  const div = document.createElement('div');
  div.className = 'controls-bar';
  div.innerHTML = `
    <div class="control-group" style="flex: 1;">
      <label class="control-label" for="year-range">Year Range</label>
      <select class="control-select" id="year-range">
        <option value="all">All Years (2015–2024)</option>
        <option value="2015-2019">2015–2019 (Pre-COVID)</option>
        <option value="2020-2024">2020–2024 (COVID & Recovery)</option>
      </select>
    </div>
    <button class="btn btn-primary" id="download-csv">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
      Download CSV
    </button>
  `;
  
  const select = div.querySelector('#year-range');
  select.value = currentRange;
  select.addEventListener('change', (e) => onChange(e.target.value));
  
  const downloadBtn = div.querySelector('#download-csv');
  downloadBtn.addEventListener('click', () => {
    const indicator = window.currentIndicator;
    const range = select.value;
    if (indicator) downloadCSV(indicator, range);
  });
  
  return div;
}

function downloadCSV(indicator, yearRange) {
  const startYear = yearRange === '2015-2019' ? 2015 : yearRange === '2020-2024' ? 2020 : 2015;
  const endYear = yearRange === '2015-2019' ? 2019 : 2024;
  
  let csv = `Year,${indicator.name} (${indicator.unit}),Source\n`;
  for (let y = startYear; y <= endYear; y++) {
    const val = indicator.series[y];
    if (val !== undefined) {
      csv += `${y},${val},${indicator.source}\n`;
    } else {
      csv += `${y},,${indicator.source}\n`;
    }
  }
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${indicator.id}-${yearRange}.csv`;
  link.click();
  URL.revokeObjectURL(link.href);
}

// ============================================================
// Render: Home
// ============================================================

export function renderHome(yearRange = 'all') {
  const main = document.getElementById('app');
  const gdp = INDICATORS['gdp'];
  const gdpPerCapita = INDICATORS['gdp-per-capita'];
  const inflation = INDICATORS['inflation'];
  const unemployment = INDICATORS['unemployment'];
  const population = INDICATORS['population'];
  
  const latestYear = 2024;
  
  const sections = [];
  
  // Hero KPIs
  const heroSection = document.createElement('section');
  heroSection.className = 'section';
  heroSection.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Indonesia National Statistics</h1>
      <p class="page-subtitle">World Bank WDI indicators 2015–2024 • ASEAN comparisons • Real-time charts</p>
    </div>
    <div class="kpi-grid" id="kpi-grid"></div>
  `;
  sections.push(heroSection);
  
  // Featured charts
  const chartsSection = document.createElement('section');
  chartsSection.className = 'section';
  chartsSection.innerHTML = '<h2 class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> Featured Trends</h2>';
  const chartsGrid = document.createElement('div');
  chartsGrid.className = 'card-grid';
  chartsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(400px, 1fr))';
  
  const featuredIndicators = ['gdp', 'gdp-growth', 'inflation', 'unemployment'];
  featuredIndicators.forEach(id => {
    const ind = INDICATORS[id];
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${ind.shortName}</div>
          <div class="card-meta">${ind.source} • ${latestYear}</div>
        </div>
        <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
      </div>
      <div class="card-value">${formatValue(ind, ind.series[latestYear])}</div>
      <div id="mini-chart-${id}" style="height: 120px; margin-top: 0.5rem;"></div>
    `;
    chartsGrid.appendChild(card);
    
    setTimeout(() => {
      const wrapper = card.querySelector(`#mini-chart-${id}`);
      if (wrapper) miniLineChart(wrapper, ind, yearRange);
    }, 0);
  });
  
  chartsSection.appendChild(chartsGrid);
  sections.push(chartsSection);
  
  // Latest updates
  const updatesSection = document.createElement('section');
  updatesSection.className = 'section';
  updatesSection.innerHTML = '<h2 class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Latest Data Points (2024)</h2>';
  const updatesList = document.createElement('ul');
  updatesList.className = 'update-list';
  
  const keyIndicators = ['gdp', 'gdp-per-capita', 'population', 'life-expectancy', 'inflation', 'unemployment', 'primary-enrolment', 'energy-use'];
  keyIndicators.forEach(id => {
    const ind = INDICATORS[id];
    const val = ind.series[2024];
    const item = document.createElement('li');
    item.className = 'update-item';
    item.innerHTML = `
      <div class="update-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
      <div class="update-content">
        <div class="update-title">${ind.shortName}</div>
        <div class="update-meta">${formatValue(ind, val)} • ${ind.source}</div>
      </div>
    `;
    updatesList.appendChild(item);
  });
  
  updatesSection.appendChild(updatesList);
  sections.push(updatesSection);
  
  main.innerHTML = '';
  sections.forEach(s => main.appendChild(s));
  
  // Populate KPI grid
  const kpiGrid = main.querySelector('#kpi-grid');
  const kpis = [
    { label: 'Population', indicator: population },
    { label: 'GDP (Current US$)', indicator: gdp },
    { label: 'GDP per Capita', indicator: gdpPerCapita },
    { label: 'Inflation (CPI)', indicator: inflation },
    { label: 'Unemployment Rate', indicator: unemployment }
  ];
  
  kpis.forEach(({ label, indicator }) => {
    const val = indicator.series[latestYear];
    kpiGrid.appendChild(createKPICard(label, formatValue(indicator, val), indicator.source, latestYear));
  });
}

function miniLineChart(container, indicator, yearRange) {
  const width = container.clientWidth || 300;
  const height = 120;
  const margin = { top: 10, right: 10, bottom: 20, left: 40 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  
  const svg = createSVG(width, height);
  svg.style.width = '100%';
  svg.style.height = '100%';
  
  const series = getSeriesForYears(indicator, 
    yearRange === '2015-2019' ? 2015 : yearRange === '2020-2024' ? 2020 : 2015,
    yearRange === '2015-2019' ? 2019 : 2024
  );
  
  const years = Object.keys(series).map(Number).sort((a, b) => a - b);
  const values = years.map(y => series[y]);
  
  if (values.length < 2) return;
  
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.1 || 1;
  const yMin = minVal - padding;
  const yMax = maxVal + padding;
  
  const xScale = (year) => margin.left + ((year - years[0]) / (years[years.length - 1] - years[0])) * innerWidth;
  const yScale = (val) => margin.top + innerHeight - ((val - yMin) / (yMax - yMin)) * innerHeight;
  
  // Line
  let pathD = '';
  years.forEach((y, i) => {
    const x = xScale(y);
    const yPos = yScale(values[i]);
    if (i === 0) pathD += `M ${x} ${yPos}`;
    else pathD += ` L ${x} ${yPos}`;
  });
  
  const color = 'var(--color-primary)';
  svg.appendChild(createPath(pathD, color, 2));
  
  // Points
  years.forEach((y, i) => {
    const circle = createCircle(xScale(y), yScale(values[i]), 3, color);
    circle.setAttribute('class', 'chart-point');
    svg.appendChild(circle);
  });
  
  container.innerHTML = '';
  container.appendChild(svg);
}

// ============================================================
// Render: Category
// ============================================================

export function renderCategory(categoryId, yearRange = 'all') {
  const main = document.getElementById('app');
  const category = CATEGORIES.find(c => c.id === categoryId);
  
  if (!category) {
    main.innerHTML = '<p>Category not found</p>';
    return;
  }
  
  const indicators = category.indicators.map(id => INDICATORS[id]).filter(Boolean);
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${category.icons} ${category.name}</h1>
      <p class="page-subtitle">${indicators.length} indicators • World Bank WDI 2015–2024</p>
    </div>
    <div class="controls-bar">
      <div class="control-group" style="flex: 1;">
        <label class="control-label" for="year-range">Year Range</label>
        <select class="control-select" id="year-range">
          <option value="all">All Years (2015–2024)</option>
          <option value="2015-2019">2015–2019 (Pre-COVID)</option>
          <option value="2020-2024">2020–2024 (COVID & Recovery)</option>
        </select>
      </div>
    </div>
    <div class="card-grid" id="indicator-grid"></div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  const grid = section.querySelector('#indicator-grid');
  const select = section.querySelector('#year-range');
  select.value = yearRange;
  
  indicators.forEach(ind => {
    const card = document.createElement('div');
    card.className = 'card';
    const latestVal = ind.series[2024];
    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${ind.shortName}</div>
          <div class="card-meta">${ind.unit} • ${ind.source}</div>
        </div>
        <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
      </div>
      <div class="card-value">${formatValue(ind, latestVal)}</div>
      <div class="card-meta">2024 value • <a href="#/indicator/${ind.id}" style="color: var(--color-primary);">View details →</a></div>
    `;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') window.location.hash = `#/indicator/${ind.id}`;
    });
    grid.appendChild(card);
  });
  
  select.addEventListener('change', (e) => {
    window.location.hash = `#/category/${categoryId}?range=${e.target.value}`;
  });
}

// ============================================================
// Render: Indicator Detail
// ============================================================

export function renderIndicator(indicatorId, yearRange = 'all') {
  const main = document.getElementById('app');
  const indicator = INDICATORS[indicatorId];
  
  if (!indicator) {
    main.innerHTML = '<p>Indicator not found</p>';
    return;
  }
  
  window.currentIndicator = indicator;
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">${indicator.shortName}</h1>
      <p class="page-subtitle">${indicator.name} • ${indicator.unit} • ${indicator.source}</p>
    </div>
    <div class="indicator-detail">
      <div class="indicator-main">
        <div class="chart-container">
          <h3 class="chart-title">${indicator.shortName} Trend (${yearRange === 'all' ? '2015–2024' : yearRange})</h3>
          <div class="chart-wrapper" id="main-chart"></div>
        </div>
        <div class="chart-container">
          <h3 class="chart-title">Data Table</h3>
          <div id="data-table"></div>
        </div>
      </div>
      <div class="indicator-sidebar">
        <div class="info-card">
          <h3>Definition</h3>
          <p>${indicator.description}</p>
        </div>
        <div class="info-card">
          <h3>Metadata</h3>
          <ul class="meta-list">
            <li class="meta-item"><span class="meta-label">World Bank Code</span><span class="meta-value">${indicator.code}</span></li>
            <li class="meta-item"><span class="meta-label">Category</span><span class="meta-value">${indicator.category}</span></li>
            <li class="meta-item"><span class="meta-label">Unit</span><span class="meta-value">${indicator.unit}</span></li>
            <li class="meta-item"><span class="meta-label">Source</span><span class="meta-value">${indicator.source}</span></li>
            <li class="meta-item"><span class="meta-label">Years Available</span><span class="meta-value">2015–2024</span></li>
          </ul>
        </div>
        <div class="info-card">
          <h3>Source Note</h3>
          <p style="font-size: 0.8125rem; color: var(--color-text-muted);">All figures from World Bank World Development Indicators (WDI). Data retrieved 2024. Values shown as reported; no interpolation or estimation applied.</p>
        </div>
      </div>
    </div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  // Render chart
  setTimeout(() => {
    const wrapper = section.querySelector('#main-chart');
    if (wrapper) lineChart(wrapper, indicator, yearRange);
  }, 0);
  
  // Render table
  const tableContainer = section.querySelector('#data-table');
  tableContainer.appendChild(createDataTable(indicator, yearRange));
  
  // Add year range filter to chart container
  const chartContainer = section.querySelector('.chart-container');
  const filterBar = createYearRangeFilter(yearRange, (range) => {
    window.location.hash = `#/indicator/${indicatorId}?range=${range}`;
  });
  chartContainer.insertBefore(filterBar, chartContainer.firstChild);
}

// ============================================================
// Render: Compare (ASEAN Peers + Normalized Index)
// ============================================================

export function renderCompare(yearRange = 'all') {
  const main = document.getElementById('app');
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">ASEAN Comparison</h1>
      <p class="page-subtitle">Indonesia vs peers • 2024 snapshot + normalized trends (2015=100)</p>
    </div>
    
    <div class="controls-bar">
      <div class="control-group" style="flex: 1;">
        <label class="control-label" for="year-range">Year Range for Index Chart</label>
        <select class="control-select" id="year-range">
          <option value="all">All Years (2015–2024)</option>
          <option value="2015-2019">2015–2019 (Pre-COVID)</option>
          <option value="2020-2024">2020–2024 (COVID & Recovery)</option>
        </select>
      </div>
      <button class="btn btn-primary" id="download-csv">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        Download CSV
      </button>
    </div>
    
    <div class="section">
      <h2 class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg> ASEAN Peers — 2024 Snapshot</h2>
      <div class="table-wrapper" id="asean-table"></div>
      <div class="chart-container" style="margin-top: 1.5rem;">
        <h3 class="chart-title">GDP per Capita (2024)</h3>
        <div class="chart-wrapper" id="asean-bar-chart"></div>
      </div>
    </div>
    
    <div class="section">
      <h2 class="section-title"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg> Normalized Index Comparison (2015 = 100)</h2>
      <div class="compare-selectors">
        <div class="compare-select-wrapper">
          <label for="compare-indicator-1">First Indicator</label>
          <select class="control-select" id="compare-indicator-1"></select>
        </div>
        <div class="compare-select-wrapper">
          <label for="compare-indicator-2">Second Indicator</label>
          <select class="control-select" id="compare-indicator-2"></select>
        </div>
      </div>
      <div class="chart-container">
        <h3 class="chart-title" id="compare-chart-title">Select two indicators to compare</h3>
        <div class="chart-wrapper" id="compare-chart"></div>
      </div>
    </div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  // ASEAN Table
  const tableWrapper = section.querySelector('#asean-table');
  renderASEANTable(tableWrapper);
  
  // ASEAN Bar Chart (GDP per capita)
  setTimeout(() => {
    const wrapper = section.querySelector('#asean-bar-chart');
    if (wrapper) renderASEANBarChart(wrapper);
  }, 0);
  
  // Populate indicator selectors
  const economyIndicators = ['gdp', 'gdp-growth', 'gdp-per-capita', 'inflation', 'exports', 'imports', 'population', 'population-growth', 'life-expectancy', 'unemployment', 'labour-force', 'energy-use', 'primary-enrolment', 'secondary-enrolment'];
  
  const sel1 = section.querySelector('#compare-indicator-1');
  const sel2 = section.querySelector('#compare-indicator-2');
  
  economyIndicators.forEach(id => {
    const ind = INDICATORS[id];
    const opt1 = document.createElement('option');
    opt1.value = id;
    opt1.textContent = `${ind.shortName} (${ind.unit})`;
    sel1.appendChild(opt1);
    
    const opt2 = document.createElement('option');
    opt2.value = id;
    opt2.textContent = `${ind.shortName} (${ind.unit})`;
    sel2.appendChild(opt2);
  });
  
  sel1.value = 'gdp-per-capita';
  sel2.value = 'inflation';
  
  function updateCompareChart() {
    const id1 = sel1.value;
    const id2 = sel2.value;
    const ind1 = INDICATORS[id1];
    const ind2 = INDICATORS[id2];
    
    const title = section.querySelector('#compare-chart-title');
    title.textContent = `${ind1.shortName} vs ${ind2.shortName} — Normalized (2015=100)`;
    
    const wrapper = section.querySelector('#compare-chart');
    if (wrapper) {
      lineChart(wrapper, ind1, yearRange, { showNormalized: true, compareIndicators: [ind2] });
    }
  }
  
  sel1.addEventListener('change', updateCompareChart);
  sel2.addEventListener('change', updateCompareChart);
  
  // Year range filter
  const rangeSelect = section.querySelector('#year-range');
  rangeSelect.value = yearRange;
  rangeSelect.addEventListener('change', (e) => {
    yearRange = e.target.value;
    updateCompareChart();
  });
  
  // Download CSV
  const downloadBtn = section.querySelector('#download-csv');
  downloadBtn.addEventListener('click', () => downloadASEANCSV());
  
  // Initial render
  updateCompareChart();
}

function renderASEANTable(container) {
  const peers = Object.values(ASEAN_PEERS_2024);
  const flags = {
    IDN: '🇮🇩', SGP: '🇸🇬', MYS: '🇲🇾', THA: '🇹🇭', VNM: '🇻🇳', PHL: '🇵🇭'
  };
  
  let html = `<table class="asean-table"><thead><tr><th>Country</th><th>Population</th><th>GDP per Capita (US$)</th></tr></thead><tbody>`;
  
  peers.forEach(p => {
    const flag = flags[p.code] || '';
    const pop = p.pop !== null ? p.pop.toLocaleString() : '—';
    const gdppc = p.gdppc !== null ? '$' + p.gdppc.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '—';
    html += `<tr><td class="flag">${flag} ${p.name}</td><td>${pop}</td><td>${gdppc}</td></tr>`;
  });
  
  html += '</tbody></table>';
  container.innerHTML = html;
}

function renderASEANBarChart(container) {
  const peers = Object.values(ASEAN_PEERS_2024).filter(p => p.gdppc !== null);
  const data = peers.map(p => ({
    label: p.name,
    value: p.gdppc
  }));
  
  barChart(container, data, { horizontal: true, color: 'var(--color-primary)', valueFormat: 'currency' });
}

function downloadASEANCSV() {
  const peers = Object.values(ASEAN_PEERS_2024);
  let csv = 'Country Code,Country,Population (2024),GDP per Capita (US$, 2024),Source\n';
  
  peers.forEach(p => {
    csv += `${p.code},${p.name},${p.pop ?? ''},${p.gdppc ?? ''},World Bank WDI 2024\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'asean-comparison-2024.csv';
  link.click();
  URL.revokeObjectURL(link.href);
}

// ============================================================
// Render: Methodology
// ============================================================

export function renderMethodology() {
  const main = document.getElementById('app');
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Methodology</h1>
      <p class="page-subtitle">How this site's figures are sourced, processed, and presented</p>
    </div>
    
    <div class="methodology-section">
      <h3>Data Source</h3>
      <p>All statistics on this site come from the <strong>World Bank World Development Indicators (WDI)</strong>, the primary cross-country comparable database for development data. The WDI compiles data from officially recognized international sources and national statistical offices.</p>
      <p>Indicator series used: 17 series covering Economy, People, Health, Education, Energy & Environment, Trade, and Labour. Each series is identified by its World Bank indicator code (e.g., <code>NY.GDP.MKTP.CD</code> for GDP in current US$).</p>
    </div>
    
    <div class="methodology-section">
      <h3>Time Coverage</h3>
      <p>Annual data from <strong>2015 through 2024</strong> (10 years). This period captures pre-COVID trends (2015–2019), the COVID-19 shock (2020), and the recovery phase (2021–2024). The year-range filter on charts and tables lets you isolate these three phases.</p>
    </div>
    
    <div class="methodology-section">
      <h3>Country Coverage</h3>
      <p><strong>Indonesia</strong> is the primary country with full 2015–2024 series for all 17 indicators.</p>
      <p>For the Compare page, <strong>ASEAN peers</strong> (Singapore, Malaysia, Thailand, Vietnam, Philippines) are shown with 2024 values only for Population and GDP per Capita. Missing values are shown as "—" (Thailand population, Vietnam GDP per capita not available in the 2024 vintage).</p>
    </div>
    
    <div class="methodology-section">
      <h3>Data Processing</h3>
      <ul>
        <li><strong>No interpolation or estimation:</strong> Values are copied exactly as published in the WDI 2024 vintage. Gaps in a series (e.g., health-expenditure and tertiary-enrolment ending at 2023) are left as missing.</li>
        <li><strong>Units preserved:</strong> GDP in current US$, GDP per capita in US$, percentages as percentages, population as raw counts.</li>
        <li><strong>Formatting for display:</strong> Large numbers abbreviated (B = billions, M = millions, K = thousands) with original precision retained in CSV downloads.</li>
        <li><strong>Normalized index:</strong> The comparison chart rebases each series to 2015 = 100: <code>index_t = (value_t / value_2015) × 100</code>. This allows comparing trajectories of indicators with different units.</li>
      </ul>
    </div>
    
    <div class="methodology-section">
      <h3>Visualization Choices</h3>
      <ul>
        <li><strong>Line charts:</strong> Annual points connected; hover/tap shows exact value with year. Gridlines at 5 intervals. Axes labeled with units.</li>
        <li><strong>Bar charts:</strong> Horizontal for country comparisons (easier label reading); vertical for time series alternative. Value labels on bars.</li>
        <li><strong>Color scheme:</strong> Primary blue for Indonesia; distinct colors (green, amber, red) for additional series in comparison charts. Works in both light and dark modes via CSS custom properties.</li>
        <li><strong>Accessibility:</strong> SVG <code><title></code> elements on every data point; keyboard-focusable points; ARIA labels; reduced-motion respected.</li>
      </ul>
    </div>
    
    <div class="methodology-section">
      <h3>Limitations & Caveats</h3>
      <ul>
        <li>WDI data may be revised in subsequent vintages; this site uses the 2024 release.</li>
        <li>Modeled estimates (e.g., unemployment ILO estimate) are noted in indicator definitions.</li>
        <li>Some indicators lack 2024 values (health-expenditure, tertiary-enrolment end at 2023).</li>
        <li>ASEAN peer data is a 2024 snapshot only; no historical series included.</li>
        <li>This is a static frontend — no live API, no backend, no user data collection.</li>
      </ul>
    </div>
    
    <div class="note-box">
      <p>All figures are verifiable against the World Bank WDI database. Source citations on every chart, table, and KPI card.</p>
    </div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
}

// ============================================================
// Render: Sources
// ============================================================

export function renderSources() {
  const main = document.getElementById('app');
  
  const sources = [
    {
      title: 'World Bank World Development Indicators (WDI)',
      desc: 'The primary source for all 17 indicator series. The WDI is the World Bank\'s premier compilation of cross-country comparable data on development. Data accessed via the WDI 2024 release.',
      link: 'https://databank.worldbank.org/source/world-development-indicators'
    },
    {
      title: 'World Bank API (wb_summary.json)',
      desc: 'The underlying JSON dataset used to build this site, derived from the WDI API. Contains annual values 2015–2024 for Indonesia across all selected indicator codes.',
      link: 'https://api.worldbank.org/v2/country/IDN/indicator/'
    },
    {
      title: 'ASEAN Peer Data (2024)',
      desc: 'Population and GDP per capita for Singapore, Malaysia, Thailand, Vietnam, Philippines from the same WDI 2024 vintage. Used only on the Compare page.',
      link: 'https://databank.worldbank.org/source/world-development-indicators'
    }
  ];
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Sources</h1>
      <p class="page-subtitle">All data origins, with links to the original databases</p>
    </div>
    <ul class="sources-list" id="sources-list"></ul>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  const list = section.querySelector('#sources-list');
  sources.forEach(s => {
    const item = document.createElement('li');
    item.className = 'source-item';
    item.innerHTML = `
      <div class="source-title">${s.title}</div>
      <div class="source-desc">${s.desc}</div>
      <a class="source-link" href="${s.link}" target="_blank" rel="noopener">Open source →</a>
    `;
    list.appendChild(item);
  });
}

// ============================================================
// Render: Glossary
// ============================================================

export function renderGlossary() {
  const main = document.getElementById('app');
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Glossary</h1>
      <p class="page-subtitle">Key terms used across the indicators, with plain-language definitions</p>
    </div>
    <div class="glossary-grid" id="glossary-grid"></div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  const grid = section.querySelector('#glossary-grid');
  GLOSSARY.forEach(({ term, definition }) => {
    const item = document.createElement('div');
    item.className = 'glossary-item';
    item.innerHTML = `
      <div class="glossary-term">${term}</div>
      <div class="glossary-definition">${definition}</div>
    `;
    grid.appendChild(item);
  });
}

// ============================================================
// Render: Search Results
// ============================================================

export function renderSearch(query, results) {
  const main = document.getElementById('app');
  
  const section = document.createElement('section');
  section.innerHTML = `
    <div class="page-header">
      <h1 class="page-title">Search Results</h1>
      <p class="page-subtitle">Found ${results.length} indicator${results.length !== 1 ? 's' : ''} for "${query}"</p>
    </div>
    <div class="card-grid" id="search-grid"></div>
  `;
  
  main.innerHTML = '';
  main.appendChild(section);
  
  const grid = section.querySelector('#search-grid');
  results.forEach(ind => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <div>
          <div class="card-title">${ind.shortName}</div>
          <div class="card-meta">${ind.category} • ${ind.unit}</div>
        </div>
        <div class="card-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg></div>
      </div>
      <div class="card-value">${formatValue(ind, ind.series[2024])}</div>
      <div class="card-meta">2024 value • <a href="#/indicator/${ind.id}" style="color: var(--color-primary);">View details →</a></div>
    `;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.tagName !== 'A') window.location.hash = `#/indicator/${ind.id}`;
    });
    grid.appendChild(card);
  });
  
  if (results.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-text-muted); padding: 2rem;">No indicators match your search.</p>';
  }
}