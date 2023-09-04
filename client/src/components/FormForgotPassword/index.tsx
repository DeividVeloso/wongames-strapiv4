import Button from 'components/Button'
import TextField from 'components/TextField'
import {
  CheckCircleOutline,
  Email,
  ErrorOutline
} from '@styled-icons/material-outlined'
import {
  FormWrapper,
  FormLoading,
  FormError,
  FormSucess
} from 'components/Form'
import { useState } from 'react'
import { FieldErrors, forgotValidate } from 'utils/validations'
import { useRouter } from 'next/router'

const FormForgotPassword = () => {
  const { query } = useRouter()
  const [fieldError, setFieldError] = useState<FieldErrors>()
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState(false)

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState({
    email: (query.email as string) || ''
  })

  const handleInput = (field: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const errors = forgotValidate(values)

    if (Object.keys(errors).length) {
      setFieldError(errors)
      setLoading(false)
      return
    }

    setFieldError({})

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/forgot-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      }
    )

    const data = await response.json()
    setLoading(false)

    if (data.error) {
      setFormError(data.message[0].messages[0].message)
    } else {
      setSuccess(true)
    }
  }

  return (
    <FormWrapper>
      {success ? (
        <FormSucess>
          <CheckCircleOutline />
          You just received an email!
        </FormSucess>
      ) : (
        <>
          {!!formError && (
            <>
              <FormError>
                <ErrorOutline></ErrorOutline> {formError}
              </FormError>
            </>
          )}
          <form onSubmit={handleSubmit}>
            <TextField
              name="email"
              placeholder="Email"
              type="email"
              icon={<Email />}
              onInputChange={(v) => handleInput('email', v)}
              initialValue={values.email}
              error={fieldError?.email}
            />
            <Button type="submit" size="large" fullWidth disabled={loading}>
              {loading ? <FormLoading /> : <span>Send email</span>}
            </Button>
          </form>
        </>
      )}
    </FormWrapper>
  )
}

export default FormForgotPassword
