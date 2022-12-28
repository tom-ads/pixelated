import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import { ValidatorFn, ValidatorReturn } from "../../types";

/* 
  ValidateMiddleware

  Sets the validate() method onto the Express Request object, so the
  route can directly pass its own validator. It uses the express-validator
  package to pass in a ValidationChain[] where each validator is ran.

  If an error is found, this will throw a 422 w/ related error messages back
  to the requester.
*/
function validationMiddleware(
  request: Request,
  response: Response,
  next: NextFunction
) {
  request.validate = async function (validator: ValidatorFn) {
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
      response.status(400).json({ errors: errors.array() });
    }

    return matchedData(request, { onlyValidData: true }) as ValidatorReturn;
  };

  next();
}

export default validationMiddleware;
