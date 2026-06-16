import crypto from 'crypto';

const password = 'password';

const salt = crypto
  .randomBytes(16)
  .toString('hex');

crypto.scrypt(
  password,
  salt,
  32,
  (err, key) => {
    if (err) throw err;

    console.log('salt:');
    console.log(salt);

    console.log('hash:');
    console.log(
      key.toString('hex')
    );
  }
);