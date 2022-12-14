import React, { useEffect, useState } from 'react'
import Api from './api/Api'
import MovieRow from './components/MovieRow'
import './App.css'
import FeatureMovie from './components/FeatureMovie'
import Header from './components/Header'
import ReactDOM from 'react-dom'

// eslint-disable-next-line react/display-name
export default () => {
  const [movieList, setMovieList] = useState([])
  const [featureData, setFeatureData] = useState(null)
  const [blackHeader, setBlackHeader] = useState(false)

  useEffect(() => {
    const loadAll = async () => {
      //pegando a lista total
      let list = await Api.getHomeList()
      setMovieList(list)

      //pegando o Featured
      let originals = list.filter(i => i.slug === 'originals')
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1)
      )
      let chosen = originals[0].items.results[randomChosen]
      let chosenInfo = await Api.getMovieInfo(chosen.id, 'tv')
      setFeatureData(chosenInfo)
    }
    loadAll()
  }, [])

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true)
      } else {
        setBlackHeader(false)
      }
    }
    window.addEventListener('scroll', scrollListener)
    return () => {
      window.removeEventListener('scroll', scrollListener)
    }
  }, [])

  return (
    <div className="page">
      <Header black={blackHeader} />
      {featureData && <FeatureMovie item={featureData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        Feito por{' '}
        <a href="https://www.linkedin.com/in/carlos-felipe-leopoldino/">
          Felipe Leopoldino
        </a>
        <br />
        Direitos de imagem para Netflix <br />
        Dados pego do site{' '}
        <a href="https://www.themoviedb.org/">Themoviedb.org</a> .
      </footer>

      {movieList.length <= 0 && (
        <div className="loading">
          <img
            src="https://media.filmelier.com/noticias/br/2020/03/Netflix_LoadTime.gif"
            alt=""
          />
        </div>
      )}
    </div>
  )
}
