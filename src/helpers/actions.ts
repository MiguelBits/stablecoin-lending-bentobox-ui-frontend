import { ethers } from 'ethers';

const abiCoder = new ethers.AbiCoder();

const repay = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  share: any,
  to: any,
  skim: any,
  value = 0
) => {
  const methodId = 2;

  const encode = abiCoder.encode(
    ['int256', 'address', 'bool'],
    [share, to, skim]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const removeCollateral = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  fraction: any,
  to: any,
  value = 0
) => {
  const methodId = 4;

  const encode = abiCoder.encode(['int256', 'address'], [fraction, to]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const borrow = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  amount: any,
  to: any,
  value = 0
) => {
  const methodId = 5;

  const encode = abiCoder.encode(['int256', 'address'], [amount, to]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const getRepayShare = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  part: any,
  value = 0
) => {
  const methodId = 6;

  const encode = abiCoder.encode(['int256'], [part]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const getRepayPart = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  amount: any,
  value = 0
) => {
  const methodId = 7;

  const encode = abiCoder.encode(['int256'], [amount]);

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const addCollateral = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  share: any,
  to: any,
  skim: any,
  value = 0
) => {
  const methodId = 10;

  const encode = abiCoder.encode(
    ['int256', 'address', 'bool'],
    [share, to, skim]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const updateExchangeRate = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  mustUpdate: any,
  minRate = '0x00',
  maxRate = '0x00',
  value = 0
) => {
  const methodId = 11;

  const encode = abiCoder.encode(
    ['bool', 'uint256', 'uint256'],
    [mustUpdate, minRate, maxRate]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoDeposit = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  token: any,
  to: any,
  amount: any,
  share: any,
  value = 0
) => {
  const methodId = 20;

  const encode = abiCoder.encode(
    ['address', 'address', 'int256', 'int256'],
    [token, to, amount, share]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoWithdraw = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  token: any,
  to: any,
  amount: any,
  share: any,
  value = 0
) => {
  const methodId = 21;

  const encode = abiCoder.encode(
    ['address', 'address', 'int256', 'int256'],
    [token, to, amount, share]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const bentoSetApproval = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  user: any,
  masterContract: any,
  approved: any,
  v: any,
  r: any,
  s: any,
  values = 0
) => {
  const methodId = 24;

  const encode = abiCoder.encode(
    ['address', 'address', 'bool', 'uint8', 'bytes32', 'bytes32'],
    [user, masterContract, approved, v, r, s]
  );

  cookData.events.push(methodId);
  cookData.values.push(values);
  cookData.datas.push(encode);

  return cookData;
};

const call = (
  cookData: { events: number[]; values: number[]; datas: string[] },
  callee: any,
  callData: any,
  useValue1: any,
  useValue2: any,
  returnValues: any,
  value = 0
) => {
  const methodId = 30;

  const encode = abiCoder.encode(
    ['address', 'bytes', 'bool', 'bool', 'uint8'],
    [callee, callData, useValue1, useValue2, returnValues]
  );

  cookData.events.push(methodId);
  cookData.values.push(value);
  cookData.datas.push(encode);

  return cookData;
};

const actions = {
  repay,
  removeCollateral,
  borrow,
  getRepayShare,
  getRepayPart,
  addCollateral,
  updateExchangeRate,
  bentoDeposit,
  bentoWithdraw,
  bentoSetApproval,
  call,
};

export { actions };
