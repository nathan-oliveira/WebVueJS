import { http } from './config'

export default {
  listar:() => {
    return http.get('books')
  },

  salvar:(books) => {
    if(books.id == null) {
      return http.post('books', books)
    } else {
      return http.put(`books/${books.id}`, books)
    }
  },

  deletar:(books) => {
    return http.delete(`books/${books.id}`)
  }
}