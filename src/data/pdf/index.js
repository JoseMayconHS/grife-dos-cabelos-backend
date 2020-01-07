exports.header = `
  <div>
    <p style='text-align: center'><h3>Grifi Dos Cabelos - Solicitação de pedido</h3></p>
  </div>
`

exports.footer = `
  <span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>
`

const doTr = data => data.reduce((acc, curr) => acc + `
  <tr>
    <th scope="row">${ curr.index }</th>
    <td>${ curr.title }</td>
    <td>${ curr.price }</td>
    <td>${ curr.brand }</td>
    <td>${ curr.qtd }</td>
    <td>${ curr.tot }</td>
  </tr>
`, '')

exports.template = ({ infos, tableData }) => 
  `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
    <title>Document</title>
    <style>
      dl {
        text-align: center;
      }

      dl dt {
        font-size: 1.5em;
        margin-bottom: 3px
      }
      table {
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <header>
      <div style='text-align: center; font-size: 2em;'>
        Grifi Dos Cabelos - Solicitação de pedido
      </div>
    </header>
    <div>

      <div>
        <dl>
          <dt>Informações do pedido</dt>
          <dd>
            <strong>Cliente:</strong> ${ infos.client }
          </dd>
          <dd>
            <strong>Telefone:</strong> ${ infos.cellphone }
          </dd>
          <dd>
            <strong>Total de itens:</strong> ${ infos.totItem }
          </dd>
          <dd>
            <strong>Total a pagar:</strong> ${ infos.totPrice }
          </dd>
          <dd>
            <strong>Data:</strong> ${ infos.schendule }
          </dd>
        </dl>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nome</th>
            <th scope="col">Valor</th>
            <th scope="col">Marca</th>
            <th scope="col">Quantidade</th>
            <th scope="col">Saldo</th>
          </tr>
        </thead>
        <tbody class='table-striped'>
          ${ doTr(tableData) }
        </tbody>
      </table>
    </div>
  </body>
</html>
`
