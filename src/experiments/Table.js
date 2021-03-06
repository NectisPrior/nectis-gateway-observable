/**
 * @author Jonathan Terrell <jonathan.terrell@springbrook.es>
 * @copyright Copyright (c) 2019-2021 Springbrook S.L.
 * @license "Apache-2.0"
 */

import tableStyle from './styles/tableStyle.css';
// -------------------------------------------------------------------------------------------------------------------------------
// Declarations - Classes
// -------------------------------------------------------------------------------------------------------------------------------

class Table {
    constructor(element, options) {
        const data = options.data;
        const columns = options.columns;

        const wrapper = document.createElement('div');
        wrapper.style.cssText = 'overflow-x: scroll; padding: 10px 0 10px 10px';

        const style = document.createElement('style');
        style.appendChild(document.createTextNode(tableStyle));
        wrapper.appendChild(style);

        const tableWrapper = document.createElement('div');
        tableWrapper.style.cssText = 'display: flex';
        const table = document.createElement('table');
        table.style.cssText = 'flex: 1 1 auto';
        const tableRightPadding = document.createElement('div'); // Implements padding on right.
        tableRightPadding.style.cssText = 'flex: 0 0 10px';

        const header = document.createElement('tr');
        for (const column of columns) {
            const th = document.createElement('th');
            th.style.cssText = buildCellStyle(column);
            const text = document.createTextNode(column.label);
            th.append(text);
            header.appendChild(th);
        }
        table.appendChild(header);

        for (const record of data) {
            const row = document.createElement('tr');
            for (const column of columns) {
                const td = document.createElement('td');
                td.style.cssText = buildCellStyle(column);
                let text;
                if (typeof column.source === 'function') {
                    text = document.createTextNode(formatCellValue(column, column.source(record, column)));
                } else {
                    text = document.createTextNode(formatCellValue(column, record[column.source]));
                }
                td.appendChild(text);
                row.appendChild(td);
            }
            table.appendChild(row);
        }

        tableWrapper.appendChild(table);
        tableWrapper.appendChild(tableRightPadding);
        wrapper.appendChild(tableWrapper);
        element.replaceChildren(wrapper);
    }
}

class TableVisualiser {
    constructor(element, options) {
        this.element = element;
        this.options = options;
        this.visual = undefined;
    }

    show() {
        this.visual = new Table(this.element, this.options);
        return this;
    }

    resize(items) {
        return this;
    }
}

// -------------------------------------------------------------------------------------------------------------------------------
// Exports
// -------------------------------------------------------------------------------------------------------------------------------

export default { TableVisualiser };

// -------------------------------------------------------------------------------------------------------------------------------
// Procedures
// -------------------------------------------------------------------------------------------------------------------------------

const buildCellStyle = (column) => {
    switch (column.typeId) {
        case 'decimalNumber':
        case 'wholeNumber':
            return ` text-align: ${column.align || 'right'}`;
        default:
            return ` text-align: ${column.align || 'left'}`;
    }
};

const formatCellValue = (column, value) => {
    if (!value) return '';
    switch (column.typeId) {
        case 'decimalNumber':
            return value.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        default:
            return value.toLocaleString();
    }
};
