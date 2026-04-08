import bcrypt from "bcrypt";

export const hash = ({ plainText, rounds = Number(process.env.ROUNDS) }) => {
  return bcrypt.hashSync(plainText, rounds);
};

export const compare = ({ plainText, hash }) => {
  return bcrypt.compareSync(plainText, hash);
};
