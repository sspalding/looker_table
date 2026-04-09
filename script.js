// Subscribe to Looker Studio data
dscc.subscribeToData(drawTable, { transform: dscc.tableTransform });

function drawTable(data) {
  const container = document.getElementById('table-container');
  container.innerHTML = '';

  if (!data || !data.tables || !data.tables.DEFAULT) {
    container.innerText = 'No data available';
    return;
  }

  const table = document.createElement('table');

  const columns = data.columns;
  const rows = data.tables.DEFAULT;

  // 🔍 Find the color column index
  const colorColIndex = columns.findIndex(col => col.name === 'color_hex');

  // 🧠 Build list of visible columns (exclude color_hex)
  const visibleColumns = columns.filter((col, i) => i !== colorColIndex);

  // ======================
  // HEADER
  // ======================
  const headerRow = document.createElement('tr');

  visibleColumns.forEach(col => {
    const th = document.createElement('th');
    th.innerText = col.name;
    headerRow.appendChild(th);
  });

  table.appendChild(headerRow);

  // ======================
  // ROWS
  // ======================
  rows.forEach(row => {
    const tr = document.createElement('tr');

    // 🎨 Get row color (if exists)
    let rowColor = null;
    if (colorColIndex !== -1 && row[colorColIndex]) {
      rowColor = row[colorColIndex].value;
    }

    visibleColumns.forEach((col, visibleIndex) => {
      const originalIndex = columns.indexOf(col);
      const cell = row[originalIndex];

      const td = document.createElement('td');
      td.innerText = cell?.formattedValue ?? '';

      // ======================
      // 🎨 APPLY COLOR
      // ======================
      if (rowColor && isValidHex(rowColor)) {
        td.style.backgroundColor = rowColor;
        td.style.color = getContrastColor(rowColor);
      }

      tr.appendChild(td);
    });

    table.appendChild(tr);
  });

  container.appendChild(table);
}

// ======================
// 🎨 HEX VALIDATION
// ======================
function isValidHex(hex) {
  return /^#([0-9A-F]{3}){1,2}$/i.test(hex);
}

// ======================
// 🎨 AUTO TEXT CONTRAST
// ======================
function getContrastColor(hex) {
  const cleanHex = hex.replace('#', '');

  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);

  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;

  return yiq >= 128 ? '#000000' : '#FFFFFF';
}
