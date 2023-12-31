import { UsersPermissionsRegisterInput } from 'graphql/generated/globalTypes'
import Joi from 'joi'

const fieldsValidations = {
  username: Joi.string().min(5).required(),
  email: Joi.string().email({ tlds: false }).required(),
  password: Joi.string().required(),
  confirm_password: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({ 'any.only': 'confirm password does not match with password' })
}

export type FieldErrors = {
  [key: string]: string
}

function getFieldErrors(objError: Joi.ValidationResult) {
  const errors: FieldErrors = {}
  if (objError.error) {
    objError.error.details.forEach((item) => {
      errors[item.path.join('.')] = item.message
    })
  }
  return errors
}

export function signUpValidate(values: UsersPermissionsRegisterInput) {
  const schema = Joi.object(fieldsValidations)
  return getFieldErrors(schema.validate(values, { abortEarly: false }))
}

type SignInValues = Omit<UsersPermissionsRegisterInput, 'username'>
export function signInValidate(values: SignInValues) {
  const { email, password } = fieldsValidations
  const schema = Joi.object({ email, password })

  return getFieldErrors(schema.validate(values, { abortEarly: false }))
}

type ForgotValues = Pick<UsersPermissionsRegisterInput, 'email'>
export function forgotValidate(values: ForgotValues) {
  const { email } = fieldsValidations
  const schema = Joi.object({ email })
  return getFieldErrors(schema.validate(values, { abortEarly: false }))
}

type ResetValues = {
  password: string
  confirm_password: string
}

export function resetValidate(values: ResetValues) {
  const { password, confirm_password } = fieldsValidations
  const schema = Joi.object({ password, confirm_password })
  return getFieldErrors(schema.validate(values, { abortEarly: false }))
}
