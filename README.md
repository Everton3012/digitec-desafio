# Sistema de Controle de Estoque e Rotinas da Recepção

Aplicação web desenvolvida como desafio prático para o processo seletivo de **Estágio em Desenvolvimento de Sistemas da Digitec**.

## Demonstração

A aplicação está disponível para teste online:

**https://everton3012.github.io/digitec-desafio/**

## Sobre o projeto

O sistema foi desenvolvido para auxiliar no controle de materiais de escritório e na organização das rotinas da recepção, centralizando informações que normalmente seriam controladas por planilhas ou registros manuais.

A aplicação permite gerenciar materiais, acompanhar os níveis de estoque, registrar entradas e saídas, controlar solicitações realizadas por colaboradores e gerar relatórios em CSV.

## Funcionalidades

* Cadastro, edição e exclusão de materiais
* Controle de quantidade e estoque mínimo
* Identificação de materiais em estoque, com estoque baixo ou esgotados
* Registro de entradas e saídas de estoque
* Histórico detalhado de movimentações
* Pesquisa e filtros de materiais
* Cadastro de solicitações de materiais
* Controle de prioridade e status das solicitações
* Aprovação, cancelamento e entrega de solicitações
* Atualização automática do estoque após a entrega de materiais
* Registro de data e hora das movimentações e entregas
* Dashboard com indicadores gerais
* Gráficos de situação do estoque e movimentações
* Exportação do estoque para CSV
* Exportação de movimentações por período para CSV
* Exportação de solicitações por período para CSV
* Tema claro e escuro com preferência persistida
* Feedbacks visuais e confirmações para ações importantes
* Persistência dos dados no navegador
* Interface responsiva para desktop e dispositivos móveis

## Tecnologias

* HTML5
* CSS3
* JavaScript
* ES Modules
* LocalStorage
* Chart.js
* Lucide Icons

## Estrutura do projeto

```text
├── index.html
│
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
    │   ├── feedback.js
    │   ├── confirm.js
    │   ├── export-dialog.js
    │   ├── theme.js
    │   │
    │   ├── inventory/
    │   │   ├── inventory-ui.js
    │   │   ├── material-form.js
    │   │   ├── material-details.js
    │   │   ├── materials-table.js
    │   │   └── export.js
    │   │
    │   ├── movements/
    │   │   ├── index.js
    │   │   ├── form.js
    │   │   ├── table.js
    │   │   └── export.js
    │   │
    │   └── requests/
    │       ├── index.js
    │       ├── form.js
    │       ├── table.js
    │       ├── request-details.js
    │       └── export.js
    │
    └── utils/
        ├── formatters.js
        └── csv.js
```

## Armazenamento

Os dados são armazenados localmente no navegador utilizando a API `localStorage`.

São mantidos registros de materiais, movimentações de estoque, solicitações e preferência de tema. Não é necessário configurar banco de dados ou servidor backend para utilizar a aplicação.

## Execução

### Demonstração online

A aplicação pode ser acessada diretamente pelo GitHub Pages:

**https://everton3012.github.io/digitec-desafio/**

### Execução local

O projeto não necessita de instalação de pacotes ou processo de build.

Por utilizar JavaScript com ES Modules, recomenda-se executar a aplicação através de um servidor HTTP local.

Uma opção é utilizar a extensão **Live Server** no Visual Studio Code:

1. Abra a pasta do projeto no VS Code.
2. Clique com o botão direito no arquivo `index.html`.
3. Selecione **Open with Live Server**.
4. A aplicação será aberta no navegador.

> É necessário acesso à internet para o carregamento do **Lucide Icons** e do **Chart.js**, utilizados através de CDN.

## Observações

Os dados permanecem armazenados no navegador utilizado para executar a aplicação. A limpeza dos dados do site ou do `localStorage` removerá os registros cadastrados e a preferência de tema.

Como os dados são armazenados localmente, diferentes navegadores ou dispositivos possuem conjuntos de dados independentes.
