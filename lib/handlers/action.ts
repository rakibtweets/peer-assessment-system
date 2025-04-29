'use server';

import { ZodError, type ZodSchema } from 'zod';
import { ValidationError } from '../http-errors';
import dbConnect from '../db/mongoose';

type ActionOptions<T> = {
  params?: T;
  schema?: ZodSchema<T>;
};

async function action<T>({ params, schema }: ActionOptions<T>) {
  if (schema && params) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        return new ValidationError(
          error.flatten().fieldErrors as Record<string, string[]>
        );
      }
      return new Error('Schema validation failed');
    }
  }

  await dbConnect();

  return { params };
}

export default action;
