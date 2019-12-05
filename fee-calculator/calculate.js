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
        price: 150000,
        legal: 550,
        tt: 36,
      },
      {
        price: 300000,
        legal: 650,
        tt: 37,
      },
      {
        price: 500000,
        legal: 790,
        tt: 38,
      },
      {
        price: 750000,
        legal: 940,
        tt: 39,
      },
      {
        price: 1000000,
        legal: 1240,
        tt: 40,
      },
      {
        price: 1500000,
        legal: 1700,
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
] // 
const discountBands = [
  {
    upfront: 0,
    discount: 0,
  },
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

const legalExtrasOptions = [
  {
    name: 'fhHouse',
    price: 0,
  },
  {
    name: 'lhHouse',
    price: 75,
  },
  {
    name: 'lhFlat',
    price: 175,
  },
  {
    name: 'mortgage',
    price: 100,
  },
];

function withVat(n) {
  return n + (n * vat);
}

function justVat(n) {
  return (n * vat);
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

function getLegalExtra(legalExtra) {
  let legal;
  const legalExtraData = legalExtrasOptions.find(l => l.name === legalExtra);
  return legalExtraData.price;
}

function calculate(d) {
  let legalExtras = 0;
  if (d.legalExtras) {
    legalPrices = Object.values(d.legalExtras).map((cur) => {
      return getLegalExtra(cur);
    })
    legalExtras = legalPrices.reduce((sum, price) => sum + price || 0, 0);
  }
  const price = parseFloat(d.price) || 0;
  const package = parseFloat(d.package) || 0;
  const legal = Math.ceil(getLegalFee(price, d.firm));
  const legalWithVat = Math.ceil(withVat(legal));
  const ea = Math.ceil(getEaFee(price));
  const eaWithVat = Math.ceil(withVat(ea));
  const total = ea + legal + legalComm + legalExtras + package;
  const totalVat = justVat(legal) + justVat(ea);
  const totalWithVat = eaWithVat + legalWithVat + legalComm + legalExtras + package;
  const eaAsPercentage = (eaWithVat / price * 100).toFixed(1);
  const totalAsPercentage = (totalWithVat / price * 100).toFixed(2);
  console.log(`totalAsPercentage = ${totalWithVat} / ${price} * 100 = ${totalAsPercentage}`)
  return {
    price,
    ea,
    eaWithVat,
    legal,
    legalWithVat,
    legalExtras,
    total,
    totalVat,
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
    upfront: upfront.toFixed(),
    discount: discount,
    balance: balance.toFixed(),
    balanceAfterDiscount: balanceAfterDiscount.toFixed(),
    totalPaid: totalPaid.toFixed(),
    totalDiscount: totalDiscount.toFixed(),
    percentageOfValue: percentageOfValue.toFixed(2),
  }
}
