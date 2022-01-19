# backend-deliveryMarmita

<h4 align="center">
    :computer: Api Delivery de Marmita - Brasa Pousada Restaurante
</h4>

<p align="center">
    <a href="#-projeto">Projeto</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#rocket-tecnologias">Tecnologias</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#user-content-clipboard-instruções">Instruções</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-gerar-o-build">Build</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
    <a href="#-ajustes-e-melhorias">Melhorias</a>
</p>

<div align="center">
    <img alt="Modelagem" src="https://raw.githubusercontent.com/ygor-salles/backend-deliveryMarmita/main/assets/modeloBD.PNG" alt="ModelagemBanco" >
</div>
 
----
 ## 💻 Projeto

API no NestJS. Aplicativo backend para cadastro de marmitas e bebidas, inclusão de fretes e acréscimos de marmitas, visualização e filtragem de pedidos e histórico de pedidos, consultas de dashboard.

---

## :rocket: Tecnologias

- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Typeorm](https://typeorm.io/)
- [Docker](https://www.docker.com/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcryptJS](https://openbase.com/js/bcryptjs/documentation)
- [handlebars](https://handlebarsjs.com/)
- [nodemailer](https://nodemailer.com/about/)
- [passport-jwt](http://www.passportjs.org/packages/passport-jwt/)
- [jest](https://jestjs.io/pt-BR/)

---

## :clipboard: Instruções

### VARIÁVEIS DE AMBIENTE

- Criar na raiz da pasta do projeto um arquivo `.env` e preencher as informações conforme se encontra no arquivo `.env.example`.

### DOCKER

- Após preenchida as variáveis de ambiente, subir o container do docker pelo terminal com o comando:

```bash
docker-compose up
```

- Para finalizar o processo do docker

```bash
docker-compose down
```

### DEPENDÊNCIAS

- No terminal executar o comando para instalar as dependências:

```bash
yarn
```

### START

- Finalizado! Basta agora executar a aplicação backend com o seguinte comando:

```bash
    # development
    $ yarn start

    # watch mode
    $ yarn start:dev

    # production mode
    $ yarn start:prod
```

### Collection requests - insomnia
 
 - As collections das requisições de backend `Collection-Insomnia.json` são encontradas dentro da pasta `assets` deste projeto.


---

## 📬 Gerar o build

```bash
yarn build
```

---

## 📌 Ajustes e melhorias

O projeto ainda está em desenvolvimento e as próximas atualizações serão voltadas nas seguintes tarefas:

- [ ] Inserir regra do horário de funcionaento do restaurante
- [ ] Configurar projeto para execução de migrations
