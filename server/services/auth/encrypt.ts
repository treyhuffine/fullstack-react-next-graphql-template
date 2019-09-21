import * as crypto from 'crypto';

// TODO: Implement for real
// https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb

const ALGORITHM = 'aes-256-ctr';
const USER_FORMAT = 'utf8';
const ENCRYPT_FORMAT = 'hex';
const password = process.env.OAUTH_TOKEN_ENCRYPTION_PASSWORD;

export const encrypt = text => {
  if (!text) {
    return;
  }

  const cipher = crypto.createCipheriv(ALGORITHM, password, null);
  let crypted = cipher.update(text, USER_FORMAT, ENCRYPT_FORMAT);
  crypted += cipher.final(ENCRYPT_FORMAT);
  return crypted;
};

export const decrypt = text => {
  if (!text) {
    return;
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, password, null);
  let dec = decipher.update(text, ENCRYPT_FORMAT, USER_FORMAT);
  dec += decipher.final(USER_FORMAT);
  return dec;
};
