# grife-dos-cabelos-API
API para auxiliar no desenvolvimento do aplicativo.

## App
 - [Projeto](https://github.com/Maycon-PE/grife-dos-cabelos-App "Ir ao repositório")

## Dashboard 
 - [Projeto](https://github.com/Maycon-PE/grife-dos-cabelos-Dash  "Ir ao repositório")

## Endpointers

- POST
	- `/app/user/signup` : Cria um usuário;
	- `/app/user/signin` : Realiza o login do usuário;
	- `/app/expo` : Regista o dispositivo no bando de dados;
	- `/admin/dashboard/expo` : Manda notificação à todos os dispositivos conectados ao app;
	- `/admin/dashboard/brand` : Cria uma marca;
	- `/admin/dashboard/product` : Cria um produto;
	- `/admin/dashboard/reconnect` : Reconecta à aplicação;
	- `/admin/dashboard/type` : Cria um tipo;
	- `/dashboard/signup` : Cria um administrador;
	- `/dashboard/signin` : Realiza o login do administrador.
- GET
	- `/__origin__` : Retorna um `HTML` com informações básicas do projeto;
	- `/already` : Verifica se já há um administrador cadastrado;
	- `/private/app/swiper` : Retorna produtos para o Swiper Component do App;
	- `/private/both/brand/:page` : Busca marcas;	
	- `/private/both/product/:page` : Busca todos os produtos;
	- `/private/both/type/:page`: Busca todos os tipos;
	-	`/private/both/product/by/:page` : Realiza um filtro nos produtos;
	- `/private/both/brand/by/:page` : Realiza um filtro nas marcas;
	- `/private/both/type/by/:page` : Realiza um filtro nos tipos;
	- `/private/both/product/search/:word/:page` : Pesquisa por porduto;
	- `/private/both/brand/search/:word/:page` : Pesquisa por marcas;
	- `/admin/dashboard/qtd/user` : Retorna a quantidade de usuários;
	- `/admin/dashboard/qtd/product` : Retorna a quantidade de produtos;
	- `/admin/dashboard/qtd/brand` : Retorna a quantidade de marcas;
	- `/admin/dashboard/qtd/expo` : Retorna a quantidade de dispositivos **(Armazenado somente ao abrir o app e não idêntifica a desinstalação do mesmo)**;
	- `/admin/dashboard/notifications` : Retorna as notificações recentes;
	- `/admin/dashboard/user/search/:word/:page` : Pesquisa por clientes;
	- `/admin/dashboard/user/:page` : Busca os usuários;
	- `/admin/dashboard/form` : Busca marcas e tipos para o formulário;
	- `/admin/dashboard/cards` : Retorna informações para os cards no Dashboard **(Quantidade de documentos em cada coleção)**
- PUT
	- `/private/app/user` : Atualiza um usuário;
	- `/admin/dashboard/user/:id` : Altera o estado do cadastro do cliente;
	- `/admin/dashboard/product/:id` : Atualiza um produto;	
	- `/admin/dashboard/brand/:id` : Atualiza uma marca;
	- `/admin/dashboard/type/:id` : Atualiza um tipo;
	- `/admin/dashboard/product/thumbnail/:id` : Atualiza a imagem do produto;
	- `/admin/dashboard/brand/thumbnail/:id` : Atualiza a imagem da marca.
- DELETE
	- `/admin/dashboard/brand/:id` : Delete uma marca;
	- `/admin/dashboard/product/:id` : Deleta um produto;
	- `/admin/dashboard/type/:id` : Deleta um tipo;
	- `/admin/dashboard/user/:id` : Deleta um cliente;
	- `/admin/dashboard/notification/:index` : Deleta uma notificação das recentes.

