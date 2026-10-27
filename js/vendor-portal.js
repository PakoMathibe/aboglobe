/* =========================================================
   ABOGLOBE — Vendor Portal (shared JS)
   Fully functional. No dead buttons.
   State persists via localStorage across all pages.
   ========================================================= */

(function () {
  'use strict';

  /* =========================================================
     STATE — single source of truth
     ========================================================= */
  const STORAGE_KEY = 'abo_vp_state_v1';

  const SEED = {
    user: {
      firstName: 'John',
      lastName: 'Doe',
      company: 'Acme Trading Co.',
      initials: 'JD'
    },
    profile: {
      company: 'Acme Trading Co.',
      reg: 'BC-8842119',
      type: 'supplier',
      industry: 'Commodity Trading',
      country: 'Canada',
      city: 'Richmond, BC',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@acmetrading.com',
      phone: '+1 778 000 0000',
      bank: 'Royal Bank of Canada',
      swift: 'ROYCCAT2XXX',
      account: '•••• 8842',
      currency: 'USD'
    },
    settings: {
      notifShipment: true,
      notifInvoice: true,
      notifCert: true,
      notifDigest: false,
      twoFactor: 'email'
    },
    orders: [
      { id: 'ABO-2025-0847', commodity: 'ICUMSA 45 Sugar',   quantity: '12,500 MT',  value: 8125000,  status: 'in-transit', delivery: 'Nov 4, 2025',  origin: 'Santos, BR',      destination: 'Shanghai, CN' },
      { id: 'ABO-2025-0843', commodity: 'Brazilian Chicken', quantity: '8,000 MT',   value: 9600000,  status: 'delivered',  delivery: 'Oct 15, 2025', origin: 'Paranaguá, BR',   destination: 'Jebel Ali, UAE' },
      { id: 'ABO-2025-0838', commodity: 'EN590 Diesel',      quantity: '25,000 MT',  value: 18250000, status: 'pending',    delivery: 'TBD',          origin: 'Rotterdam, NL',   destination: 'Singapore, SG' },
      { id: 'ABO-2025-0831', commodity: '3M 1826 Masks',     quantity: '2.4M units', value: 1200000,  status: 'delivered',  delivery: 'Sep 28, 2025', origin: 'Bangkok, TH',     destination: 'Vancouver, CA' },
      { id: 'ABO-2025-0827', commodity: 'Soybean Meal',      quantity: '6,000 MT',   value: 2460000,  status: 'cancelled',  delivery: '—',            origin: 'Paranaguá, BR',   destination: 'Kaohsiung, TW' },
      { id: 'ABO-2025-0820', commodity: 'ICUMSA 45 Sugar',   quantity: '6,250 MT',   value: 4062500,  status: 'delivered',  delivery: 'Sep 12, 2025', origin: 'Santos, BR',      destination: 'Shanghai, CN' },
      { id: 'ABO-2025-0824', commodity: 'Soybean Meal',      quantity: '10,000 MT',  value: 4100000,  status: 'in-transit', delivery: 'Nov 12, 2025', origin: 'Paranaguá, BR',   destination: 'Kaohsiung, TW' }
    ],
    documents: [
      { id: 'DOC-0341', name: 'Bill of Lading',        type: 'Shipping',      order: 'ABO-2025-0847', issued: 'Oct 18, 2025', expires: '',             status: 'valid' },
      { id: 'DOC-0338', name: 'Certificate of Origin', type: 'Compliance',    order: 'ABO-2025-0843', issued: 'Oct 10, 2025', expires: 'Oct 10, 2026', status: 'valid' },
      { id: 'DOC-0335', name: 'Commercial Invoice',    type: 'Finance',       order: 'ABO-2025-0838', issued: 'Oct 5, 2025',  expires: '',             status: 'valid' },
      { id: 'DOC-0330', name: 'ISO 9001 Certificate',  type: 'Certification', order: '',              issued: 'Oct 15, 2022', expires: 'Oct 15, 2025', status: 'expiring' },
      { id: 'DOC-0325', name: 'FDA 510K Registration', type: 'Compliance',    order: '',              issued: 'Mar 2, 2024',  expires: 'Mar 2, 2027',  status: 'valid' },
      { id: 'DOC-0319', name: 'Contract ABO-MSA-2024', type: 'Contract',      order: '',              issued: 'Jan 1, 2024',  expires: 'Dec 31, 2026', status: 'active' }
    ],
    invoices: [
      { id: 'INV-2025-0341', order: 'ABO-2025-0847', amount: 8125000,  issued: 'Oct 20, 2025', due: 'Nov 19, 2025', status: 'pending' },
      { id: 'INV-2025-0338', order: 'ABO-2025-0838', amount: 18250000, issued: 'Oct 15, 2025', due: 'Oct 14, 2025', status: 'overdue' },
      { id: 'INV-2025-0335', order: 'ABO-2025-0831', amount: 1200000,  issued: 'Oct 1, 2025',  due: 'Oct 31, 2025', status: 'paid' },
      { id: 'INV-2025-0330', order: 'ABO-2025-0827', amount: 2460000,  issued: 'Sep 28, 2025', due: 'Sep 27, 2025', status: 'overdue' },
      { id: 'INV-2025-0325', order: 'ABO-2025-0820', amount: 4062500,  issued: 'Sep 15, 2025', due: 'Oct 15, 2025', status: 'paid' }
    ],
    notifications: [
      { id: 'N1', icon: 'lni-ship',  title: 'Shipment ABO-2025-0847', body: 'Now in transit — ETA Nov 4', when: '2 hours ago',  link: 'vp-shipments.html' },
      { id: 'N2', icon: 'lni-wallet', title: '2 invoices overdue',    body: 'Total $2.4M — action required', when: 'Yesterday',  link: 'vp-invoices.html' },
      { id: 'N3', icon: 'lni-file',   title: 'Certificate expiring',  body: 'ISO 9001 expires in 14 days',   when: '2 days ago', link: 'vp-documents.html' }
    ],
    messages: [
      { id: 'M1', from: 'ABOGLOBE Trading Desk', initials: 'AT', body: 'Your ICUMSA 45 sugar shipment has cleared customs in Shanghai. Full documentation is in your portal.', when: '2h ago', unread: true },
      { id: 'M2', from: 'ABOGLOBE Finance',      initials: 'AF', body: 'Invoice INV-2025-0341 is due on Nov 19. Please confirm receipt.', when: 'Yesterday', unread: true },
      { id: 'M3', from: 'ABOGLOBE Compliance',   initials: 'AC', body: 'Reminder: your ISO 9001 certificate expires in 14 days. Please upload the renewed version.', when: '2 days ago', unread: true }
    ]
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
        return JSON.parse(JSON.stringify(SEED));
      }
      return JSON.parse(raw);
    } catch {
      return JSON.parse(JSON.stringify(SEED));
    }
  }

  function save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save vendor portal state', e);
    }
  }

  /* =========================================================
     UTILITIES
     ========================================================= */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  const money = (n) => '$' + Number(n).toLocaleString('en-US');

  const statusClass = (status) => {
    const map = {
      'in-transit': 'in-transit', 'delivered': 'delivered',
      'pending': 'pending', 'cancelled': 'cancelled', 'draft': 'draft',
      'valid': 'delivered', 'expiring': 'pending', 'active': 'delivered',
      'paid': 'delivered', 'overdue': 'cancelled'
    };
    return map[status] || 'draft';
  };

  const statusLabel = (status) => {
    const map = {
      'in-transit': 'In Transit', 'delivered': 'Delivered',
      'pending': 'Pending', 'cancelled': 'Cancelled', 'draft': 'Draft',
      'valid': 'Valid', 'expiring': 'Expiring', 'active': 'Active',
      'paid': 'Paid', 'overdue': 'Overdue'
    };
    return map[status] || status;
  };

  const statusIcon = (status) => {
    const map = {
      'in-transit': 'lni-ship', 'delivered': 'lni-checkmark-circle',
      'pending': 'lni-hourglass', 'cancelled': 'lni-xmark-circle',
      'draft': 'lni-file', 'valid': 'lni-checkmark-circle',
      'expiring': 'lni-warning', 'active': 'lni-checkmark-circle',
      'paid': 'lni-checkmark-circle', 'overdue': 'lni-warning'
    };
    return map[status] || 'lni-file';
  };

  const fmtDate = () => {
    const d = new Date();
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const uid = (prefix) => prefix + '-' + Math.random().toString(36).slice(2, 8).toUpperCase();

  /* =========================================================
     TOAST
     ========================================================= */
  function toast(msg, type = 'success') {
    let el = document.getElementById('vp-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'vp-toast';
      el.className = 'vp-toast';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.dataset.type = type;
    el.classList.add('show');
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove('show'), 3000);
  }

  /* =========================================================
     MODAL ENGINE — native <dialog>
     ========================================================= */
  function openModal({ title, subtitle, html, actions = [] }) {
    const dlg = document.createElement('dialog');
    dlg.className = 'vp-modal';

    const actionsHtml = actions.map((a, i) =>
      `<button type="button" class="vp-btn ${a.className || 'vp-btn-outline'}" data-modal-action="${i}">
         ${a.icon ? `<i class="lni ${a.icon}" aria-hidden="true"></i>` : ''} ${a.label}
       </button>`
    ).join('');

    dlg.innerHTML = `
      <div class="vp-modal-head">
        <div>
          <h3 class="vp-modal-title">${title || ''}</h3>
          ${subtitle ? `<p class="vp-modal-subtitle">${subtitle}</p>` : ''}
        </div>
        <button type="button" class="vp-modal-close" data-modal-close aria-label="Close">
          <i class="lni lni-close" aria-hidden="true"></i>
        </button>
      </div>
      <div class="vp-modal-body">${html || ''}</div>
      ${actionsHtml ? `<div class="vp-modal-actions">${actionsHtml}</div>` : ''}
    `;

    document.body.appendChild(dlg);
    dlg.showModal();

    // Action handlers
    $$('[data-modal-action]', dlg).forEach((btn, idx) => {
      btn.addEventListener('click', () => {
        const a = actions[idx];
        if (a && typeof a.onClick === 'function') {
          if (a.onClick(dlg) === false) return;
        }
        dlg.close();
      });
    });

    // Close handlers
    $$('[data-modal-close]', dlg).forEach((btn) =>
      btn.addEventListener('click', () => dlg.close())
    );

    // Backdrop click closes
    dlg.addEventListener('click', (e) => {
      const r = dlg.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        dlg.close();
      }
    });

    // Cleanup on close
    dlg.addEventListener('close', () => dlg.remove());

    return dlg;
  }

  /* =========================================================
     FILE DOWNLOADS — real .txt files
     ========================================================= */
  function downloadText(filename, content) {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* =========================================================
     TABLE SEARCH
     ========================================================= */
  function bindSearch() {
    $$('[data-vp-search]').forEach((input) => {
      const table = document.getElementById(input.dataset.vpSearch);
      if (!table) return;
      const rows = $$('tbody tr', table);
      input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        let n = 0;
        rows.forEach((row) => {
          const show = !q || row.textContent.toLowerCase().includes(q);
          row.style.display = show ? '' : 'none';
          if (show) n++;
        });
        let empty = $('.vp-table-empty', table);
        if (!empty) {
          empty = document.createElement('tr');
          empty.className = 'vp-table-empty';
          empty.innerHTML = '<td colspan="20">No matching records found.</td>';
          table.querySelector('tbody').appendChild(empty);
        }
        empty.style.display = n === 0 ? '' : 'none';
      });
    });
  }

  /* =========================================================
     RENDER TABLE ROWS FROM STATE
     ========================================================= */
  function renderOrdersTable() {
    const table = document.getElementById('orders-table') || document.getElementById('orders-full-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const isFull = table.id === 'orders-full-table';
    tbody.innerHTML = state.orders.map((o) => `
      <tr data-order-id="${o.id}">
        <td><strong>${o.id}</strong></td>
        <td>${o.commodity}</td>
        <td>${o.quantity}</td>
        ${isFull ? `<td>${money(o.value)}</td>` : ''}
        <td><span class="vp-status ${statusClass(o.status)}"><i class="lni ${statusIcon(o.status)}" aria-hidden="true"></i> ${statusLabel(o.status)}</span></td>
        <td>${o.delivery}</td>
        <td><button class="vp-table-action" data-action="view-order" data-id="${o.id}">View</button></td>
      </tr>
    `).join('');
  }

  function renderShipmentsTable() {
    const table = document.getElementById('shipments-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    const shipments = state.orders.filter((o) => o.origin && o.destination);
    tbody.innerHTML = shipments.map((o) => `
      <tr data-order-id="${o.id}">
        <td><strong>${o.id}</strong></td>
        <td>${o.commodity}</td>
        <td>${o.quantity}</td>
        <td>${o.origin}</td>
        <td>${o.destination}</td>
        <td><span class="vp-status ${statusClass(o.status)}"><i class="lni ${statusIcon(o.status)}" aria-hidden="true"></i> ${statusLabel(o.status)}</span></td>
        <td>${o.delivery}</td>
        <td><button class="vp-table-action" data-action="view-shipment" data-id="${o.id}">Track</button></td>
      </tr>
    `).join('');
  }

  function renderDocsTable() {
    const table = document.getElementById('docs-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = state.documents.map((d) => `
      <tr data-doc-id="${d.id}">
        <td><i class="lni lni-file-pdf" style="color:#dc2626;margin-right:.5rem;" aria-hidden="true"></i> ${d.name}</td>
        <td>${d.type}</td>
        <td>${d.order || '—'}</td>
        <td>${d.issued}</td>
        <td>${d.expires || '—'}</td>
        <td><span class="vp-status ${statusClass(d.status)}"><i class="lni ${statusIcon(d.status)}" aria-hidden="true"></i> ${statusLabel(d.status)}</span></td>
        <td><button class="vp-table-action" data-action="download-doc" data-id="${d.id}">Download</button></td>
      </tr>
    `).join('');
  }

  function renderInvoicesTable() {
    const table = document.getElementById('invoices-table');
    if (!table) return;
    const tbody = table.querySelector('tbody');
    tbody.innerHTML = state.invoices.map((inv) => `
      <tr data-invoice-id="${inv.id}">
        <td><strong>${inv.id}</strong></td>
        <td>${inv.order}</td>
        <td>${money(inv.amount)}</td>
        <td>${inv.issued}</td>
        <td>${inv.due}</td>
        <td><span class="vp-status ${statusClass(inv.status)}"><i class="lni ${statusIcon(inv.status)}" aria-hidden="true"></i> ${statusLabel(inv.status)}</span></td>
        <td><button class="vp-table-action" data-action="download-invoice" data-id="${inv.id}">Download</button></td>
      </tr>
    `).join('');
  }

  /* =========================================================
     ORDER DETAIL MODAL
     ========================================================= */
  function openOrderModal(orderId, asShipment = false) {
    const o = state.orders.find((x) => x.id === orderId);
    if (!o) return;

    const rows = asShipment ? `
      <div class="vp-modal-row"><span>Shipment ID</span><strong>${o.id}</strong></div>
      <div class="vp-modal-row"><span>Commodity</span><strong>${o.commodity}</strong></div>
      <div class="vp-modal-row"><span>Quantity</span><strong>${o.quantity}</strong></div>
      <div class="vp-modal-row"><span>Origin</span><strong>${o.origin}</strong></div>
      <div class="vp-modal-row"><span>Destination</span><strong>${o.destination}</strong></div>
      <div class="vp-modal-row"><span>Status</span><strong>${statusLabel(o.status)}</strong></div>
      <div class="vp-modal-row"><span>ETA</span><strong>${o.delivery}</strong></div>
    ` : `
      <div class="vp-modal-row"><span>Order ID</span><strong>${o.id}</strong></div>
      <div class="vp-modal-row"><span>Commodity</span><strong>${o.commodity}</strong></div>
      <div class="vp-modal-row"><span>Quantity</span><strong>${o.quantity}</strong></div>
      <div class="vp-modal-row"><span>Value</span><strong>${money(o.value)}</strong></div>
      <div class="vp-modal-row"><span>Status</span><strong>${statusLabel(o.status)}</strong></div>
      <div class="vp-modal-row"><span>Delivery</span><strong>${o.delivery}</strong></div>
      <div class="vp-modal-row"><span>Origin</span><strong>${o.origin}</strong></div>
      <div class="vp-modal-row"><span>Destination</span><strong>${o.destination}</strong></div>
    `;

    openModal({
      title: asShipment ? 'Shipment detail' : 'Order detail',
      subtitle: o.id + ' · ' + o.commodity,
      html: rows,
      actions: [
        { label: 'Close', className: 'vp-btn-outline' },
        {
          label: 'Download summary',
          icon: 'lni-download',
          className: 'vp-btn-gold',
          onClick: () => {
            const txt =
`ABOGLOBE VENDOR PORTAL
${asShipment ? 'SHIPMENT' : 'ORDER'} SUMMARY
----------------------------------------
ID: ${o.id}
Commodity: ${o.commodity}
Quantity: ${o.quantity}
Value: ${money(o.value)}
Status: ${statusLabel(o.status)}
Delivery: ${o.delivery}
Origin: ${o.origin}
Destination: ${o.destination}
Generated: ${fmtDate()}
`;
            downloadText(`${o.id}-summary.txt`, txt);
            toast('Summary downloaded');
          }
        }
      ]
    });
  }

  /* =========================================================
     DOCUMENT DOWNLOAD — real .txt
     ========================================================= */
  function downloadDoc(docId) {
    const d = state.documents.find((x) => x.id === docId);
    if (!d) return;
    const txt =
`ABOGLOBE VENDOR PORTAL
DOCUMENT: ${d.name}
----------------------------------------
Document ID: ${d.id}
Type: ${d.type}
Related order: ${d.order || 'N/A'}
Issued: ${d.issued}
Expires: ${d.expires || 'N/A'}
Status: ${statusLabel(d.status)}
Generated: ${fmtDate()}
`;
    downloadText(`${d.id}-${d.name.replace(/\s+/g, '-')}.txt`, txt);
    toast('Document downloaded');
  }

  /* =========================================================
     INVOICE DOWNLOAD — real .txt
     ========================================================= */
  function downloadInvoice(invId) {
    const inv = state.invoices.find((x) => x.id === invId);
    if (!inv) return;
    const order = state.orders.find((o) => o.id === inv.order);
    const txt =
`ABOGLOBE VENDOR PORTAL
INVOICE: ${inv.id}
----------------------------------------
Related order: ${inv.order}
Commodity: ${order ? order.commodity : 'N/A'}
Quantity: ${order ? order.quantity : 'N/A'}
Amount: ${money(inv.amount)}
Issued: ${inv.issued}
Due: ${inv.due}
Status: ${statusLabel(inv.status)}
Payable to: ABOGLOBE International INC
Generated: ${fmtDate()}
`;
    downloadText(`${inv.id}.txt`, txt);
    toast('Invoice downloaded');
  }

  /* =========================================================
     NEW ORDER MODAL
     ========================================================= */
  function openNewOrderModal() {
    const html = `
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="no-commodity">Commodity</label>
        <select class="vp-form-select" id="no-commodity">
          <option>ICUMSA 45 Sugar</option>
          <option>Brazilian Chicken</option>
          <option>EN590 Diesel</option>
          <option>3M 1826 Masks</option>
          <option>Soybean Meal</option>
        </select>
      </div>
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="no-quantity">Quantity</label>
        <input class="vp-form-input" id="no-quantity" placeholder="e.g. 12,500 MT" />
      </div>
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="no-origin">Origin</label>
        <input class="vp-form-input" id="no-origin" placeholder="e.g. Santos, BR" />
      </div>
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="no-dest">Destination</label>
        <input class="vp-form-input" id="no-dest" placeholder="e.g. Shanghai, CN" />
      </div>
      <div class="vp-form-field">
        <label class="vp-form-label" for="no-delivery">Expected delivery</label>
        <input class="vp-form-input" id="no-delivery" placeholder="e.g. Nov 30, 2025" />
      </div>
    `;
    openModal({
      title: 'New order',
      subtitle: 'Create a new purchase order',
      html,
      actions: [
        { label: 'Cancel', className: 'vp-btn-outline' },
        {
          label: 'Create order',
          icon: 'lni-plus',
          className: 'vp-btn-gold',
          onClick: (dlg) => {
            const commodity = $('#no-commodity', dlg).value;
            const quantity  = $('#no-quantity', dlg).value.trim();
            const origin    = $('#no-origin', dlg).value.trim();
            const dest      = $('#no-dest', dlg).value.trim();
            const delivery  = $('#no-delivery', dlg).value.trim();

            if (!quantity || !origin || !dest) {
              toast('Please fill in quantity, origin, and destination', 'error');
              return false; // don't close
            }

            const newOrder = {
              id: uid('ABO-2025'),
              commodity, quantity, origin, destination: dest,
              delivery: delivery || 'TBD',
              value: 0,
              status: 'pending'
            };
            state.orders.unshift(newOrder);
            save();
            renderOrdersTable();
            renderShipmentsTable();
            toast('Order created: ' + newOrder.id);
          }
        }
      ]
    });
  }

  /* =========================================================
     UPLOAD DOCUMENT MODAL
     ========================================================= */
  function openUploadDocModal() {
    const html = `
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="ud-name">Document name</label>
        <input class="vp-form-input" id="ud-name" placeholder="e.g. Bill of Lading" />
      </div>
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="ud-type">Type</label>
        <select class="vp-form-select" id="ud-type">
          <option>Shipping</option>
          <option>Compliance</option>
          <option>Finance</option>
          <option>Certification</option>
          <option>Contract</option>
        </select>
      </div>
      <div class="vp-form-field" style="margin-bottom:1rem;">
        <label class="vp-form-label" for="ud-order">Related order (optional)</label>
        <input class="vp-form-input" id="ud-order" placeholder="e.g. ABO-2025-0847" />
      </div>
      <div class="vp-form-field">
        <label class="vp-form-label" for="ud-file">File</label>
        <input class="vp-form-input" type="file" id="ud-file" />
      </div>
    `;
    openModal({
      title: 'Upload document',
      subtitle: 'Attach a file to your vendor record',
      html,
      actions: [
        { label: 'Cancel', className: 'vp-btn-outline' },
        {
          label: 'Upload',
          icon: 'lni-upload',
          className: 'vp-btn-gold',
          onClick: (dlg) => {
            const name  = $('#ud-name', dlg).value.trim();
            const type  = $('#ud-type', dlg).value;
            const order = $('#ud-order', dlg).value.trim();
            const file  = $('#ud-file', dlg).files[0];

            if (!name || !file) {
              toast('Please provide a name and select a file', 'error');
              return false;
            }

            const newDoc = {
              id: uid('DOC'),
              name,
              type,
              order,
              issued: fmtDate(),
              expires: '',
              status: 'valid'
            };
            state.documents.unshift(newDoc);
            save();
            renderDocsTable();
            toast('Document uploaded: ' + name);
          }
        }
      ]
    });
  }

  /* =========================================================
     INVENTORY MODAL
     ========================================================= */
  function openInventoryModal() {
    const items = [
      { name: 'ICUMSA 45 Sugar',   stock: '18,400 MT',  inTransit: '12,500 MT' },
      { name: 'Brazilian Chicken', stock: '6,200 MT',   inTransit: '0 MT' },
      { name: 'EN590 Diesel',      stock: '40,000 MT',  inTransit: '25,000 MT' },
      { name: '3M 1826 Masks',     stock: '1,100,000',  inTransit: '2,400,000' },
      { name: 'Soybean Meal',      stock: '8,500 MT',   inTransit: '10,000 MT' }
    ];
    const html = `
      <table class="vp-modal-table">
        <thead><tr><th>Product</th><th>In stock</th><th>In transit</th></tr></thead>
        <tbody>
          ${items.map((i) => `
            <tr>
              <td>${i.name}</td>
              <td>${i.stock}</td>
              <td>${i.inTransit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
    openModal({
      title: 'Inventory overview',
      subtitle: 'Live stock and in-transit volumes',
      html,
      actions: [{ label: 'Close', className: 'vp-btn-outline' }]
    });
  }

  /* =========================================================
     MESSAGES MODAL
     ========================================================= */
  function openMessagesModal() {
    const html = `
      <div class="vp-msg-list">
        ${state.messages.map((m) => `
          <div class="vp-msg" data-msg-id="${m.id}">
            <div class="vp-msg-avatar">${m.initials}</div>
            <div class="vp-msg-body">
              <div class="vp-msg-head">
                <strong>${m.from}</strong>
                <span>${m.when}</span>
              </div>
              <p>${m.body}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
    openModal({
      title: 'Messages',
      subtitle: 'Secure communication with ABOGLOBE',
      html,
      actions: [{ label: 'Close', className: 'vp-btn-outline' }]
    });
    // Mark as read
    state.messages.forEach((m) => (m.unread = false));
    save();
    updateBadges();
  }

  /* =========================================================
     NOTIFICATION DROPDOWN
     ========================================================= */
  function renderNotifications() {
    const panel = $('.vp-notif-dropdown');
    if (!panel) return;
    panel.innerHTML = state.notifications.map((n) => `
      <a href="${n.link}" class="vp-notif-item" data-notif-link>
        <div class="vp-notif-icon"><i class="lni ${n.icon}" aria-hidden="true"></i></div>
        <div class="vp-notif-text">
          <strong>${n.title}</strong>
          <span>${n.body}</span>
          <div class="vp-notif-time">${n.when}</div>
        </div>
      </a>
    `).join('');
  }

  function updateBadges() {
    const unread = state.messages.filter((m) => m.unread).length;
    $$('.vp-badge-count').forEach((el) => {
      el.textContent = String(Math.max(unread, state.notifications.length));
      el.style.display = unread > 0 || state.notifications.length > 0 ? '' : 'none';
    });
  }

  /* =========================================================
     PAGE-SPECIFIC FORMS
     ========================================================= */
  function bindProfileForm() {
    const form = $('#vp-profile-form');
    if (!form) return;
    // Pre-fill from state
    const fields = ['company', 'reg', 'type', 'industry', 'country', 'city',
                    'firstName', 'lastName', 'email', 'phone', 'bank', 'swift', 'account', 'currency'];
    fields.forEach((k) => {
      const el = form.querySelector(`[name="${k}"]`);
      if (el) el.value = state.profile[k] || '';
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      fields.forEach((k) => {
        const el = form.querySelector(`[name="${k}"]`);
        if (el) state.profile[k] = el.value;
      });
      state.user.firstName = state.profile.firstName;
      state.user.lastName = state.profile.lastName;
      state.user.initials = (state.profile.firstName[0] || '') + (state.profile.lastName[0] || '');
      save();
      updateUserUI();
      toast('Profile saved');
    });
  }

  function bindSettingsForm() {
    const form = $('#vp-settings-form');
    if (!form) return;
    // Pre-fill
    form.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      const key = cb.dataset.setting;
      if (key) cb.checked = !!state.settings[key];
    });
    const tfa = form.querySelector('[name="twoFactor"]');
    if (tfa) tfa.value = state.settings.twoFactor;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
        const key = cb.dataset.setting;
        if (key) state.settings[key] = cb.checked;
      });
      if (tfa) state.settings.twoFactor = tfa.value;
      save();
      toast('Settings saved');
    });

    const delBtn = form.querySelector('[data-delete-account]');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        if (!confirm('Delete your account? This cannot be undone.')) return;
        localStorage.removeItem(STORAGE_KEY);
        window.location.href = 'login.html';
      });
    }
  }

  function updateUserUI() {
    $$('.vp-user-meta strong').forEach((el) => {
      el.textContent = state.user.firstName + ' ' + state.user.lastName;
    });
    $$('.vp-user-meta span').forEach((el) => {
      el.textContent = state.user.company;
    });
    $$('.vp-user-avatar').forEach((el) => {
      el.textContent = state.user.initials;
    });
    const hi = $('.vp-content h2');
    if (hi && hi.textContent.includes('Good')) {
      hi.textContent = `Good afternoon, ${state.user.firstName}`;
    }
  }

  /* =========================================================
     EVENT DELEGATION — actions in tables
     ========================================================= */
  function bindActions() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.dataset.action;
      const id = btn.dataset.id;

      if (action === 'view-order') {
        e.preventDefault();
        openOrderModal(id, false);
      } else if (action === 'view-shipment') {
        e.preventDefault();
        openOrderModal(id, true);
      } else if (action === 'download-doc') {
        e.preventDefault();
        downloadDoc(id);
      } else if (action === 'download-invoice') {
        e.preventDefault();
        downloadInvoice(id);
      }
    });

    // New Order button
    $$('[data-new-order]').forEach((btn) =>
      btn.addEventListener('click', (e) => { e.preventDefault(); openNewOrderModal(); })
    );

    // Upload Document button
    $$('[data-upload-doc]').forEach((btn) =>
      btn.addEventListener('click', (e) => { e.preventDefault(); openUploadDocModal(); })
    );

    // Inventory link
    $$('[data-inventory]').forEach((btn) =>
      btn.addEventListener('click', (e) => { e.preventDefault(); openInventoryModal(); })
    );

    // Messages button
    $$('[data-messages]').forEach((btn) =>
      btn.addEventListener('click', (e) => { e.preventDefault(); openMessagesModal(); })
    );
  }

  /* =========================================================
     NOTIFICATIONS DROPDOWN
     ========================================================= */
  function bindNotifications() {
    const notifBtn = $('[data-notif-toggle]');
    const notifPanel = $('.vp-notif-dropdown');
    if (!notifBtn || !notifPanel) return;

    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!notifPanel.contains(e.target) && !notifBtn.contains(e.target)) {
        notifPanel.classList.remove('open');
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') notifPanel.classList.remove('open');
    });
  }

  /* =========================================================
     SIDEBAR MOBILE TOGGLE
     ========================================================= */
  function bindSidebar() {
    const toggle = $('#vp-menu-toggle');
    const sidebar = $('#vp-sidebar');
    const content = $('.vp-main');
    if (!toggle || !sidebar) return;

    const check = () => {
      const mobile = window.innerWidth <= 900;
      toggle.style.display = mobile ? 'flex' : 'none';
      if (!mobile) sidebar.classList.remove('open');
    };
    check();
    window.addEventListener('resize', check);
    toggle.addEventListener('click', () => sidebar.classList.toggle('open'));
    if (content) {
      content.addEventListener('click', () => {
        if (window.innerWidth <= 900) sidebar.classList.remove('open');
      });
    }
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') sidebar.classList.remove('open');
    });
  }

  /* =========================================================
     ACTIVE NAV
     ========================================================= */
  function bindActiveNav() {
    const current = window.location.pathname.split('/').pop() || 'vendor-portal.html';
    $$('.vp-nav-link').forEach((link) => {
      const href = link.getAttribute('href');
      if (!href) return;
      if (href === current) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  /* =========================================================
     INIT
     ========================================================= */
  document.addEventListener('DOMContentLoaded', () => {
    bindSidebar();
    bindActiveNav();
    bindNotifications();
    bindSearch();
    bindActions();
    bindProfileForm();
    bindSettingsForm();

    renderOrdersTable();
    renderShipmentsTable();
    renderDocsTable();
    renderInvoicesTable();
    renderNotifications();
    updateBadges();
    updateUserUI();
  });

})();