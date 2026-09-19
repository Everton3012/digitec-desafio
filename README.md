# Sistema de Controle de Estoque e Rotinas da Recepção

Aplicação web desenvolvida como desafio prático para o processo seletivo de **Estágio em Desenvolvimento de Sistemas da Digitec**.

## Sobre o projeto

O sistema foi desenvolvido para auxiliar no controle de materiais de escritório e na organização das rotinas da recepção, centralizando informações que normalmente seriam controladas por planilhas ou registros manuais.

A aplicação permite gerenciar materiais, acompanhar o estoque, registrar entradas e saídas e controlar solicitações realizadas por colaboradores.

## Funcionalidades

* Cadastro, edição e exclusão de materiais
* Controle de quantidade e estoque mínimo
* Identificação de materiais com estoque baixo ou esgotado
* Registro de entradas e saídas de estoque
* Histórico de movimentações
* Pesquisa e filtros de materiais
* Cadastro de solicitações de materiais
* Controle de prioridade e status das solicitações
* Registro de entrega de materiais com atualização automática do estoque
* Dashboard com indicadores gerais

## Tecnologias

* HTML5
* CSS3
* JavaScript (ES Modules)
* LocalStorage

## Estrutura do projeto

```text
├── index.html
├── css/
│   ├── reset.css
│   ├── style.css
│   ├── forms.css
│   ├── tables.css
│   └── responsive.css
│
└── js/
    ├── app.js
    ├── storage.js
    │
    ├── constants/
    │   ├── domain.js
    │   └── events.js
    │
    ├── inventory/
    │   ├── materials.js
    │   └── movements.js
    │
    ├── requests/
    │   └── requests.js
    │
    ├── ui/
    │   ├── dashboard.js
    │   ├── navigation.js
    │   ├── inventory/
    │   ├── movements/
    │   └── requests/
    │
    └── utils/
        └── formatters.js
```

## Armazenamento

Os dados são armazenados localmente no navegador utilizando a API `localStorage`.

Não é necessário configurar banco de dados ou servidor backend para utilizar a aplicação.

## Execução

O projeto não possui dependências externas nem necessita de instalação de pacotes.

Por utilizar JavaScript com ES Modules, recomenda-se executar o projeto através de um servidor HTTP local.

Por exemplo, utilizando a extensão **Live Server** no Visual Studio Code:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito no arquivo `index.html`.
3. Selecione **Open with Live Server**.
4. A aplicação será aberta no navegador.

## Observações

Os dados permanecem armazenados no navegador utilizado para executar a aplicação. A limpeza dos dados do site ou do `localStorage` removerá os registros cadastrados.
