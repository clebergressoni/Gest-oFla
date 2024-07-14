from flask import Flask, render_template, request, redirect, url_for, flash
import sqlite3
import re

app = Flask(__name__)

connect = sqlite3.connect('jogadores.db')
cursor = connect.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS jogadores (
               id INTEGER PRIMARY KEY AUTOINCREMENT,
               nome TEXT NOT NULL,
               idade integer NOT NULL,
               posicao TEXT NOT NULL)

''')

connect.commit() #Salva
connect.close() #Fecha

@app.route('/')
def index():
    connect = sqlite3.connect('jogadores.db')
    cursor = connect.cursor()
    cursor.execute('SELECT * FROM jogadores')
    jogadores = cursor.fetchall()
    connect.close()
    return render_template('index.html', jogadores = jogadores)

@app.route('/novo_jogador', methods = ['GET', 'POST'])
def novo_jogador():
    if request.method == 'POST':
        nome = request.form['nome']
        idade = request.form['idade']
        posicao = request.form['posicao']

        connect = sqlite3.connect('jogadores.db')
        cursor = connect.cursor()
        cursor.execute('''  
            INSERT INTO jogadores (nome, idade, posicao)
            VALUES (?, ?, ?)''', 
            (nome, idade, posicao))
        connect.commit()
        connect.close()
        return redirect(url_for('index'))
    return render_template('novo_jogador.html')

@app.route('/limpar_jogador')
def limpar_jogador():
    connect = sqlite3.connect('jogadores.db')
    cursor = connect.cursor()
    cursor.execute('DELETE FROM jogadores')
    connect.commit()
    connect.close()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug = True)