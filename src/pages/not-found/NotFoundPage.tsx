import { Link } from 'react-router-dom'

import { Button } from '@/components/Button'
import './styles.css'

function NotFoundPage() {
  return (
    <main className="notfound-style-1">
      <section className="notfound-style-2">
        <span className="notfound-style-3">404</span>
        <h1 className="notfound-style-4">Страница не найдена</h1>
        <p className="notfound-style-5">
          Такой страницы нет или адрес был изменен.
        </p>
        <Button asChild className="notfound-style-6">
          <Link to="/">На главную</Link>
        </Button>
      </section>
    </main>
  )
}

export default NotFoundPage
