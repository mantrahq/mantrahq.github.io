/*
const form = document.querySelector('#form');
form.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = $(form).serializeJSON();
  console.log('SUBMITTED', formData)
  calculate(formData);
});
*/
/* eslint-env browser */
/* global $ Handlebars notify countryCodes validateCountryCode */

function disableForm(form) {
  const elements = form.querySelectorAll('input, select, button');
  elements.forEach((element) => {
    const el = element;
    if (el.disabled) {
      el.setAttribute('data-disabled', 'true');
    }
    if (el.readOnly) {
      el.setAttribute('data-read-only', 'true');
    }
    el.disabled = true;
    el.readOnly = true;
  });
}

function enableForm(form) {
  const elements = form.querySelectorAll('input, select, button');
  elements.forEach((element) => {
    const el = element;
    const disabled = el.getAttribute('data-disabled');
    const readOnly = el.getAttribute('data-read-only');
    if (!disabled) {
      el.disabled = false;
    }
    if (!readOnly) {
      el.readOnly = false;
    }
  });
}

function startProgress(form) {
  document.getElementById('progress').style.transform = 'translateY(0)';
  if (form) disableForm(form);
}

function stopProgress(form) {
  document.getElementById('progress').style.transform = 'translateY(-100%)';
  if (form) enableForm(form);
}

const outputs = document.querySelectorAll('[data-output]')
function updateOutput(name, data) {
  Array.prototype.forEach.call(outputs, (el) => {
    const outputName = el.getAttribute('data-output');
    if (outputName === name) {
      if (el.tagName === 'INPUT') {
        el.value = data;
      } else {
        el.innerHTML = data;
      }
    }
  });
}

function updateOutputs(data) {
  for (const [name, value] of Object.entries(data)) {
    updateOutput(name, value);
  }
}


let App;
const APPISC = {
  common: () => { },

  discount: (viewEl) => {
    const el = viewEl;
    const upfront = el.querySelector('[type="range"]');
    const fees = el.querySelector('input[data-output="totalWithVat"]');
    const price = el.querySelector('input[data-output="price"]');
    function showDiscount(fees = 0, upfrontVal = 0, price = 0) {
      const discountData = discount(fees, upfrontVal, price);
      updateOutputs(discountData);
    }
    upfront.addEventListener('input', (event) => {
      const upfrontVal = event.target.value;
      const fees = el.querySelector('input[data-output="totalWithVat"]');
      showDiscount(fees.value, upfrontVal, price.value);
    });

    showDiscount(fees.value, upfront.value, price.value)
  },

  range: (viewEl) => {
    const el = viewEl;
    const ctrl = el.querySelector('[type="range"]');
    const output = el.querySelector('[data-view-output]')
    ctrl.addEventListener('input', (event) => {
      output.value = ctrl.value;
    });
  },

  calculate: (viewEl) => {
    const el = viewEl;
    const initialized = el.hasAttribute('data-init');

    if (!initialized) {
      el.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = $(el).serializeJSON();
        const totals = calculate(formData);
        if (totals) {
          $('#collapseDiscount').collapse('show')
        }
        updateOutputs(totals);
        App.refreshView('discount');
      });
    }
  },

  init: () => {
    App.exec('common');
    App.initViews();
  },
};

App = {
  exec: (view, el) => {
    const ns = APPISC;
    if (view !== '' && ns[view]) {
      ns[view](el);
      if (el) el.setAttribute('data-init', 'true');
    }
  },
  refreshView: (view) => {
    const viewEls = document.querySelectorAll(`[data-view="${view}"]`);
    Array.prototype.forEach.call(viewEls, (el) => {
      App.exec(view, el);
    });
  },
  initViews: () => {
    const viewEls = document.querySelectorAll('[data-view]');
    Array.prototype.forEach.call(viewEls, (el) => {
      if (!el.hasAttribute('data-init')) {
        const view = el.getAttribute('data-view');
        App.exec(view, el);
      }
    });
  },
  init: () => {
    App.exec('common');
    App.initViews();
  },
};

if (document.attachEvent
  ? document.readyState === 'complete'
  : document.readyState !== 'loading') {
  App.init();
} else {
  document.addEventListener('DOMContentLoaded', App.init);
}
