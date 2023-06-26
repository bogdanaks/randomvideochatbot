import { Navigate } from "react-router-dom"

import { useAppSelector } from "app/hooks"

import { selectIsAuth } from "entities/auth/model/slice"
import { SignInForm } from "entities/auth/ui/sign-in-form"

import { Wrapper } from "shared/ui/wrapper"

const SignInPage = () => {
  const isAuth = useAppSelector(selectIsAuth)

  if (isAuth) return <Navigate to="/" replace />

  return (
    <Wrapper>
      <div className="flex flex-col w-full h-full items-center justify-center pr-12 pl-12">
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl flex">
          ВидеоЧат Рулетка
        </h1>
        <div className="w-full">
          <SignInForm />
        </div>
      </div>
    </Wrapper>
  )
}

export default SignInPage
