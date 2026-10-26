/* ฟอร์มปรึกษาฟรี / ขอใบเสนอราคา สำหรับ www.unjaiit.com (task 09)
   ใส่ที่ไหนก็ได้ในหน้า: <div data-unjai-lead data-product="รหัสสินค้า(slug)"></div> แล้วโหลด <script src="…/lead.js" defer></script>
   ส่งไป https://partner.unjaiit.com/api/lead.create (ส่ง cookie ref/utm ที่ .unjaiit.com ไปด้วย — พาร์ทเนอร์ผูกอัตโนมัติ)
   ไม่มี dependency · ไม่ใช้ innerHTML กับข้อมูลผู้ใช้ */
(function () {
  'use strict';
  var API = 'https://partner.unjaiit.com/api/lead.create';
  var PRIVACY = 'https://opernix.unjaiit.com/legal/?doc=privacy';

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    Object.keys(attrs || {}).forEach(function (k) { if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return; if (k === 'text') n.textContent = attrs[k]; else n.setAttribute(k, attrs[k] === true ? '' : attrs[k]); });
    (kids || []).forEach(function (c) { if (c) n.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return n;
  }
  function rid() { var a = new Uint8Array(12); crypto.getRandomValues(a); return 'req_' + Array.prototype.map.call(a, function (b) { return ('0' + b.toString(16)).slice(-2); }).join(''); }
  var STYLE = '.ul-f{font-family:Sarabun,Prompt,sans-serif;max-width:560px;display:grid;gap:14px}.ul-f label{font-weight:600;display:block;margin-bottom:4px}.ul-f input[type=text],.ul-f input[type=tel],.ul-f select,.ul-f textarea{width:100%;min-height:48px;border:2px solid #cfd8d3;border-radius:12px;padding:10px 14px;font:inherit;box-sizing:border-box}.ul-f textarea{min-height:96px}.ul-f button{min-height:48px;border:0;border-radius:999px;background:#0B6B4E;color:#fff;font:inherit;font-weight:600;padding:0 28px;cursor:pointer}.ul-f button[disabled]{opacity:.6}.ul-f .ul-e{color:#B42318;margin:0}.ul-f .ul-c{display:flex;gap:10px;align-items:flex-start;font-weight:400}.ul-f .ul-c input{width:22px;height:22px;margin-top:3px}.ul-ok a{display:inline-block;min-height:48px;line-height:48px;padding:0 28px;border-radius:999px;background:#0B6B4E;color:#fff;text-decoration:none;font-weight:600}';

  function mount(host) {
    var product = host.getAttribute('data-product') || '';
    if (!/^[a-z0-9][a-z0-9-]{0,63}$/.test(product)) return;
    var requestId = rid();
    var err = el('p', { class: 'ul-e', role: 'alert', hidden: true });
    function inp(id, label, type, extra) { var i = el('input', Object.assign({ id: 'ul-' + id, name: id, type: type || 'text' }, extra || {})); return el('div', {}, [el('label', { for: 'ul-' + id, text: label }), i]); }
    var pref = el('select', { id: 'ul-contact_pref', name: 'contact_pref' }, [el('option', { value: 'phone', text: 'โทรศัพท์' }), el('option', { value: 'line', text: 'LINE' })]);
    var msg = el('textarea', { id: 'ul-message', name: 'message', maxlength: '500' });
    var trap = el('div', { 'aria-hidden': 'true', style: 'position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden' }, [el('input', { name: 'website', type: 'text', tabindex: '-1', autocomplete: 'off' })]);
    var consent = el('input', { type: 'checkbox', name: 'accept_privacy' });
    var mk = el('input', { type: 'checkbox', name: 'marketing_opt_in' });
    var btn = el('button', { type: 'submit', text: 'ส่งข้อมูล ให้ทีมงานติดต่อกลับ' });
    var form = el('form', { class: 'ul-f', novalidate: true, 'aria-label': 'ฟอร์มปรึกษาฟรี' }, [
      err, inp('name', 'ชื่อ', 'text', { autocomplete: 'name' }), inp('phone', 'เบอร์โทร', 'tel', { autocomplete: 'tel', inputmode: 'tel', placeholder: '0812345678' }),
      el('div', {}, [el('label', { for: 'ul-contact_pref', text: 'ให้ติดต่อกลับทาง' }), pref]), inp('area', 'พื้นที่ / จังหวัด (ถ้ามี)', 'text'),
      el('div', {}, [el('label', { for: 'ul-message', text: 'รายละเอียด (ไม่บังคับ)' }), msg]), trap,
      el('label', { class: 'ul-c' }, [consent, el('span', {}, ['ฉันรับทราบ ', el('a', { href: PRIVACY, target: '_blank', rel: 'noopener', text: 'นโยบายความเป็นส่วนตัว' }), ' และยินยอมให้ติดต่อกลับ'])]),
      el('label', { class: 'ul-c' }, [mk, el('span', { text: 'ส่งข่าวสารและโปรโมชั่นให้ได้ (ไม่บังคับ)' })]), btn
    ]);
    host.appendChild(el('style', { text: STYLE }));
    host.appendChild(form);
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (btn.disabled) return;
      err.hidden = true;
      var v = function (n) { return form.elements[n] ? form.elements[n].value : ''; };
      if (!v('name').trim()) { err.textContent = 'กรุณากรอกชื่อ'; err.hidden = false; return; }
      if (!/^0\d{8,9}$/.test(v('phone').replace(/[\s-]/g, ''))) { err.textContent = 'กรุณากรอกเบอร์โทรให้ถูกต้อง เช่น 0812345678'; err.hidden = false; return; }
      if (!consent.checked) { err.textContent = 'กรุณาติ๊กรับทราบนโยบายความเป็นส่วนตัว'; err.hidden = false; return; }
      btn.disabled = true; var old = btn.textContent; btn.textContent = 'กำลังส่ง…';
      var q = new URLSearchParams(location.search);
      fetch(API, {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_slug: product, name: v('name'), phone: v('phone'), contact_pref: v('contact_pref'), area: v('area'), message: v('message'), website: v('website'), consent_version: 'web', marketing_opt_in: mk.checked, utm: { utm_source: q.get('utm_source') || '', utm_medium: q.get('utm_medium') || '', utm_campaign: q.get('utm_campaign') || '' }, request_id: requestId })
      }).then(function (r) { return r.json(); }).then(function (r) {
        if (!r.ok) throw r.error || {};
        var kids = [el('h3', { text: 'ขอบคุณ ทีมงานจะติดต่อกลับ' })];
        if (r.data.lead_code) kids.push(el('p', { text: 'รหัสลีดของคุณ ' + r.data.lead_code + ' — ทักไลน์พร้อมรหัสนี้ได้ถ้าต้องการให้เร็วขึ้น' }));
        if (r.data.line_url) kids.push(el('a', { href: r.data.line_url, target: '_blank', rel: 'noopener', text: 'เปิดไลน์พร้อมรหัสลีด' }));
        host.replaceChildren(el('div', { class: 'ul-ok', role: 'status' }, kids));
      }).catch(function (e) {
        btn.disabled = false; btn.textContent = old;
        err.textContent = (e && e.message_th) || 'ส่งข้อมูลไม่สำเร็จ กรุณาลองใหม่ หรือทักไลน์ทีมงาน'; err.hidden = false;
      });
    });
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-unjai-lead]'), mount); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
