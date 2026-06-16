import crypto from 'crypto';

const users = ['password', 'password', 'password'];

users.forEach((pwd) => {
  const salt = crypto.randomBytes(16).toString('hex');

  crypto.scrypt(pwd, salt, 32, (err, key) => {
    console.log({
      salt,
      hash: key.toString('hex')
    });
  });
});