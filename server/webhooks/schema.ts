import joi from 'joi'

// Field validation schema
export const fieldSchema = joi.object().keys({
  /**
   * The full name of the lead reference
   * Required, at least 2 characters
   */
  name: joi.string().min(2).required(),

  /**
   * The email address of the lead reference
   * Required, strictly use known email format
   */
  email: joi.string().email().required(),

  /**
   * The phone number of the lad reference,
   * Required, can have plus sign in the beginning, the rest must be a number
   */
  phone: joi
    .string()
    .pattern(/^\+?\d+$/)
    .required(),

  /**
   * Other information, such as address, origin, gender and much more
   * Optional, if specified, the object must have at least 1 key
   */
  other: joi.object().optional().min(1),
})
