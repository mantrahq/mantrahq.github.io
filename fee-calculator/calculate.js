const debug = true;
const vat = 0.2;
const legalComm = 125;
const legalFirms = [
  {
    name: 'taylorEmett',
    bands: [
      {
        price: 0,
        legal: 475,
        tt: 35,
      },
      {
        price: 300000,
        legal: 550,
        tt: 36,
      },
      {
        price: 500000,
        legal: 650,
        tt: 37,
      },
      {
        price: 750000,
        legal: 790,
        tt: 38,
      },
      {
        price: 1000000,
        legal: 940,
        tt: 39,
      },
      {
        price: 1500000,
        legal: 124,
        tt: 40,
      },
      {
        price: 1500000,
        legal: 170,
        tt: 41,
      },
    ]
  }
];
const eaBands = [
  {
    price: 0,
    ea: 0.01,
  },
  {
    price: 500000,
    ea: 0.009,
  },
  {
    price: 600000,
    ea: 0.0085,
  },
  {
    price: 700000,
    ea: 0.008,
  }
]
const discountBands = [
  {
    upfront: 300,
    discount: 10,
  },
  {
    upfront: 450,
    discount: 12.5,
  },
  {
    upfront: 600,
    discount: 15,
  },
  {
    upfront: 750,
    discount: 17.5,
  },
  {
    upfront: 900,
    discount: 20,
  },
]

function withVat(n) {
  return n + (n * vat);
}

function getLegalFee(price, firm) {
  let legal;
  const firmData = legalFirms.find(f => f.name === firm);

  firmData.bands.reverse().forEach((r) => {
    if (price >= r.price) {
      legal = r.legal + r.tt;
    }
  });
  return legal;
}

function getEaFee(price) {
  let ea;
  eaBands.reverse().forEach((r) => {
    if (price >= r.price) {
      ea = price * r.ea;
    }
  });
  return ea;
}

function getDiscount(upfront) {
  let discount;
  discountBands.reverse().forEach((r) => {
    if (upfront >= r.upfront) {
      discount = r.discount;
    }
  });
  return discount;
}

function calculate(d) {
  let legalExtras = 0;
  if (d.legalExtras) {
    legalExtras = Object.keys(d.legalExtras)
    .reduce((sum, key) => sum + parseFloat(d.legalExtras[key] || 0), 0);
  }
  const price = parseFloat(d.price) || 0;
  const package = parseFloat(d.package) || 0;
  const legal = getLegalFee(price, d.firm);
  const legalWithVat = withVat(legal);
  const ea = getEaFee(price);
  const eaWithVat = withVat(ea);
  const total = ea + legal + legalComm + legalExtras + package;
  const totalWithVat = withVat(ea) + withVat(legal) + legalComm + legalExtras + package;
  const eaAsPercentage = withVat(ea) / price * 100;
  const totalAsPercentage = totalWithVat / price * 100;
  return {
    price,
    ea,
    eaWithVat,
    legal,
    legalWithVat,
    legalExtras,
    total,
    totalWithVat,
    eaAsPercentage,
    totalAsPercentage,
  };
}

function discount(f, u, p) {
  const fees = parseFloat(f);
  const price = parseFloat(p);
  const upfront = parseFloat(u);
  const discount = getDiscount(upfront);
  const balance = fees - upfront;
  const balanceAfterDiscount = balance - (balance * (discount / 100));
  const totalPaid = balanceAfterDiscount + upfront;
  const totalDiscount = fees - totalPaid;
  const percentageOfValue = totalPaid / price * 100;
  return {
    discount,
    balance,
    balanceAfterDiscount,
    totalPaid,
    totalDiscount,
    percentageOfValue,
  }
}
