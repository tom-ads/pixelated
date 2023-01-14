import {
  matchedData,
  ValidationChain,
  validationResult,
} from "express-validator";
import { Response, Request } from "express";

export type ValidatorFn<
  T extends Record<string, ValidationChain> = Record<string, ValidationChain>
> = new () => {
  schema: T;
};

export async function validate<
  T extends Record<string, ValidationChain> = Record<string, ValidationChain>
>(
  validator: ValidatorFn<T>,
  request: Request,
  response: Response
): Promise<{ [K in keyof T]: any }> {
  // Create an instance of the passed in validator
  const validatorInstance = new validator();
  if (!validatorInstance || !validatorInstance?.schema) {
    throw new Error("Failed to create an instance of validator");
  }

  // Run each Validator defined inside the schema in parallel
  await Promise.all(
    Object.values(validatorInstance.schema).map(
      async (validator) => await validator.run(request)
    )
  );

  // Check for validation errors, and throw a 422 if found
  const errors = validationResult(request);
  if (!errors.isEmpty()) {
    return response.status(400).json({ errors: errors.array() }) as {
      [K in keyof T]: any;
    };
  }

  return matchedData(request, { onlyValidData: true }) as {
    [K in keyof T]: any;
  };
}
