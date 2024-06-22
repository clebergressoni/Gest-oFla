const modal = document.querySelector('.modal-container')
const tbody = document.querySelector('tbody')
const sNome = document.querySelector('#m-nome')
const sFuncao = document.querySelector('#m-funcao')
const sNascimento = document.querySelector('#m-nascimento')
const btnSalvar = document.querySelector('#btnSalvar')

let itens
let id

function calcularIdade(dataNascimento) {
    const hoje = new Date();
    const nascimento = new Date(dataNascimento);
    let idade_real = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
        idade_real--;
    }
    return idade_real;
}

function openModal(edit = false, index = 0) {
    modal.classList.add('active')

    modal.onclick = e => {
        if (e.target.className.indexOf('modal-container') !== -1) {
            modal.classList.remove('active')
        }
    }

    if (edit) {
        sNome.value = itens[index].nome
        sFuncao.value = itens[index].funcao
        sNascimento.value = itens[index].nascimento
        id = index
    } else {
        sNome.value = ''
        sFuncao.value = ''
        sNascimento.value = ''
    }
}

function editItem(index) {
    openModal(true, index)
}

function deleteItem(index) {
    itens.splice(index, 1)
    setItensBD()
    loadItens()
}

function insertItem(item, index) {
    let tr = document.createElement('tr')
    const idade = calcularIdade(item.nascimento) // Calcular idade

    tr.innerHTML = `
        <td>${item.nome}</td>
        <td>${item.funcao}</td>
        <td>${idade} anos</td> <!-- Exibir idade -->
        <td class="acao">
            <button onclick="editItem(${index})"><i class='bx bx-edit'></i></button>
        </td>
        <td class="acao">
            <button onclick="deleteItem(${index})"><i class='bx bx-trash'></i></button>
        </td>
    `
    tbody.appendChild(tr)
}

btnSalvar.onclick = e => {
    if (sNome.value === '' || sFuncao.value === '' || sNascimento.value === '') {
        return
    }

    e.preventDefault();

    const idade = calcularIdade(sNascimento.value)

    if (id !== undefined) {
        itens[id].nome = sNome.value
        itens[id].funcao = sFuncao.value
        itens[id].nascimento = sNascimento.value
    } else {
        itens.push({ 'nome': sNome.value, 'funcao': sFuncao.value, 'nascimento': sNascimento.value })
    }

    setItensBD()

    modal.classList.remove('active')
    loadItens()
    id = undefined
}

function loadItens() {
    itens = getItensBD()
    tbody.innerHTML = ''
    itens.forEach((item, index) => {
        insertItem(item, index)
    })
}

const getItensBD = () => JSON.parse(localStorage.getItem('dbfunc')) ?? []
const setItensBD = () => localStorage.setItem('dbfunc', JSON.stringify(itens))

loadItens()
