/**
 * Abstract class that serves as a base for managing error messages
 * in Angular forms. This class defines methods for retrieving
 * error messages based on field names and validation error keys.
 * It can be extended to provide custom error message handling logic.
 */
export abstract class AbstractMessageManager {
  /**
   * Retrieves an error message for a specific form control validation error.
   *
   * @param field - The name of the form control or field associated with the error.
   *                Example: "email", "password", "username".
   *
   * @param errorKey - The key identifying the type of validation error.
   *                   Common Angular validation keys include:
   *                   - "required" (when the field is empty)
   *                   - "minlength" (when the value is shorter than allowed)
   *                   - "maxlength" (when the value is longer than allowed)
   *                   - "email" (when the value is not a valid email address)
   *
   * @param errorValue - Additional context or parameters for the error, if any.
   *                     Example:
   *                     - For "minlength", errorValue might include:
   *                       `{ requiredLength: 3, actualLength: 1 }`
   *                     - For custom validators, it might include any extra
   *                       metadata associated with the error.
   *
   * @returns A string message that describes the validation error. The
   *          implementation of this method should provide a user-friendly
   *          and readable error message based on the field name and error type.
   *
   * @example
   * ```
   * const messageManager = new CustomMessageManager();
   * const message = messageManager.getErrorMessage("email", "required");
   * console.log(message); // "Email is required."
   * ```
   */
  abstract getErrorMessage(
    field: string,
    errorKey: string,
    errorValue?: any
  ): string;
}
