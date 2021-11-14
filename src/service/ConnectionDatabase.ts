import { connect } from 'mongoose';

export async function getDatabaseConnection() {
  await connect(
    `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
  ).catch(error => console.log('Connection error MongoDB', error));
}
