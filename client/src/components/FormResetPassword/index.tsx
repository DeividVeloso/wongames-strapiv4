import Button from 'components/Button'
import TextField from 'components/TextField'
import { ErrorOutline, Lock } from '@styled-icons/material-outlined'
import { FormWrapper, FormLoading, FormError } from 'components/Form'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FieldErrors, resetValidate } from 'utils/validations'

const FormResetPassword = () => {
  const [fieldError, setFieldError] = useState<FieldErrors>()
  const [formError, setFormError] = useState('')

  const [loading, setLoading] = useState(false)

  const [values, setValues] = useState({
    password: '',
    confirm_password: ''
  })

  const routes = useRouter()
  const { query } = routes

  const handleInput = (field: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoading(true)

    const errors = resetValidate(values)

    if (Object.keys(errors).length) {
      setFieldError(errors)
      setLoading(false)
      return
    }

    setFieldError({})

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: values.password,
          passwordConfirmation: values.confirm_password,
          code: query.code
        })
      }
    )

    const data = await response.json()
    if (data.error) {
      setFormError(data.message[0].messages[0].message)
      setLoading(false)
    } else {
      signIn('credentials', {
        email: data.user.email,
        password: values.password,
        callbackUrl: '/'
      })
    }
  }

  return (
    <FormWrapper>
      {!!formError && (
        <>
          <FormError>
            <ErrorOutline></ErrorOutline> {formError}
          </FormError>
        </>
      )}
      <form onSubmit={handleSubmit}>
        <TextField
          name="password"
          placeholder="Password"
          type="password"
          icon={<Lock />}
          onInputChange={(v) => handleInput('password', v)}
          error={fieldError?.password}
        />
        <TextField
          name="confirm_password"
          placeholder="Confirm password"
          type="password"
          icon={<Lock />}
          onInputChange={(v) => handleInput('confirm_password', v)}
          error={fieldError && fieldError['confirm_password']}
        />
        <Button type="submit" size="large" fullWidth disabled={loading}>
          {loading ? <FormLoading /> : <span>Reset password</span>}
        </Button>
      </form>
    </FormWrapper>
  )
}

export default FormResetPassword
