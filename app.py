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
               posicao TEXT NOT NULL,
               idade integer NOT NULL)
''')

connect.commit() #Salva
connect.close() #Fecha

app.route('/')
def index():
    connect = sqlite3.connect('jogadores.db')
    cursor = connect.cursor()
    cursor.execute('SELECT * FROM jogadores')
    jogadores = cursor.fetchall()
    connect.close()
    return render_template('index.html', jogadores = jogadores)
