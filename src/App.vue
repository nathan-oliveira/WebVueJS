<template>
  <div id="app">
    <nav>
      <div class="nav-wrapper blue darken-1">
        <a href="#" class="brand-logo center">Books Front</a>
      </div>
    </nav>

    <div class="container" style="padding: 60px 0px;">
      <div id="erros"></div>
      <form @submit.prevent="salvar" style="margin-top: 30px;" id="form">
        <div>
          <label>Titulo</label>
          <input type="text" v-model="books.titulo" placeholder="Titulo" />
        </div>

        <div>
          <label>Editora</label>
          <input type="text" v-model="books.editora" placeholder="Editora" />
        </div>

        <div>
          <label>Foto</label>
          <input type="text" v-model="books.foto" placeholder="Foto" />
        </div>
        <div>
          <label>Autor</label>
        </div>
        <div class="chips">
          <div class="chip" tabindex="0">
            <ul id="list"></ul>
          </div>
          <input class="input" id="autor" placeholder="Autor" />
        </div>
        <br />
        <button class="waves-effect waves-light btn-small">
          Salvar
          <i class="material-icons left">save</i>
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Editora</th>
            <th>OPÇÕES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book of ListagemBooks" :key="book.id">
            <td>{{ book.id }}</td>
            <td>{{ book.titulo }}</td>
            <td>{{ book.editora }}</td>
            <td>
              <button @click="editar(book)" class="waves-effect btn-small blue darken-1">
                <i class="material-icons">create</i>
              </button>
              &nbsp;
              <button @click="remover(book)" class="waves-effect btn-small red darken-1">
                <i class="material-icons">delete_sweep</i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import Produto from "./services/produtos";

export default {
  data() {
    return {
      books: {
        id: null,
        titulo: null,
        editora: null,
        foto: null,
        autores: []
      },
      ListagemBooks: []
    };
  },
  mounted() {
    this.listagem()

    let txt = document.getElementById("autor");
    let list = document.getElementById("list");

    document.getElementById("form").addEventListener('keypress', function(e) {
      var keyCode = e.keyCode || e.which;
      if (keyCode === 13) {
        e.preventDefault();
        return false;
      }
    });

    txt.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        let val = txt.value;
        if (val !== "") {
          if (this.books.autores.indexOf(val) >= 0) {
            alert("Autor duplicado!");
          } else {
            this.books.autores.push(val);
            render();
            txt.value = "";
            txt.focus();
          }
        } else {
          alert("Autor não pode ser vazio!");
        }
      }
    });

    const render = () =>{
      list.innerHTML = "";
      this.books.autores.map((item, index) => {
        list.innerHTML += `<li>
          <span>${item}</span>
          <a href="javascript: apagar(${index})"><i class="material-icons close">close</i></a>
        </li>`;
      });
    }

    const apagar = (i) => {
      this.books.autores = this.books.autores.filter((item) => this.books.autores.indexOf(item) != i);
      render();
    }

    render();
  },
  methods: {
    listagem() {
      Produto.listar().then(resp => {
        this.ListagemBooks = resp.data.dados;
      });
    },
    salvar() {
      let erros = document.getElementById("erros");

      Produto.salvar(this.books)
        .then(resp => {
          this.clear()
          this.listagem()
        })
        .catch(err => {
          if(err.response.data.error == true)
            erros.innerHTML = `<div class="waves-light red lighten-2 errors">${err.response.data.msg}</div>`
          else
            erros.innerHTML = "";
        })

    },
    editar(books) {
      let list = document.getElementById("list");

      this.clear()

      this.books = books
      this.books.autores.map((item, index) => {
        list.innerHTML += `<li>
          <span>${item}</span>
          <a href="javascript: remove(${index})"><i class="material-icons close">close</i></a>
        </li>`;
      });
    },
    remover(books) {
      if(confirm('Deseja excluir o livro?')) {
        let erros = document.getElementById("erros");

        Produto.deletar(books)
          .then(resp => {
            this.clear()
            this.listagem()
          })
          .catch(err => {
            if(err.response.data.error == true)
              erros.innerHTML = `<div class="waves-light red lighten-2 errors">${err.response.data.msg}</div>`
            else
              erros.innerHTML = "";
          })
      }
    },
    clear() {
      let list = document.getElementById("list");
      let erros = document.getElementById("erros");
      let autor = document.getElementById("autor");

      list.innerHTML = "";
      erros.innerHTML = "";
      autor.value = "";

      this.books = { titulo: null, editora: null, foto: null, autores: [] }
    }
  }
};
</script>

<style>
.chip {
  background-color: transparent !important;
  padding: 0 !important;
  height: 0px;
}

.chips .input {
  width: 320px !important;
}

.chip:hover {
  cursor: text;
}

.chip ul {
  list-style: none;
  margin: 0px;
  padding: 0px;
  position: relative;
  display: block;
}

.chip ul li {
  display: inline-block;
  height: 32px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  line-height: 32px;
  padding: 0 12px;
  border-radius: 16px;
  background-color: #e4e4e4;
  margin-bottom: 5px;
  margin-right: 5px;
}

.chip ul li a {
  color: #5d5d5d;
}

.errors {
  padding: 16px;
  width: 100%;
  color: white;
  text-align: center;
  border-radius: 8px;
  -webkit-box-shadow: 0px 0px 25px -6px #000000;
  box-shadow: 0px 0px 25px -6px #00000063;
}
</style>
