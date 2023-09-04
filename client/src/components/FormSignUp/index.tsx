import Link from 'next/link'
import Button from 'components/Button'
import TextField from 'components/TextField'
import {
  AccountCircle,
  Email,
  ErrorOutline,
  Lock
} from '@styled-icons/material-outlined'
import { FormWrapper, FormLink, FormLoading, FormError } from 'components/Form'
import { useMutation } from '@apollo/client'
import { MUTATION_REGISTER } from 'graphql/mutations/register'
import { UsersPermissionsRegisterInput } from 'graphql/generated/globalTypes'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { FieldErrors, signUpValidate } from 'utils/validations'

const FormSignUp = () => {
  const [fieldError, setFieldError] = useState<FieldErrors>()
  const [formError, setFormError] = useState('')

  const [values, setValues] = useState<UsersPermissionsRegisterInput>({
    username: '',
    email: '',
    password: ''
  })

  const [createUser, { error, loading }] = useMutation(MUTATION_REGISTER, {
    onError: (err) => {
      return setFormError(
        err?.graphQLErrors[0]?.extensions.exception.data.message[0].messages[0]
          .message
      )
    }, //Catch erros
    onCompleted: () => {
      if (!error) {
        signIn('credentials', {
          email: values.email,
          password: values.password,
          callbackUrl: '/'
        })
      }
    }
  })

  const handleInput = (field: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [field]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const errors = signUpValidate(values)

    if (Object.keys(errors).length) {
      setFieldError(errors)
      return
    }

    setFieldError({})

    createUser({
      variables: {
        input: {
          username: values.username,
          email: values.email,
          password: values.password
        }
      }
    })
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
          name="username"
          placeholder="Username"
          type="text"
          icon={<AccountCircle />}
          onInputChange={(v) => handleInput('username', v)}
          error={fieldError?.username}
        />
        <TextField
          name="email"
          placeholder="Email"
          type="email"
          icon={<Email />}
          onInputChange={(v) => handleInput('email', v)}
          error={fieldError?.email}
        />
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

        <Button size="large" fullWidth type="submit" disabled={loading}>
          {loading ? <FormLoading /> : <span>Sign up now</span>}
        </Button>

        <FormLink>
          Already have an account?{' '}
          <Link href="/sign-in">
            <a>Sign in</a>
          </Link>
        </FormLink>
      </form>
    </FormWrapper>
  )
}

export default FormSignUp
