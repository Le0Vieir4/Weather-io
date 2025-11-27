# README – Exemplo de Uso de Funções Entre Módulos em Python

Este arquivo demonstra como organizar funções em múltiplos módulos Python e importar retornos entre eles.

---

## 📁 Estrutura de Pastas

```
meu_projeto/
│
├── main.py
├── utils.py
└── README.md
```

---

## 📄 utils.py

```python
# Este módulo contém funções auxiliares

def somar(a, b):
    return a + b


def obter_mensagem():
    return "Função executada com sucesso!"
```

---

## 📄 main.py

```python
# Importando funções do módulo utils
from utils import somar, obter_mensagem

resultado = somar(10, 5)
mensagem = obter_mensagem()

print("Resultado da soma:", resultado)
print("Mensagem:", mensagem)
```

---

## ▶️ Como Executar

1. Abra o terminal na pasta do projeto.
2. Execute:

```
python main.py
```

Saída esperada:

```
Resultado da soma: 15
Mensagem: Função executada com sucesso!
```

---

Se quiser gerar outro exemplo mais avançado (classes, services, API, etc.), é só pedir!
