import { StyledContainer, StyledTitle } from './styles.css'

export default function Home() {
  return (
    <div className={StyledContainer}>
      <h1 className={StyledTitle}>Hello World</h1>
    </div>
  )
}

export const runtime = 'experimental-edge'
