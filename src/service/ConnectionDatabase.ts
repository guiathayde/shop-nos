import { connect } from 'mongoose';

export async function getConnection() {
  await connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ).catch(error => console.log('Connection error MongoDB', error));
}
