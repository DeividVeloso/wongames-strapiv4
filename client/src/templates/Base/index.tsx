import { Container } from 'components/Container'
import Footer from 'components/Footer'
import Menu from 'components/Menu'
import * as S from './styles'
import { useSession } from 'next-auth/react'

export type BaseTemplateProps = {
  children: React.ReactNode
}

const Base = ({ children }: BaseTemplateProps) => {
  const { data: session, status } = useSession()

  return (
    <section>
      <S.Wrapper>
        <Container>
          <Menu username={session?.user?.name} status={status} />
        </Container>
        <S.Content>{children}</S.Content>
        <S.SectionFooter>
          <Container>
            <Footer />
          </Container>
        </S.SectionFooter>
      </S.Wrapper>
    </section>
  )
}

export default Base
